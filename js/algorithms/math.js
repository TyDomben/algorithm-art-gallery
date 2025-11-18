// Mathematical Visualizations

class FibonacciSpiralVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'fibonacci-spiral');
        this.fibonacci = [];
    }

    generateData(size = 15) {
        this.fibonacci = this.generateFibonacci(size);
        this.calculateSteps();
    }

    generateFibonacci(n) {
        const fib = [0, 1];
        for (let i = 2; i < n; i++) {
            fib.push(fib[i - 1] + fib[i - 2]);
        }
        return fib;
    }

    calculateSteps() {
        this.steps = [];

        for (let i = 0; i <= this.fibonacci.length; i++) {
            this.steps.push({
                count: i,
                fibonacci: this.fibonacci.slice(0, i)
            });
        }

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const scale = Math.min(this.width, this.height) / 200;

        let x = centerX;
        let y = centerY;
        let angle = 0;

        this.ctx.lineWidth = 3;

        for (let i = 2; i < step.count; i++) {
            const size = this.fibonacci[i] * scale;
            const color = getThemeColorByIndex(this.theme, i % 7);

            // Draw square
            this.ctx.strokeStyle = color;
            this.ctx.globalAlpha = 0.3;
            this.ctx.strokeRect(x, y, size, size);
            this.ctx.globalAlpha = 1;

            // Draw arc (spiral)
            this.ctx.strokeStyle = getThemeColorByIndex(this.theme, 0);
            this.ctx.beginPath();
            this.ctx.arc(
                x + (angle % 4 === 0 ? size : 0),
                y + (angle % 4 === 3 ? size : 0),
                size,
                angle * Math.PI / 2,
                (angle + 1) * Math.PI / 2
            );
            this.ctx.stroke();

            // Update position for next square
            switch (angle % 4) {
                case 0: // Right
                    y -= size;
                    break;
                case 1: // Up
                    break;
                case 2: // Left
                    x -= size;
                    break;
                case 3: // Down
                    x -= size;
                    y -= size;
                    break;
            }

            angle++;

            // Draw Fibonacci number
            this.drawText(
                this.fibonacci[i].toString(),
                x + size / 2,
                y + size / 2,
                color,
                Math.min(14, size / 3)
            );
        }

        // Draw formula
        if (step.count > 0) {
            this.drawText(
                `F(${step.count - 1}) = ${this.fibonacci[step.count - 1] || 0}`,
                this.width / 2,
                30,
                getThemeColorByIndex(this.theme, 0),
                20
            );
        }

        this.operations = this.currentStepIndex;
    }
}

class MandelbrotVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'mandelbrot');
        this.zoom = 1;
        this.centerX = -0.5;
        this.centerY = 0;
        this.maxIterations = 100;
        this.imageData = null;
    }

    generateData() {
        this.calculateSteps();
    }

    calculateSteps() {
        const width = Math.floor(this.width);
        const height = Math.floor(this.height);
        const stepCount = 50;

        this.steps = [];

        for (let s = 0; s <= stepCount; s++) {
            const progress = s / stepCount;
            this.steps.push({
                progress: progress,
                maxIterations: Math.floor(20 + progress * 80)
            });
        }

        this.totalSteps = this.steps.length;
    }

    mandelbrot(cx, cy, maxIter) {
        let x = 0, y = 0;
        let iteration = 0;

        while (x * x + y * y <= 4 && iteration < maxIter) {
            const xtemp = x * x - y * y + cx;
            y = 2 * x * y + cy;
            x = xtemp;
            iteration++;
        }

        return iteration;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];
        const maxIter = step.maxIterations;

        const width = Math.floor(this.width);
        const height = Math.floor(this.height);

        // Create image data if needed
        if (!this.imageData) {
            this.imageData = this.ctx.createImageData(width, height);
        }

        const pixelSize = 2; // Render every 2nd pixel for performance

        for (let px = 0; px < width; px += pixelSize) {
            for (let py = 0; py < height; py += pixelSize) {
                // Map pixel to complex plane
                const x0 = (px / width - 0.5) * (4 / this.zoom) + this.centerX;
                const y0 = (py / height - 0.5) * (4 / this.zoom) + this.centerY;

                const iteration = this.mandelbrot(x0, y0, maxIter);

                let r, g, b;
                if (iteration === maxIter) {
                    r = g = b = 0;
                } else {
                    // Color based on iteration count
                    const t = iteration / maxIter;
                    const colors = VISUAL_THEMES[this.theme].colors;
                    const colorIndex = Math.floor(t * (colors.length - 1));
                    const color = colors[colorIndex];

                    r = parseInt(color.slice(1, 3), 16);
                    g = parseInt(color.slice(3, 5), 16);
                    b = parseInt(color.slice(5, 7), 16);
                }

                // Fill pixel block
                for (let dx = 0; dx < pixelSize && px + dx < width; dx++) {
                    for (let dy = 0; dy < pixelSize && py + dy < height; dy++) {
                        const index = ((py + dy) * width + (px + dx)) * 4;
                        this.imageData.data[index] = r;
                        this.imageData.data[index + 1] = g;
                        this.imageData.data[index + 2] = b;
                        this.imageData.data[index + 3] = 255;
                    }
                }
            }
        }

        this.ctx.putImageData(this.imageData, 0, 0);

        // Draw info
        this.drawText(
            `Iterations: ${maxIter}`,
            this.width / 2,
            30,
            getThemeColorByIndex(this.theme, 0),
            18
        );

        this.operations = this.currentStepIndex;
    }
}

class VoronoiVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'voronoi');
        this.points = [];
    }

    generateData(size = 20) {
        this.points = [];
        for (let i = 0; i < size; i++) {
            this.points.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                color: getThemeColorByIndex(this.theme, i % 7)
            });
        }
        this.calculateSteps();
    }

    calculateSteps() {
        this.steps = [];

        for (let i = 0; i <= this.points.length; i++) {
            this.steps.push({
                pointCount: i,
                points: this.points.slice(0, i)
            });
        }

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        if (step.points.length === 0) return;

        const pixelSize = 4; // Render every 4th pixel for performance

        // Draw Voronoi cells
        for (let x = 0; x < this.width; x += pixelSize) {
            for (let y = 0; y < this.height; y += pixelSize) {
                let minDist = Infinity;
                let closestPoint = null;

                for (const point of step.points) {
                    const dist = Math.hypot(x - point.x, y - point.y);
                    if (dist < minDist) {
                        minDist = dist;
                        closestPoint = point;
                    }
                }

                if (closestPoint) {
                    this.ctx.fillStyle = closestPoint.color;
                    this.ctx.fillRect(x, y, pixelSize, pixelSize);
                }
            }
        }

        // Draw points
        step.points.forEach((point, i) => {
            this.drawCircle(point.x, point.y, 6, '#ffffff', true);
            this.drawCircle(point.x, point.y, 4, point.color, false);
        });

        this.drawText(
            `Points: ${step.pointCount}`,
            this.width / 2,
            30,
            getThemeColorByIndex(this.theme, 0),
            18
        );

        this.operations = this.currentStepIndex;
    }
}

class PrimeSpiralVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'prime-spiral');
        this.primes = new Set();
        this.maxNumber = 400;
    }

    generateData() {
        this.generatePrimes(this.maxNumber);
        this.calculateSteps();
    }

    generatePrimes(n) {
        const isPrime = new Array(n + 1).fill(true);
        isPrime[0] = isPrime[1] = false;

        for (let i = 2; i * i <= n; i++) {
            if (isPrime[i]) {
                for (let j = i * i; j <= n; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        this.primes = new Set();
        for (let i = 2; i <= n; i++) {
            if (isPrime[i]) {
                this.primes.add(i);
            }
        }
    }

    calculateSteps() {
        this.steps = [];
        const stepSize = 10;

        for (let i = 0; i <= this.maxNumber; i += stepSize) {
            this.steps.push({
                maxNum: Math.min(i, this.maxNumber)
            });
        }

        this.totalSteps = this.steps.length;
    }

    getPosition(n, cellSize) {
        let x = 0, y = 0;
        let dx = 0, dy = -1;

        for (let i = 0; i < n; i++) {
            if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
                [dx, dy] = [-dy, dx];
            }
            x += dx;
            y += dy;
        }

        return { x, y };
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];
        const cellSize = 15;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        for (let n = 1; n <= step.maxNum; n++) {
            const pos = this.getPosition(n, cellSize);
            const x = centerX + pos.x * cellSize;
            const y = centerY + pos.y * cellSize;

            if (this.primes.has(n)) {
                const color = getThemeColorByIndex(this.theme, (n % 7));
                this.drawCircle(x, y, cellSize / 2.5, color, true);
            } else {
                this.ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
                this.ctx.fillRect(x - cellSize / 4, y - cellSize / 4, cellSize / 2, cellSize / 2);
            }
        }

        this.drawText(
            `Primes up to ${step.maxNum}`,
            this.width / 2,
            30,
            getThemeColorByIndex(this.theme, 0),
            18
        );

        this.operations = this.currentStepIndex;
    }
}

class PerlinNoiseVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'perlin-noise');
        this.particles = [];
        this.flowField = [];
        this.resolution = 20;
    }

    generateData(particleCount = 500) {
        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                prevX: Math.random() * this.width,
                prevY: Math.random() * this.height,
                color: getThemeColorByIndex(this.theme, i % 7)
            });
        }

        this.generateFlowField();
        this.calculateSteps();
    }

    noise(x, y) {
        // Simple pseudo-noise function
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        return (Math.sin(X * 12.9898 + Y * 78.233) * 43758.5453) % 1;
    }

    generateFlowField() {
        const cols = Math.floor(this.width / this.resolution);
        const rows = Math.floor(this.height / this.resolution);
        this.flowField = [];

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const angle = this.noise(x * 0.1, y * 0.1) * Math.PI * 4;
                this.flowField.push({
                    x: x * this.resolution,
                    y: y * this.resolution,
                    angle: angle
                });
            }
        }
    }

    calculateSteps() {
        this.steps = [];

        for (let i = 0; i < 200; i++) {
            this.steps.push({ frame: i });
        }

        this.totalSteps = this.steps.length;
    }

    render() {
        // Semi-transparent background for trail effect
        this.ctx.fillStyle = VISUAL_THEMES[this.theme].background + '10';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        // Update and draw particles
        this.particles.forEach(particle => {
            const col = Math.floor(particle.x / this.resolution);
            const row = Math.floor(particle.y / this.resolution);
            const index = row * Math.floor(this.width / this.resolution) + col;

            if (index >= 0 && index < this.flowField.length) {
                const field = this.flowField[index];
                const force = {
                    x: Math.cos(field.angle),
                    y: Math.sin(field.angle)
                };

                particle.prevX = particle.x;
                particle.prevY = particle.y;

                particle.x += force.x * 2;
                particle.y += force.y * 2;

                // Wrap around edges
                if (particle.x < 0) particle.x = this.width;
                if (particle.x > this.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.height;
                if (particle.y > this.height) particle.y = 0;

                // Draw trail
                this.ctx.strokeStyle = particle.color;
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.prevX, particle.prevY);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        });

        this.operations = this.currentStepIndex;
    }
}
