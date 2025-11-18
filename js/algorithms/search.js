// Search and Graph Algorithms Visualizations

class BinarySearchVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'binary-search');
        this.target = null;
    }

    generateData(size = 50) {
        this.data = generateSortedArray(size, 10, 90);
        this.target = this.data[Math.floor(Math.random() * this.data.length)];
        this.calculateSteps();
    }

    calculateSteps() {
        const arr = [...this.data];
        let left = 0;
        let right = arr.length - 1;

        this.steps = [{
            array: [...arr],
            left: left,
            right: right,
            mid: -1,
            found: -1,
            target: this.target
        }];

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            this.steps.push({
                array: [...arr],
                left: left,
                right: right,
                mid: mid,
                found: -1,
                target: this.target
            });

            if (arr[mid] === this.target) {
                this.steps.push({
                    array: [...arr],
                    left: left,
                    right: right,
                    mid: mid,
                    found: mid,
                    target: this.target
                });
                break;
            }

            if (arr[mid] < this.target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }

            this.steps.push({
                array: [...arr],
                left: left,
                right: right,
                mid: -1,
                found: -1,
                target: this.target
            });
        }

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];
        const barWidth = this.width / step.array.length;
        const maxValue = Math.max(...this.data);

        // Draw search range
        if (step.left >= 0 && step.right >= 0) {
            const rangeX = step.left * barWidth;
            const rangeWidth = (step.right - step.left + 1) * barWidth;
            this.ctx.fillStyle = 'rgba(168, 85, 247, 0.1)';
            this.ctx.fillRect(rangeX, 0, rangeWidth, this.height);
        }

        // Draw bars
        step.array.forEach((value, i) => {
            const barHeight = (value / maxValue) * this.height * 0.8;
            const x = i * barWidth;
            const y = this.height - barHeight;

            let color;
            if (step.found === i) {
                color = getThemeColorByIndex(this.theme, 0); // Found!
            } else if (step.mid === i) {
                color = getThemeColorByIndex(this.theme, 5); // Current mid
            } else if (i >= step.left && i <= step.right) {
                color = getThemeColorByIndex(this.theme, 3); // In range
            } else {
                color = 'rgba(100, 100, 100, 0.3)'; // Out of range
            }

            this.drawBar(
                x + 2,
                y,
                barWidth - 4,
                barHeight,
                color,
                step.mid === i || step.found === i
            );
        });

        // Draw target indicator
        this.drawText(
            `Target: ${step.target}${step.found >= 0 ? ' - Found!' : ''}`,
            this.width / 2,
            30,
            getThemeColorByIndex(this.theme, 0),
            20
        );

        this.operations = this.currentStepIndex;
    }
}

class DFSVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'dfs');
        this.graph = null;
        this.positions = null;
    }

    generateData(size = 20) {
        // Generate random graph
        this.graph = this.generateRandomGraph(size);
        this.positions = this.generatePositions(size);
        this.calculateSteps();
    }

    generateRandomGraph(n) {
        const graph = {};
        for (let i = 0; i < n; i++) {
            graph[i] = [];
        }

        // Create connections
        for (let i = 0; i < n; i++) {
            const numConnections = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numConnections; j++) {
                const target = Math.floor(Math.random() * n);
                if (target !== i && !graph[i].includes(target)) {
                    graph[i].push(target);
                    if (!graph[target].includes(i)) {
                        graph[target].push(i);
                    }
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
        const visited = new Set();
        const stack = [];

        this.steps = [{
            visited: new Set(),
            current: -1,
            stack: [],
            edge: null
        }];

        const dfs = (node) => {
            visited.add(node);
            stack.push(node);

            this.steps.push({
                visited: new Set(visited),
                current: node,
                stack: [...stack],
                edge: null
            });

            for (const neighbor of this.graph[node]) {
                if (!visited.has(neighbor)) {
                    this.steps.push({
                        visited: new Set(visited),
                        current: node,
                        stack: [...stack],
                        edge: [node, neighbor]
                    });

                    dfs(neighbor);
                }
            }

            stack.pop();
        };

        // Start DFS from node 0
        if (Object.keys(this.graph).length > 0) {
            dfs(0);
        }

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        // Draw edges
        this.ctx.globalAlpha = 0.3;
        Object.keys(this.graph).forEach(node => {
            const fromPos = this.positions[node];
            this.graph[node].forEach(neighbor => {
                if (node < neighbor) { // Draw each edge only once
                    const toPos = this.positions[neighbor];
                    const color = step.visited.has(parseInt(node)) && step.visited.has(neighbor) ?
                        getThemeColorByIndex(this.theme, 3) : 'rgba(100, 100, 100, 0.5)';
                    this.drawLine(fromPos.x, fromPos.y, toPos.x, toPos.y, color, 2);
                }
            });
        });
        this.ctx.globalAlpha = 1;

        // Draw current edge being explored
        if (step.edge) {
            const [from, to] = step.edge;
            const fromPos = this.positions[from];
            const toPos = this.positions[to];
            this.drawLine(
                fromPos.x, fromPos.y,
                toPos.x, toPos.y,
                getThemeColorByIndex(this.theme, 5),
                4
            );
        }

        // Draw nodes
        Object.keys(this.graph).forEach(node => {
            const pos = this.positions[node];
            const nodeNum = parseInt(node);

            let color;
            if (nodeNum === step.current) {
                color = getThemeColorByIndex(this.theme, 5); // Current
            } else if (step.visited.has(nodeNum)) {
                color = getThemeColorByIndex(this.theme, 0); // Visited
            } else {
                color = 'rgba(100, 100, 100, 0.5)'; // Not visited
            }

            this.drawCircle(pos.x, pos.y, 15, color, nodeNum === step.current);

            // Draw node number
            this.drawText(node, pos.x, pos.y, '#ffffff', 12);
        });

        // Draw stack
        if (step.stack.length > 0) {
            const stackStr = `Stack: [${step.stack.join(', ')}]`;
            this.drawText(stackStr, this.width / 2, 30, getThemeColorByIndex(this.theme, 0), 16);
        }

        this.operations = this.currentStepIndex;
    }
}

class BFSVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'bfs');
        this.graph = null;
        this.positions = null;
    }

    generateData(size = 20) {
        this.graph = this.generateRandomGraph(size);
        this.positions = this.generatePositions(size);
        this.calculateSteps();
    }

    generateRandomGraph(n) {
        const graph = {};
        for (let i = 0; i < n; i++) {
            graph[i] = [];
        }

        for (let i = 0; i < n; i++) {
            const numConnections = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numConnections; j++) {
                const target = Math.floor(Math.random() * n);
                if (target !== i && !graph[i].includes(target)) {
                    graph[i].push(target);
                    if (!graph[target].includes(i)) {
                        graph[target].push(i);
                    }
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
        const visited = new Set();
        const queue = [];

        this.steps = [{
            visited: new Set(),
            current: -1,
            queue: [],
            edge: null,
            level: new Map()
        }];

        if (Object.keys(this.graph).length > 0) {
            queue.push(0);
            visited.add(0);
            const level = new Map([[0, 0]]);

            while (queue.length > 0) {
                const node = queue.shift();

                this.steps.push({
                    visited: new Set(visited),
                    current: node,
                    queue: [...queue],
                    edge: null,
                    level: new Map(level)
                });

                for (const neighbor of this.graph[node]) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                        level.set(neighbor, level.get(node) + 1);

                        this.steps.push({
                            visited: new Set(visited),
                            current: node,
                            queue: [...queue],
                            edge: [node, neighbor],
                            level: new Map(level)
                        });
                    }
                }
            }
        }

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];

        // Draw edges
        this.ctx.globalAlpha = 0.3;
        Object.keys(this.graph).forEach(node => {
            const fromPos = this.positions[node];
            this.graph[node].forEach(neighbor => {
                if (node < neighbor) {
                    const toPos = this.positions[neighbor];
                    const color = step.visited.has(parseInt(node)) && step.visited.has(neighbor) ?
                        getThemeColorByIndex(this.theme, 3) : 'rgba(100, 100, 100, 0.5)';
                    this.drawLine(fromPos.x, fromPos.y, toPos.x, toPos.y, color, 2);
                }
            });
        });
        this.ctx.globalAlpha = 1;

        // Draw current edge
        if (step.edge) {
            const [from, to] = step.edge;
            const fromPos = this.positions[from];
            const toPos = this.positions[to];
            this.drawLine(
                fromPos.x, fromPos.y,
                toPos.x, toPos.y,
                getThemeColorByIndex(this.theme, 5),
                4
            );
        }

        // Draw nodes with ripple effect (based on level)
        Object.keys(this.graph).forEach(node => {
            const pos = this.positions[node];
            const nodeNum = parseInt(node);

            let color;
            if (nodeNum === step.current) {
                color = getThemeColorByIndex(this.theme, 5);
            } else if (step.visited.has(nodeNum)) {
                const level = step.level.get(nodeNum) || 0;
                color = getThemeColorByIndex(this.theme, level % 7);
            } else {
                color = 'rgba(100, 100, 100, 0.5)';
            }

            this.drawCircle(pos.x, pos.y, 15, color, nodeNum === step.current);
            this.drawText(node, pos.x, pos.y, '#ffffff', 12);
        });

        // Draw queue
        if (step.queue.length > 0) {
            const queueStr = `Queue: [${step.queue.join(', ')}]`;
            this.drawText(queueStr, this.width / 2, 30, getThemeColorByIndex(this.theme, 0), 16);
        }

        this.operations = this.currentStepIndex;
    }
}
