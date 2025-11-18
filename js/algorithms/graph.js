// Graph Algorithms - Dijkstra and A*

class DijkstraVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'dijkstra');
        this.graph = null;
        this.positions = null;
        this.start = 0;
        this.end = null;
    }

    generateData(size = 15) {
        this.graph = this.generateWeightedGraph(size);
        this.positions = this.generatePositions(size);
        this.end = size - 1;
        this.calculateSteps();
    }

    generateWeightedGraph(n) {
        const graph = {};
        for (let i = 0; i < n; i++) {
            graph[i] = [];
        }

        for (let i = 0; i < n; i++) {
            const numConnections = Math.floor(Math.random() * 3) + 2;
            for (let j = 0; j < numConnections; j++) {
                const target = Math.floor(Math.random() * n);
                if (target !== i && !graph[i].some(edge => edge.to === target)) {
                    const weight = Math.floor(Math.random() * 10) + 1;
                    graph[i].push({ to: target, weight });
                    graph[target].push({ to: i, weight });
                }
            }
        }

        return graph;
    }

    generatePositions(n) {
        const positions = {};
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) * 0.4;

        for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2;
            positions[i] = {
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            };
        }

        return positions;
    }

    calculateSteps() {
        const distances = {};
        const visited = new Set();
        const previous = {};
        const pq = [];

        // Initialize
        Object.keys(this.graph).forEach(node => {
            distances[node] = Infinity;
        });
        distances[this.start] = 0;
        pq.push({ node: this.start, dist: 0 });

        this.steps = [{
            distances: { ...distances },
            visited: new Set(),
            current: -1,
            exploring: null,
            path: []
        }];

        while (pq.length > 0) {
            // Get node with minimum distance
            pq.sort((a, b) => a.dist - b.dist);
            const { node: current } = pq.shift();

            if (visited.has(current)) continue;
            visited.add(current);

            this.steps.push({
                distances: { ...distances },
                visited: new Set(visited),
                current: current,
                exploring: null,
                path: this.reconstructPath(previous, this.start, current)
            });

            if (current === this.end) break;

            for (const edge of this.graph[current]) {
                if (!visited.has(edge.to)) {
                    const newDist = distances[current] + edge.weight;

                    this.steps.push({
                        distances: { ...distances },
                        visited: new Set(visited),
                        current: current,
                        exploring: [current, edge.to, edge.weight],
                        path: []
                    });

                    if (newDist < distances[edge.to]) {
                        distances[edge.to] = newDist;
                        previous[edge.to] = current;
                        pq.push({ node: edge.to, dist: newDist });

                        this.steps.push({
                            distances: { ...distances },
                            visited: new Set(visited),
                            current: current,
                            exploring: [current, edge.to, edge.weight],
                            path: []
                        });
                    }
                }
            }
        }

        // Final path
        this.steps.push({
            distances: { ...distances },
            visited: new Set(visited),
            current: -1,
            exploring: null,
            path: this.reconstructPath(previous, this.start, this.end)
        });

        this.totalSteps = this.steps.length;
    }

    reconstructPath(previous, start, end) {
        const path = [];
        let current = end;

        while (current !== undefined && current !== start) {
            path.unshift(current);
            current = previous[current];
        }

        if (current === start) {
            path.unshift(start);
        }

        return path;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        // Draw all edges
        this.ctx.globalAlpha = 0.2;
        Object.keys(this.graph).forEach(node => {
            const fromPos = this.positions[node];
            this.graph[node].forEach(edge => {
                if (node < edge.to) {
                    const toPos = this.positions[edge.to];
                    this.drawLine(fromPos.x, fromPos.y, toPos.x, toPos.y, 'rgba(100, 100, 100, 0.5)', 2);

                    // Draw weight
                    const midX = (fromPos.x + toPos.x) / 2;
                    const midY = (fromPos.y + toPos.y) / 2;
                    this.ctx.globalAlpha = 0.8;
                    this.drawText(edge.weight.toString(), midX, midY, '#ffffff', 10);
                    this.ctx.globalAlpha = 0.2;
                }
            });
        });
        this.ctx.globalAlpha = 1;

        // Draw exploring edge
        if (step.exploring) {
            const [from, to, weight] = step.exploring;
            const fromPos = this.positions[from];
            const toPos = this.positions[to];
            this.drawLine(fromPos.x, fromPos.y, toPos.x, toPos.y, getThemeColorByIndex(this.theme, 4), 4);
        }

        // Draw shortest path so far
        if (step.path.length > 1) {
            for (let i = 0; i < step.path.length - 1; i++) {
                const fromPos = this.positions[step.path[i]];
                const toPos = this.positions[step.path[i + 1]];
                this.drawLine(fromPos.x, fromPos.y, toPos.x, toPos.y, getThemeColorByIndex(this.theme, 0), 4);
            }
        }

        // Draw nodes
        Object.keys(this.graph).forEach(node => {
            const pos = this.positions[node];
            const nodeNum = parseInt(node);

            let color;
            if (nodeNum === this.start) {
                color = getThemeColorByIndex(this.theme, 1);
            } else if (nodeNum === this.end) {
                color = getThemeColorByIndex(this.theme, 6);
            } else if (nodeNum === step.current) {
                color = getThemeColorByIndex(this.theme, 5);
            } else if (step.visited.has(nodeNum)) {
                color = getThemeColorByIndex(this.theme, 3);
            } else {
                color = 'rgba(100, 100, 100, 0.5)';
            }

            this.drawCircle(pos.x, pos.y, 20, color, nodeNum === step.current);

            // Draw distance
            const dist = step.distances[nodeNum];
            const distText = dist === Infinity ? '∞' : dist.toString();
            this.drawText(distText, pos.x, pos.y, '#ffffff', 12);
        });

        this.operations = this.currentStepIndex;
    }
}

class AStarVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'a-star');
        this.grid = null;
        this.start = null;
        this.end = null;
        this.gridSize = 20;
        this.cellSize = 0;
    }

    generateData(size = 20) {
        this.gridSize = size;
        this.cellSize = Math.min(this.width, this.height) / size;
        this.grid = this.generateGrid(size);
        this.start = { x: 1, y: 1 };
        this.end = { x: size - 2, y: size - 2 };
        this.calculateSteps();
    }

    generateGrid(size) {
        const grid = Array(size).fill(null).map(() => Array(size).fill(0));

        // Add random obstacles
        for (let i = 0; i < size * size * 0.2; i++) {
            const x = Math.floor(Math.random() * (size - 2)) + 1;
            const y = Math.floor(Math.random() * (size - 2)) + 1;
            if ((x !== 1 || y !== 1) && (x !== size - 2 || y !== size - 2)) {
                grid[y][x] = 1; // 1 = obstacle
            }
        }

        return grid;
    }

    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    getNeighbors(pos) {
        const neighbors = [];
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        for (const [dx, dy] of dirs) {
            const x = pos.x + dx;
            const y = pos.y + dy;

            if (x >= 0 && x < this.gridSize &&
                y >= 0 && y < this.gridSize &&
                this.grid[y][x] !== 1) {
                neighbors.push({ x, y });
            }
        }

        return neighbors;
    }

    posToKey(pos) {
        return `${pos.x},${pos.y}`;
    }

    calculateSteps() {
        const openSet = [this.start];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map([[this.posToKey(this.start), 0]]);
        const fScore = new Map([[this.posToKey(this.start), this.heuristic(this.start, this.end)]]);

        this.steps = [{
            openSet: [this.start],
            closedSet: new Set(),
            current: null,
            path: [],
            exploring: null
        }];

        while (openSet.length > 0) {
            // Get node with lowest f score
            openSet.sort((a, b) => {
                const fA = fScore.get(this.posToKey(a)) || Infinity;
                const fB = fScore.get(this.posToKey(b)) || Infinity;
                return fA - fB;
            });

            const current = openSet.shift();
            const currentKey = this.posToKey(current);

            this.steps.push({
                openSet: [...openSet],
                closedSet: new Set(closedSet),
                current: current,
                path: [],
                exploring: null
            });

            if (current.x === this.end.x && current.y === this.end.y) {
                // Found path!
                const path = this.reconstructPath(cameFrom, current);
                this.steps.push({
                    openSet: [],
                    closedSet: new Set(closedSet),
                    current: null,
                    path: path,
                    exploring: null
                });
                break;
            }

            closedSet.add(currentKey);

            for (const neighbor of this.getNeighbors(current)) {
                const neighborKey = this.posToKey(neighbor);

                if (closedSet.has(neighborKey)) continue;

                const tentativeGScore = (gScore.get(currentKey) || Infinity) + 1;

                this.steps.push({
                    openSet: [...openSet],
                    closedSet: new Set(closedSet),
                    current: current,
                    path: [],
                    exploring: neighbor
                });

                if (!openSet.some(p => this.posToKey(p) === neighborKey)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
                    continue;
                }

                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, this.end));
            }
        }

        this.totalSteps = this.steps.length;
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        let currentKey = this.posToKey(current);

        while (cameFrom.has(currentKey)) {
            current = cameFrom.get(currentKey);
            path.unshift(current);
            currentKey = this.posToKey(current);
        }

        return path;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        // Draw grid
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const posX = x * this.cellSize;
                const posY = y * this.cellSize;

                let color;
                const posKey = `${x},${y}`;

                if (this.grid[y][x] === 1) {
                    color = 'rgba(50, 50, 50, 1)'; // Obstacle
                } else if (x === this.start.x && y === this.start.y) {
                    color = getThemeColorByIndex(this.theme, 1); // Start
                } else if (x === this.end.x && y === this.end.y) {
                    color = getThemeColorByIndex(this.theme, 6); // End
                } else if (step.path.some(p => p.x === x && p.y === y)) {
                    color = getThemeColorByIndex(this.theme, 0); // Path
                } else if (step.current && step.current.x === x && step.current.y === y) {
                    color = getThemeColorByIndex(this.theme, 5); // Current
                } else if (step.exploring && step.exploring.x === x && step.exploring.y === y) {
                    color = getThemeColorByIndex(this.theme, 4); // Exploring
                } else if (step.closedSet.has(posKey)) {
                    color = getThemeColorByIndex(this.theme, 3); // Closed
                } else if (step.openSet.some(p => p.x === x && p.y === y)) {
                    color = 'rgba(168, 85, 247, 0.3)'; // Open
                } else {
                    color = 'rgba(20, 20, 20, 1)'; // Empty
                }

                this.ctx.fillStyle = color;
                this.ctx.fillRect(posX, posY, this.cellSize - 1, this.cellSize - 1);
            }
        }

        this.operations = this.currentStepIndex;
    }
}
