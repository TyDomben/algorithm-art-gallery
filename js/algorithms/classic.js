// Classic Algorithm Problems

class GameOfLifeVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'game-of-life');
        this.grid = null;
        this.gridSize = 50;
        this.cellSize = 0;
    }

    generateData(size = 50) {
        this.gridSize = size;
        this.cellSize = Math.min(this.width, this.height) / size;
        this.grid = this.generateGrid(size);
        this.calculateSteps();
    }

    generateGrid(size) {
        const grid = Array(size).fill(null).map(() =>
            Array(size).fill(null).map(() => Math.random() > 0.7 ? 1 : 0)
        );
        return grid;
    }

    countNeighbors(grid, x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;

                const newX = (x + i + this.gridSize) % this.gridSize;
                const newY = (y + j + this.gridSize) % this.gridSize;
                count += grid[newY][newX];
            }
        }
        return count;
    }

    evolve(grid) {
        const newGrid = grid.map(row => [...row]);

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const neighbors = this.countNeighbors(grid, x, y);

                if (grid[y][x] === 1) {
                    // Cell is alive
                    newGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    // Cell is dead
                    newGrid[y][x] = (neighbors === 3) ? 1 : 0;
                }
            }
        }

        return newGrid;
    }

    calculateSteps() {
        this.steps = [{ grid: this.grid.map(row => [...row]), generation: 0 }];

        let currentGrid = this.grid.map(row => [...row]);

        for (let i = 1; i <= 100; i++) {
            currentGrid = this.evolve(currentGrid);
            this.steps.push({
                grid: currentGrid.map(row => [...row]),
                generation: i
            });
        }

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (step.grid[y][x] === 1) {
                    const posX = x * this.cellSize;
                    const posY = y * this.cellSize;

                    const color = getThemeColorByIndex(this.theme, 0);
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(posX, posY, this.cellSize - 1, this.cellSize - 1);
                }
            }
        }

        // Draw generation counter
        this.drawText(
            `Generation: ${step.generation}`,
            this.width / 2,
            30,
            getThemeColorByIndex(this.theme, 0),
            20
        );

        this.operations = this.currentStepIndex;
    }
}

class TowersOfHanoiVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'towers-of-hanoi');
        this.numDisks = 5;
        this.towers = [[], [], []];
    }

    generateData(disks = 5) {
        this.numDisks = disks;
        this.towers = [[], [], []];

        // Initialize first tower with all disks
        for (let i = disks; i >= 1; i--) {
            this.towers[0].push(i);
        }

        this.calculateSteps();
    }

    hanoi(n, from, to, aux, towers, steps) {
        if (n === 1) {
            const disk = towers[from].pop();
            towers[to].push(disk);
            steps.push({
                towers: towers.map(t => [...t]),
                moving: { disk, from, to }
            });
            return;
        }

        this.hanoi(n - 1, from, aux, to, towers, steps);

        const disk = towers[from].pop();
        towers[to].push(disk);
        steps.push({
            towers: towers.map(t => [...t]),
            moving: { disk, from, to }
        });

        this.hanoi(n - 1, aux, to, from, towers, steps);
    }

    calculateSteps() {
        const towers = [[], [], []];
        for (let i = this.numDisks; i >= 1; i--) {
            towers[0].push(i);
        }

        this.steps = [{
            towers: towers.map(t => [...t]),
            moving: null
        }];

        this.hanoi(this.numDisks, 0, 2, 1, towers, this.steps);

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        const towerSpacing = this.width / 3;
        const towerX = [towerSpacing / 2, this.width / 2, this.width - towerSpacing / 2];
        const baseY = this.height * 0.8;
        const diskHeight = 20;
        const maxDiskWidth = towerSpacing * 0.7;

        // Draw towers (poles)
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        towerX.forEach(x => {
            this.ctx.fillRect(x - 4, baseY - this.numDisks * diskHeight - 50, 8, this.numDisks * diskHeight + 50);
            // Draw base
            this.ctx.fillRect(x - maxDiskWidth / 2 - 10, baseY, maxDiskWidth + 20, 5);
        });

        // Draw disks
        step.towers.forEach((tower, towerIndex) => {
            tower.forEach((diskSize, diskIndex) => {
                const diskWidth = (diskSize / this.numDisks) * maxDiskWidth;
                const x = towerX[towerIndex] - diskWidth / 2;
                const y = baseY - (diskIndex + 1) * diskHeight;

                const color = getThemeColorByIndex(this.theme, diskSize - 1);

                // Add glow effect for moving disk
                if (step.moving && step.moving.disk === diskSize) {
                    this.ctx.shadowBlur = 20;
                    this.ctx.shadowColor = color;
                }

                this.ctx.fillStyle = color;
                this.ctx.fillRect(x, y, diskWidth, diskHeight - 2);

                this.ctx.shadowBlur = 0;

                // Draw disk number
                this.drawText(
                    diskSize.toString(),
                    towerX[towerIndex],
                    y + diskHeight / 2,
                    '#ffffff',
                    12
                );
            });
        });

        // Draw move counter
        this.drawText(
            `Move: ${this.currentStepIndex}`,
            this.width / 2,
            30,
            getThemeColorByIndex(this.theme, 0),
            20
        );

        this.operations = this.currentStepIndex;
    }
}

class SieveOfEratosthenesVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'sieve-eratosthenes');
        this.maxNumber = 100;
    }

    generateData(max = 100) {
        this.maxNumber = max;
        this.calculateSteps();
    }

    calculateSteps() {
        const isPrime = new Array(this.maxNumber + 1).fill(true);
        isPrime[0] = isPrime[1] = false;

        this.steps = [{
            isPrime: [...isPrime],
            current: -1,
            marking: []
        }];

        for (let i = 2; i * i <= this.maxNumber; i++) {
            if (isPrime[i]) {
                // Show current prime
                this.steps.push({
                    isPrime: [...isPrime],
                    current: i,
                    marking: []
                });

                // Mark multiples
                for (let j = i * i; j <= this.maxNumber; j += i) {
                    if (isPrime[j]) {
                        isPrime[j] = false;

                        this.steps.push({
                            isPrime: [...isPrime],
                            current: i,
                            marking: [j]
                        });
                    }
                }
            }
        }

        this.steps.push({
            isPrime: [...isPrime],
            current: -1,
            marking: []
        });

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        const cols = 10;
        const rows = Math.ceil(this.maxNumber / cols);
        const cellWidth = this.width / cols;
        const cellHeight = (this.height * 0.8) / rows;

        for (let n = 0; n <= this.maxNumber; n++) {
            const col = n % cols;
            const row = Math.floor(n / cols);
            const x = col * cellWidth;
            const y = row * cellHeight + 60;

            let color;
            if (n === step.current) {
                color = getThemeColorByIndex(this.theme, 5); // Current prime
            } else if (step.marking.includes(n)) {
                color = getThemeColorByIndex(this.theme, 6); // Being marked
            } else if (step.isPrime[n]) {
                color = getThemeColorByIndex(this.theme, 0); // Prime
            } else {
                color = 'rgba(100, 100, 100, 0.2)'; // Composite
            }

            this.ctx.fillStyle = color;
            this.ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);

            // Draw number
            this.drawText(
                n.toString(),
                x + cellWidth / 2,
                y + cellHeight / 2,
                step.isPrime[n] ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                Math.min(14, cellWidth / 3)
            );
        }

        // Draw info
        if (step.current > 0) {
            this.drawText(
                `Sieving multiples of ${step.current}`,
                this.width / 2,
                30,
                getThemeColorByIndex(this.theme, 0),
                18
            );
        } else {
            const primeCount = step.isPrime.filter(p => p).length;
            this.drawText(
                `Found ${primeCount} primes`,
                this.width / 2,
                30,
                getThemeColorByIndex(this.theme, 0),
                18
            );
        }

        this.operations = this.currentStepIndex;
    }
}

class PascalTriangleVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'pascal-triangle');
        this.triangle = [];
    }

    generateData(rows = 12) {
        this.triangle = this.generatePascalTriangle(rows);
        this.calculateSteps();
    }

    generatePascalTriangle(n) {
        const triangle = [[1]];

        for (let i = 1; i < n; i++) {
            const row = [1];
            for (let j = 1; j < i; j++) {
                row.push(triangle[i - 1][j - 1] + triangle[i - 1][j]);
            }
            row.push(1);
            triangle.push(row);
        }

        return triangle;
    }

    calculateSteps() {
        this.steps = [];

        for (let i = 0; i <= this.triangle.length; i++) {
            this.steps.push({
                rows: i,
                triangle: this.triangle.slice(0, i)
            });
        }

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        const rowHeight = this.height / (step.rows + 2);
        const startY = 80;

        step.triangle.forEach((row, rowIndex) => {
            const y = startY + rowIndex * rowHeight;
            const maxWidth = this.width * 0.9;
            const cellWidth = maxWidth / (row.length + 1);

            row.forEach((value, colIndex) => {
                const x = this.width / 2 - (row.length * cellWidth) / 2 + colIndex * cellWidth + cellWidth / 2;

                // Color based on value or position
                const colorIndex = value % 7;
                const color = getThemeColorByIndex(this.theme, colorIndex);

                // Draw circle
                const radius = Math.min(cellWidth / 2.5, 25);
                this.drawCircle(x, y, radius, color, false);

                // Draw value
                this.drawText(
                    value.toString(),
                    x,
                    y,
                    '#ffffff',
                    Math.min(12, radius / 1.5)
                );
            });
        });

        // Draw title
        this.drawText(
            `Pascal's Triangle - Row ${step.rows}`,
            this.width / 2,
            30,
            getThemeColorByIndex(this.theme, 0),
            20
        );

        this.operations = this.currentStepIndex;
    }
}

class RecursiveTreeVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'recursive-tree');
        this.maxDepth = 10;
    }

    generateData(depth = 10) {
        this.maxDepth = depth;
        this.calculateSteps();
    }

    calculateSteps() {
        this.steps = [];

        for (let d = 0; d <= this.maxDepth; d++) {
            this.steps.push({ depth: d });
        }

        this.totalSteps = this.steps.length;
    }

    drawBranch(x, y, length, angle, depth, maxDepth) {
        if (depth > maxDepth) return;

        const x2 = x + length * Math.cos(angle);
        const y2 = y + length * Math.sin(angle);

        // Color based on depth
        const color = getThemeColorByIndex(this.theme, depth % 7);
        const width = Math.max(1, maxDepth - depth + 1);

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Draw circles at branch ends for aesthetic
        if (depth === maxDepth) {
            this.drawCircle(x2, y2, 3, color, true);
        }

        // Recursive calls for branches
        const newLength = length * 0.7;
        const angleOffset = Math.PI / 6;

        this.drawBranch(x2, y2, newLength, angle - angleOffset, depth + 1, maxDepth);
        this.drawBranch(x2, y2, newLength, angle + angleOffset, depth + 1, maxDepth);
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        const startX = this.width / 2;
        const startY = this.height * 0.9;
        const initialLength = this.height / 5;

        this.drawBranch(startX, startY, initialLength, -Math.PI / 2, 0, step.depth);

        // Draw info
        this.drawText(
            `Depth: ${step.depth}`,
            this.width / 2,
            30,
            getThemeColorByIndex(this.theme, 0),
            20
        );

        this.operations = this.currentStepIndex;
    }
}
