// Algorithm Art Gallery - Visualization Framework

class VisualizationFramework {
    constructor(canvasId, algorithmId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.algorithmId = algorithmId;

        this.isPlaying = false;
        this.isPaused = false;
        this.speed = 1;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.operations = 0;
        this.startTime = null;
        this.theme = 'neon';

        this.animationId = null;
        this.lastFrameTime = 0;

        this.setupCanvas();
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        // Set canvas size to match container
        this.canvas.width = Math.min(rect.width, 1200);
        this.canvas.height = Math.min(rect.height, 800);

        // Enable high DPI
        const dpr = window.devicePixelRatio || 1;
        const rect2 = this.canvas.getBoundingClientRect();

        this.canvas.width = rect2.width * dpr;
        this.canvas.height = rect2.height * dpr;
        this.ctx.scale(dpr, dpr);

        this.canvas.style.width = rect2.width + 'px';
        this.canvas.style.height = rect2.height + 'px';

        this.width = rect2.width;
        this.height = rect2.height;
    }

    clear() {
        const themeData = VISUAL_THEMES[this.theme];
        this.ctx.fillStyle = themeData.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    play() {
        this.isPlaying = true;
        this.isPaused = false;
        if (!this.startTime) {
            this.startTime = Date.now();
        }
    }

    pause() {
        this.isPlaying = false;
        this.isPaused = true;
    }

    reset() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.operations = 0;
        this.startTime = null;
        this.clear();
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setTheme(theme) {
        this.theme = theme;
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        return (Date.now() - this.startTime) / 1000;
    }

    // Easing functions
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Drawing utilities
    drawBar(x, y, width, height, color, highlighted = false) {
        const themeData = VISUAL_THEMES[this.theme];

        if (themeData.glow && highlighted) {
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = color;
        }

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);

        if (themeData.glow && highlighted) {
            this.ctx.shadowBlur = 0;
        }
    }

    drawCircle(x, y, radius, color, glow = false) {
        const themeData = VISUAL_THEMES[this.theme];

        if (themeData.glow && glow) {
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = color;
        }

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        if (themeData.glow && glow) {
            this.ctx.shadowBlur = 0;
        }
    }

    drawLine(x1, y1, x2, y2, color, width = 2) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawText(text, x, y, color = '#ffffff', size = 16, align = 'center') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px monospace`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
    }

    drawGrid(cellSize, color = 'rgba(255, 255, 255, 0.1)') {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.width; x += cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.height; y += cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    // Gradient utilities
    createGradient(x1, y1, x2, y2, colors) {
        const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
        colors.forEach((color, i) => {
            gradient.addColorStop(i / (colors.length - 1), color);
        });
        return gradient;
    }

    createRadialGradient(x, y, r1, r2, colors) {
        const gradient = this.ctx.createRadialGradient(x, y, r1, x, y, r2);
        colors.forEach((color, i) => {
            gradient.addColorStop(i / (colors.length - 1), color);
        });
        return gradient;
    }

    // Particle system
    createParticle(x, y, vx, vy, life, color) {
        return { x, y, vx, vy, life, maxLife: life, color };
    }

    updateParticle(particle, deltaTime) {
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        particle.life -= deltaTime;
        return particle.life > 0;
    }

    drawParticle(particle) {
        const alpha = particle.life / particle.maxLife;
        const size = 3 * alpha;

        this.ctx.globalAlpha = alpha;
        this.drawCircle(particle.x, particle.y, size, particle.color, true);
        this.ctx.globalAlpha = 1;
    }

    // Animation helpers
    lerp(start, end, t) {
        return start + (end - start) * t;
    }

    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    constrain(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Screenshot functionality
    screenshot() {
        return this.canvas.toDataURL('image/png');
    }

    // Save as image
    saveImage(filename = 'algorithm-art.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.screenshot();
        link.click();
    }
}

// Base Algorithm Visualizer class
class AlgorithmVisualizer extends VisualizationFramework {
    constructor(canvasId, algorithmId) {
        super(canvasId, algorithmId);
        this.data = [];
        this.steps = [];
        this.currentStepIndex = 0;
    }

    generateData(size) {
        // Override in subclass
        throw new Error('generateData must be implemented');
    }

    calculateSteps() {
        // Override in subclass
        throw new Error('calculateSteps must be implemented');
    }

    render() {
        // Override in subclass
        throw new Error('render must be implemented');
    }

    step() {
        if (this.currentStepIndex < this.steps.length) {
            this.currentStepIndex++;
            this.currentStep = this.currentStepIndex;
            this.render();
            return true;
        }
        return false;
    }

    animate(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = (timestamp - this.lastFrameTime) / 1000;
        this.lastFrameTime = timestamp;

        if (this.isPlaying) {
            // Adjust speed
            const frameDelay = 1 / (60 * this.speed);

            if (deltaTime >= frameDelay) {
                const hasNext = this.step();
                if (!hasNext) {
                    this.pause();
                }
                this.lastFrameTime = timestamp;
            }
        }

        this.render();

        if (this.isPlaying || this.isPaused) {
            this.animationId = requestAnimationFrame(this.animate.bind(this));
        }
    }

    start() {
        this.lastFrameTime = 0;
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Utility functions for algorithm visualization
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateRandomArray(size, min = 0, max = 100) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function generateSortedArray(size, min = 0, max = 100) {
    return Array.from({ length: size }, (_, i) => Math.floor(min + (max - min) * (i / (size - 1))));
}

function generateReverseSortedArray(size, min = 0, max = 100) {
    return Array.from({ length: size }, (_, i) => Math.floor(max - (max - min) * (i / (size - 1))));
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VisualizationFramework,
        AlgorithmVisualizer,
        shuffleArray,
        generateRandomArray,
        generateSortedArray,
        generateReverseSortedArray
    };
}
