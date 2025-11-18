// Algorithm Viewer - Controls and UI Logic

let currentVisualizer = null;
let currentAlgorithm = null;

// Initialize viewer
function initViewer() {
    // Get algorithm ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmId = urlParams.get('id');

    if (!algorithmId) {
        window.location.href = 'index.html';
        return;
    }

    currentAlgorithm = getAlgorithmById(algorithmId);

    if (!currentAlgorithm) {
        window.location.href = 'index.html';
        return;
    }

    // Setup UI
    setupUI();
    setupControls();
    initializeVisualizer();

    // Hide loading spinner
    setTimeout(() => {
        document.getElementById('loadingSpinner').style.display = 'none';
    }, 500);
}

// Setup UI with algorithm info
function setupUI() {
    document.title = `${currentAlgorithm.name} - Algorithm Art Gallery`;

    document.getElementById('algorithmName').textContent = currentAlgorithm.name;
    document.getElementById('algorithmDescription').textContent = currentAlgorithm.description;

    // Difficulty badge
    const difficultyBadge = document.getElementById('difficultyBadge');
    difficultyBadge.textContent = currentAlgorithm.difficulty;
    difficultyBadge.className = `badge badge-${currentAlgorithm.difficulty}`;

    // Category badge
    document.getElementById('categoryBadge').textContent = currentAlgorithm.category;

    // Complexity
    document.getElementById('timeComplexity').textContent = currentAlgorithm.timeComplexity;
    document.getElementById('spaceComplexity').textContent = currentAlgorithm.spaceComplexity;

    // Code snippet
    document.getElementById('codeContent').textContent = currentAlgorithm.code;

    // External links
    document.getElementById('wikiLink').href = currentAlgorithm.wikiLink;
    document.getElementById('visualgoLink').href = currentAlgorithm.wikiLink;

    // Related algorithms
    const relatedContainer = document.getElementById('relatedAlgorithms');
    if (currentAlgorithm.related && currentAlgorithm.related.length > 0) {
        relatedContainer.innerHTML = currentAlgorithm.related
            .map(id => {
                const algo = getAlgorithmById(id);
                if (algo) {
                    return `
                        <a href="algorithm.html?id=${id}" class="block px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm">
                            ${algo.name}
                        </a>
                    `;
                }
                return '';
            })
            .join('');
    }
}

// Setup controls
function setupControls() {
    // Play/Pause button
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.addEventListener('click', () => {
        if (!currentVisualizer) return;

        if (currentVisualizer.isPlaying) {
            currentVisualizer.pause();
            playPauseBtn.innerHTML = '▶ Play';
            playPauseBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
            playPauseBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        } else {
            currentVisualizer.play();
            if (!currentVisualizer.animationId) {
                currentVisualizer.start();
            }
            playPauseBtn.innerHTML = '⏸ Pause';
            playPauseBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            playPauseBtn.classList.add('bg-purple-600', 'hover:bg-purple-700');
        }
    });

    // Step button
    document.getElementById('stepBtn').addEventListener('click', () => {
        if (!currentVisualizer) return;
        currentVisualizer.pause();
        currentVisualizer.step();
        playPauseBtn.innerHTML = '▶ Play';
        updateStats();
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (!currentVisualizer) return;
        currentVisualizer.stop();
        currentVisualizer.reset();
        currentVisualizer.currentStepIndex = 0;
        currentVisualizer.render();
        playPauseBtn.innerHTML = '▶ Play';
        playPauseBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
        playPauseBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        updateStats();
    });

    // Speed slider
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    speedSlider.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        speedValue.textContent = `${speed}x`;
        if (currentVisualizer) {
            currentVisualizer.setSpeed(speed);
        }
    });

    // Size slider
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            sizeValue.textContent = size;
        });
    }

    // Theme selector
    const themeSelector = document.getElementById('visualThemeSelector');
    themeSelector.addEventListener('change', (e) => {
        if (currentVisualizer) {
            currentVisualizer.setTheme(e.target.value);
            currentVisualizer.render();
        }
    });

    // Randomize button
    document.getElementById('randomizeBtn').addEventListener('click', () => {
        if (!currentVisualizer) return;

        currentVisualizer.stop();
        const size = parseInt(document.getElementById('sizeSlider')?.value || 50);
        currentVisualizer.generateData(size);
        currentVisualizer.currentStepIndex = 0;
        currentVisualizer.reset();
        currentVisualizer.render();
        updateStats();
    });

    // Custom Input Modal
    const customInputModal = document.getElementById('customInputModal');
    const customInputBtn = document.getElementById('customInputBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelCustomInput = document.getElementById('cancelCustomInput');
    const applyCustomInput = document.getElementById('applyCustomInput');
    const customInputArea = document.getElementById('customInputArea');
    const inputError = document.getElementById('inputError');

    // Show modal
    customInputBtn.addEventListener('click', () => {
        customInputModal.classList.remove('hidden');
        customInputArea.focus();
    });

    // Close modal handlers
    closeModalBtn.addEventListener('click', () => {
        customInputModal.classList.add('hidden');
        inputError.classList.add('hidden');
    });

    cancelCustomInput.addEventListener('click', () => {
        customInputModal.classList.add('hidden');
        inputError.classList.add('hidden');
    });

    // Apply custom input
    applyCustomInput.addEventListener('click', () => {
        if (!currentVisualizer) return;

        const input = customInputArea.value.trim();
        if (!input) {
            showInputError('Please enter some values');
            return;
        }

        // Parse comma-separated values
        const values = input.split(',').map(v => v.trim()).filter(v => v !== '');
        const numbers = values.map(v => parseFloat(v));

        // Validation
        if (numbers.some(n => isNaN(n))) {
            showInputError('Please enter valid numbers only');
            return;
        }

        if (numbers.length < 5) {
            showInputError('Please enter at least 5 values');
            return;
        }

        if (numbers.length > 200) {
            showInputError('Please enter no more than 200 values');
            return;
        }

        // Apply custom data
        try {
            currentVisualizer.stop();

            // For sorting algorithms, use the numbers directly
            if (currentAlgorithm.category === 'sorting') {
                currentVisualizer.data = numbers;
                currentVisualizer.calculateSteps();
            }
            // For search algorithms (like binary search), use sorted data and first number as target
            else if (currentAlgorithm.id === 'binary-search') {
                const sorted = [...numbers].sort((a, b) => a - b);
                currentVisualizer.data = sorted;
                currentVisualizer.target = numbers[0]; // First number is the target
                currentVisualizer.calculateSteps();
            }
            // For other algorithms, use default generation with custom size
            else {
                currentVisualizer.generateData(numbers.length);
            }

            currentVisualizer.currentStepIndex = 0;
            currentVisualizer.reset();
            currentVisualizer.render();
            updateStats();

            // Close modal and clear error
            customInputModal.classList.add('hidden');
            inputError.classList.add('hidden');
            customInputArea.value = '';

        } catch (error) {
            showInputError('Error applying input: ' + error.message);
        }
    });

    function showInputError(message) {
        inputError.textContent = message;
        inputError.classList.remove('hidden');
    }

    // Code toggle
    document.getElementById('codeToggle').addEventListener('click', () => {
        const codeSnippet = document.getElementById('codeSnippet');
        const isHidden = codeSnippet.classList.contains('hidden');

        if (isHidden) {
            codeSnippet.classList.remove('hidden');
            document.getElementById('codeToggle').querySelector('span:last-child').textContent = '▲';
        } else {
            codeSnippet.classList.add('hidden');
            document.getElementById('codeToggle').querySelector('span:last-child').textContent = '▼';
        }
    });

    // Share button
    document.getElementById('shareBtn').addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    });

    // Screenshot button
    document.getElementById('screenshotBtn').addEventListener('click', () => {
        if (currentVisualizer) {
            currentVisualizer.saveImage(`${currentAlgorithm.id}.png`);
        }
    });

    // Update stats periodically
    setInterval(updateStats, 100);
}

// Initialize the appropriate visualizer
function initializeVisualizer() {
    const canvas = document.getElementById('visualizationCanvas');

    try {
        // Create visualizer based on algorithm ID
        switch (currentAlgorithm.id) {
        // Sorting
        case 'bubble-sort':
            currentVisualizer = new BubbleSortVisualizer('visualizationCanvas');
            break;
        case 'quick-sort':
            currentVisualizer = new QuickSortVisualizer('visualizationCanvas');
            break;
        case 'merge-sort':
            currentVisualizer = new MergeSortVisualizer('visualizationCanvas');
            break;
        case 'insertion-sort':
            currentVisualizer = new InsertionSortVisualizer('visualizationCanvas');
            break;
        case 'radix-sort':
            currentVisualizer = new RadixSortVisualizer('visualizationCanvas');
            break;

        // Search
        case 'binary-search':
            currentVisualizer = new BinarySearchVisualizer('visualizationCanvas');
            break;
        case 'dfs':
            currentVisualizer = new DFSVisualizer('visualizationCanvas');
            break;
        case 'bfs':
            currentVisualizer = new BFSVisualizer('visualizationCanvas');
            break;

        // Graph
        case 'dijkstra':
            currentVisualizer = new DijkstraVisualizer('visualizationCanvas');
            break;
        case 'a-star':
            currentVisualizer = new AStarVisualizer('visualizationCanvas');
            break;

        // Math
        case 'fibonacci-spiral':
            currentVisualizer = new FibonacciSpiralVisualizer('visualizationCanvas');
            break;
        case 'mandelbrot':
            currentVisualizer = new MandelbrotVisualizer('visualizationCanvas');
            break;
        case 'voronoi':
            currentVisualizer = new VoronoiVisualizer('visualizationCanvas');
            break;
        case 'prime-spiral':
            currentVisualizer = new PrimeSpiralVisualizer('visualizationCanvas');
            break;
        case 'perlin-noise':
            currentVisualizer = new PerlinNoiseVisualizer('visualizationCanvas');
            break;

        // Classic
        case 'game-of-life':
            currentVisualizer = new GameOfLifeVisualizer('visualizationCanvas');
            break;
        case 'towers-of-hanoi':
            currentVisualizer = new TowersOfHanoiVisualizer('visualizationCanvas');
            break;
        case 'sieve-eratosthenes':
            currentVisualizer = new SieveOfEratosthenesVisualizer('visualizationCanvas');
            break;
        case 'pascal-triangle':
            currentVisualizer = new PascalTriangleVisualizer('visualizationCanvas');
            break;
        case 'recursive-tree':
            currentVisualizer = new RecursiveTreeVisualizer('visualizationCanvas');
            break;

            default:
                throw new Error(`Unknown algorithm: ${currentAlgorithm.id}`);
        }

        // Generate initial data
        const size = parseInt(document.getElementById('sizeSlider')?.value || 50);
        currentVisualizer.generateData(size);
        currentVisualizer.render();

    } catch (error) {
        console.error('Error initializing visualizer:', error);

        // Show error message to user
        const loadingSpinner = document.getElementById('loadingSpinner');
        loadingSpinner.innerHTML = `
            <div class="text-center text-red-400">
                <div class="text-6xl mb-4">⚠️</div>
                <h2 class="text-2xl font-bold mb-2">Error Loading Visualization</h2>
                <p class="text-gray-400 mb-4">${error.message}</p>
                <a href="index.html" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg inline-block transition-colors">
                    ← Back to Gallery
                </a>
            </div>
        `;
    }
}

// Update statistics display
function updateStats() {
    if (!currentVisualizer) return;

    document.getElementById('stepCount').textContent = currentVisualizer.currentStep;
    document.getElementById('operationCount').textContent = currentVisualizer.operations;
    document.getElementById('timeElapsed').textContent = currentVisualizer.getElapsedTime().toFixed(1) + 's';
}

// Handle window resize
window.addEventListener('resize', () => {
    if (currentVisualizer) {
        currentVisualizer.setupCanvas();
        currentVisualizer.render();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ignore if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    switch(e.key.toLowerCase()) {
        case ' ': // Space - Play/Pause
            e.preventDefault();
            document.getElementById('playPauseBtn').click();
            break;
        case 'arrowright': // → - Next step
            e.preventDefault();
            document.getElementById('stepBtn').click();
            break;
        case 'r': // R - Reset
            e.preventDefault();
            document.getElementById('resetBtn').click();
            break;
        case 'd': // D - Randomize data
            e.preventDefault();
            document.getElementById('randomizeBtn').click();
            break;
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewer);
} else {
    initViewer();
}
