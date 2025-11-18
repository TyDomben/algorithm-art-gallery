// Algorithm Art Gallery - Algorithm Metadata and Configurations

const ALGORITHMS = [
    // SORTING ALGORITHMS
    {
        id: 'bubble-sort',
        name: 'Bubble Sort',
        category: 'sorting',
        difficulty: 'beginner',
        description: 'Watch colorful bars bubble up to their sorted positions in mesmerizing waves. Each swap creates a ripple of color through the array.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Bubble_sort',
        related: ['insertion-sort', 'selection-sort', 'quick-sort'],
        code: `function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`
    },
    {
        id: 'quick-sort',
        name: 'Quick Sort',
        category: 'sorting',
        difficulty: 'intermediate',
        description: 'Experience the elegance of divide-and-conquer as partitions split the array into colorful zones, recursively sorting with fractal-like beauty.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Quicksort',
        related: ['merge-sort', 'heap-sort', 'bubble-sort'],
        code: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`
    },
    {
        id: 'merge-sort',
        name: 'Merge Sort',
        category: 'sorting',
        difficulty: 'intermediate',
        description: 'Streams of color split and merge in perfect harmony, demonstrating the power of recursive division and combination.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Merge_sort',
        related: ['quick-sort', 'heap-sort', 'tim-sort'],
        code: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return result.concat(left.slice(i), right.slice(j));
}`
    },
    {
        id: 'insertion-sort',
        name: 'Insertion Sort',
        category: 'sorting',
        difficulty: 'beginner',
        description: 'Like sorting playing cards in your hand, watch elements gracefully slide into their perfect positions one by one.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        featured: false,
        wikiLink: 'https://en.wikipedia.org/wiki/Insertion_sort',
        related: ['bubble-sort', 'selection-sort', 'shell-sort'],
        code: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`
    },
    {
        id: 'radix-sort',
        name: 'Radix Sort',
        category: 'sorting',
        difficulty: 'advanced',
        description: 'A cascading rainbow of digits, sorting numbers place by place in a spectacular waterfall of color.',
        timeComplexity: 'O(d × n)',
        spaceComplexity: 'O(n + k)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Radix_sort',
        related: ['counting-sort', 'bucket-sort'],
        code: `function radixSort(arr) {
    const max = Math.max(...arr);
    const maxDigits = Math.floor(Math.log10(max)) + 1;

    for (let i = 0; i < maxDigits; i++) {
        const buckets = Array.from({length: 10}, () => []);

        for (let num of arr) {
            const digit = Math.floor(num / Math.pow(10, i)) % 10;
            buckets[digit].push(num);
        }

        arr = buckets.flat();
    }
    return arr;
}`
    },

    // SEARCH ALGORITHMS
    {
        id: 'binary-search',
        name: 'Binary Search',
        category: 'search',
        difficulty: 'beginner',
        description: 'Zoom through a sorted array with logarithmic precision, halving the search space with each elegant step.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Binary_search_algorithm',
        related: ['linear-search', 'interpolation-search'],
        code: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}`
    },
    {
        id: 'dfs',
        name: 'Depth-First Search',
        category: 'graph',
        difficulty: 'intermediate',
        description: 'Dive deep into the maze, leaving a glowing trail as you explore every path with determined curiosity.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Depth-first_search',
        related: ['bfs', 'dijkstra', 'a-star'],
        code: `function dfs(graph, start, visited = new Set()) {
    visited.add(start);

    for (const neighbor of graph[start]) {
        if (!visited.has(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }

    return visited;
}`
    },
    {
        id: 'bfs',
        name: 'Breadth-First Search',
        category: 'graph',
        difficulty: 'intermediate',
        description: 'Ripples of exploration spread outward from the source, discovering paths layer by layer like waves on water.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Breadth-first_search',
        related: ['dfs', 'dijkstra', 'a-star'],
        code: `function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);

    while (queue.length > 0) {
        const vertex = queue.shift();

        for (const neighbor of graph[vertex]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }

    return visited;
}`
    },
    {
        id: 'dijkstra',
        name: "Dijkstra's Algorithm",
        category: 'graph',
        difficulty: 'advanced',
        description: 'Light spreads through a network of nodes, always choosing the shortest path, illuminating the optimal route.',
        timeComplexity: 'O((V + E) log V)',
        spaceComplexity: 'O(V)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm',
        related: ['a-star', 'bfs', 'bellman-ford'],
        code: `function dijkstra(graph, start) {
    const distances = {};
    const pq = new PriorityQueue();
    const visited = new Set();

    distances[start] = 0;
    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
        const current = pq.dequeue();
        visited.add(current);

        for (const [neighbor, weight] of graph[current]) {
            if (!visited.has(neighbor)) {
                const distance = distances[current] + weight;
                if (distance < (distances[neighbor] || Infinity)) {
                    distances[neighbor] = distance;
                    pq.enqueue(neighbor, distance);
                }
            }
        }
    }

    return distances;
}`
    },
    {
        id: 'a-star',
        name: 'A* Pathfinding',
        category: 'graph',
        difficulty: 'advanced',
        description: 'The intelligent pathfinder navigates through obstacles with heuristic wisdom, finding the optimal route efficiently.',
        timeComplexity: 'O(E)',
        spaceComplexity: 'O(V)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/A*_search_algorithm',
        related: ['dijkstra', 'bfs', 'greedy-best-first'],
        code: `function astar(grid, start, goal) {
    const openSet = [start];
    const cameFrom = new Map();
    const gScore = new Map([[start, 0]]);
    const fScore = new Map([[start, heuristic(start, goal)]]);

    while (openSet.length > 0) {
        const current = openSet.reduce((a, b) =>
            (fScore.get(a) || Infinity) < (fScore.get(b) || Infinity) ? a : b
        );

        if (current === goal) return reconstructPath(cameFrom, current);

        openSet.splice(openSet.indexOf(current), 1);

        for (const neighbor of getNeighbors(grid, current)) {
            const tentativeGScore = gScore.get(current) + 1;

            if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + heuristic(neighbor, goal));

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return null;
}`
    },

    // MATHEMATICAL VISUALIZATIONS
    {
        id: 'fibonacci-spiral',
        name: 'Fibonacci Spiral',
        category: 'math',
        difficulty: 'beginner',
        description: 'The golden ratio unfolds before your eyes as the Fibonacci sequence spirals outward in perfect mathematical harmony.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Fibonacci_number',
        related: ['golden-ratio', 'pascal-triangle'],
        code: `function fibonacci(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;

    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }

    return b;
}

// Draw Fibonacci Spiral
function drawSpiral(n) {
    let angle = 0;
    let size = fibonacci(n);

    for (let i = 1; i <= n; i++) {
        const fib = fibonacci(i);
        arc(0, 0, fib * 2, fib * 2, angle, angle + PI/2);
        angle += PI/2;
    }
}`
    },
    {
        id: 'mandelbrot',
        name: 'Mandelbrot Set',
        category: 'math',
        difficulty: 'advanced',
        description: 'Dive into infinite complexity as fractal boundaries reveal stunning patterns at every level of magnification.',
        timeComplexity: 'O(n × m × i)',
        spaceComplexity: 'O(n × m)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Mandelbrot_set',
        related: ['julia-set', 'fractals'],
        code: `function mandelbrot(c, maxIterations) {
    let z = {re: 0, im: 0};

    for (let i = 0; i < maxIterations; i++) {
        const zSquared = {
            re: z.re * z.re - z.im * z.im,
            im: 2 * z.re * z.im
        };

        z = {
            re: zSquared.re + c.re,
            im: zSquared.im + c.im
        };

        if (z.re * z.re + z.im * z.im > 4) {
            return i;
        }
    }

    return maxIterations;
}`
    },
    {
        id: 'voronoi',
        name: 'Voronoi Diagram',
        category: 'math',
        difficulty: 'intermediate',
        description: 'Organic cells emerge from random points, creating beautiful natural patterns found in nature and art.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Voronoi_diagram',
        related: ['delaunay', 'nearest-neighbor'],
        code: `function voronoi(points, width, height) {
    const cells = [];

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let minDist = Infinity;
            let closestPoint = null;

            for (const point of points) {
                const dist = Math.hypot(x - point.x, y - point.y);
                if (dist < minDist) {
                    minDist = dist;
                    closestPoint = point;
                }
            }

            cells.push({x, y, point: closestPoint});
        }
    }

    return cells;
}`
    },
    {
        id: 'prime-spiral',
        name: 'Prime Number Spiral',
        category: 'math',
        difficulty: 'intermediate',
        description: 'The Ulam spiral reveals mysterious patterns in prime numbers, showing unexpected diagonal structures.',
        timeComplexity: 'O(n√n)',
        spaceComplexity: 'O(n)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Ulam_spiral',
        related: ['sieve-eratosthenes', 'prime-test'],
        code: `function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function ulamSpiral(size) {
    const spiral = [];
    let x = 0, y = 0;
    let dx = 0, dy = -1;

    for (let i = 0; i < size * size; i++) {
        spiral.push({x, y, value: i + 1, prime: isPrime(i + 1)});

        if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
            [dx, dy] = [-dy, dx];
        }

        x += dx;
        y += dy;
    }

    return spiral;
}`
    },

    // CLASSIC PROBLEMS
    {
        id: 'game-of-life',
        name: "Conway's Game of Life",
        category: 'classic',
        difficulty: 'intermediate',
        description: 'Cellular automata come alive, evolving through generations in mesmerizing patterns of birth, survival, and death.',
        timeComplexity: 'O(n × m)',
        spaceComplexity: 'O(n × m)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life',
        related: ['cellular-automata', 'langtons-ant'],
        code: `function gameOfLife(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = grid.map(row => [...row]);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = countNeighbors(grid, i, j);

            if (grid[i][j] === 1) {
                // Cell is alive
                newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
                // Cell is dead
                newGrid[i][j] = (neighbors === 3) ? 1 : 0;
            }
        }
    }

    return newGrid;
}

function countNeighbors(grid, row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < grid.length &&
                newCol >= 0 && newCol < grid[0].length) {
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}`
    },
    {
        id: 'towers-of-hanoi',
        name: 'Towers of Hanoi',
        category: 'classic',
        difficulty: 'intermediate',
        description: 'Graceful disks dance between three towers in an ancient puzzle, demonstrating recursive elegance.',
        timeComplexity: 'O(2^n)',
        spaceComplexity: 'O(n)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Tower_of_Hanoi',
        related: ['recursion', 'stack'],
        code: `function hanoi(n, from, to, aux, moves = []) {
    if (n === 1) {
        moves.push({disk: 1, from, to});
        return moves;
    }

    hanoi(n - 1, from, aux, to, moves);
    moves.push({disk: n, from, to});
    hanoi(n - 1, aux, to, from, moves);

    return moves;
}

// Solve for n disks
const solution = hanoi(3, 'A', 'C', 'B');
console.log(\`Solved in \${solution.length} moves\`);`
    },
    {
        id: 'sieve-eratosthenes',
        name: 'Sieve of Eratosthenes',
        category: 'math',
        difficulty: 'beginner',
        description: 'Watch numbers fall away as multiples are filtered out, revealing the beautiful constellation of prime numbers.',
        timeComplexity: 'O(n log log n)',
        spaceComplexity: 'O(n)',
        featured: false,
        wikiLink: 'https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes',
        related: ['prime-spiral', 'prime-test'],
        code: `function sieveOfEratosthenes(n) {
    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;

    for (let i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (let j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }

    return isPrime.map((prime, num) => prime ? num : null)
                  .filter(num => num !== null);
}`
    },
    {
        id: 'pascal-triangle',
        name: "Pascal's Triangle",
        category: 'math',
        difficulty: 'beginner',
        description: 'An expanding pyramid of numbers reveals hidden patterns, from Fibonacci to binomial coefficients.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(n²)',
        featured: false,
        wikiLink: 'https://en.wikipedia.org/wiki/Pascal%27s_triangle',
        related: ['fibonacci-spiral', 'binomial'],
        code: `function pascalTriangle(n) {
    const triangle = [[1]];

    for (let i = 1; i < n; i++) {
        const row = [1];

        for (let j = 1; j < i; j++) {
            row.push(triangle[i-1][j-1] + triangle[i-1][j]);
        }

        row.push(1);
        triangle.push(row);
    }

    return triangle;
}`
    },
    {
        id: 'perlin-noise',
        name: 'Perlin Noise Flow',
        category: 'math',
        difficulty: 'advanced',
        description: 'Particles flow through a smooth noise field, creating organic, natural-looking motion patterns.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        featured: true,
        wikiLink: 'https://en.wikipedia.org/wiki/Perlin_noise',
        related: ['simplex-noise', 'particle-system'],
        code: `class PerlinNoise {
    constructor() {
        this.permutation = this.generatePermutation();
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const a = this.permutation[X] + Y;
        const b = this.permutation[X + 1] + Y;

        return this.lerp(v,
            this.lerp(u, this.grad(this.permutation[a], x, y),
                        this.grad(this.permutation[b], x - 1, y)),
            this.lerp(u, this.grad(this.permutation[a + 1], x, y - 1),
                        this.grad(this.permutation[b + 1], x - 1, y - 1))
        );
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }
}`
    },
    {
        id: 'recursive-tree',
        name: 'Recursive Tree',
        category: 'classic',
        difficulty: 'intermediate',
        description: 'A fractal tree grows branch by branch, demonstrating the beauty of recursive algorithms in nature.',
        timeComplexity: 'O(2^n)',
        spaceComplexity: 'O(n)',
        featured: false,
        wikiLink: 'https://en.wikipedia.org/wiki/L-system',
        related: ['fractals', 'recursion'],
        code: `function drawTree(x, y, length, angle, depth) {
    if (depth === 0) return;

    const x2 = x + length * Math.cos(angle);
    const y2 = y + length * Math.sin(angle);

    drawLine(x, y, x2, y2);

    // Draw two branches
    drawTree(x2, y2, length * 0.7, angle - Math.PI / 6, depth - 1);
    drawTree(x2, y2, length * 0.7, angle + Math.PI / 6, depth - 1);
}

// Start drawing
drawTree(width / 2, height, 100, -Math.PI / 2, 10);`
    }
];

// Helper function to get algorithm by ID
function getAlgorithmById(id) {
    return ALGORITHMS.find(algo => algo.id === id);
}

// Helper function to get algorithms by category
function getAlgorithmsByCategory(category) {
    if (category === 'all') return ALGORITHMS;
    return ALGORITHMS.filter(algo => algo.category === category);
}

// Helper function to get algorithms by difficulty
function getAlgorithmsByDifficulty(difficulty) {
    if (difficulty === 'all') return ALGORITHMS;
    return ALGORITHMS.filter(algo => algo.difficulty === difficulty);
}

// Helper function to get featured algorithms
function getFeaturedAlgorithms() {
    return ALGORITHMS.filter(algo => algo.featured);
}

// Helper function to search algorithms
function searchAlgorithms(query) {
    const lowerQuery = query.toLowerCase();
    return ALGORITHMS.filter(algo =>
        algo.name.toLowerCase().includes(lowerQuery) ||
        algo.description.toLowerCase().includes(lowerQuery) ||
        algo.category.toLowerCase().includes(lowerQuery)
    );
}
