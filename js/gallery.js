// Algorithm Art Gallery - Gallery Interface

let currentCategory = 'all';
let currentDifficulty = 'all';
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Initialize gallery
function initGallery() {
    renderFeaturedAlgorithms();
    renderAlgorithmGrid();
    setupEventListeners();
}

// Render featured algorithms
function renderFeaturedAlgorithms() {
    const featuredGrid = document.getElementById('featuredGrid');
    const featured = getFeaturedAlgorithms();

    featuredGrid.innerHTML = featured.slice(0, 3).map(algo => createAlgorithmCard(algo, true)).join('');
}

// Render main algorithm grid
function renderAlgorithmGrid() {
    const grid = document.getElementById('algorithmGrid');
    let algorithms = getAlgorithmsByCategory(currentCategory);

    if (currentDifficulty !== 'all') {
        algorithms = algorithms.filter(algo => algo.difficulty === currentDifficulty);
    }

    grid.innerHTML = algorithms.map(algo => createAlgorithmCard(algo, false)).join('');
}

// Create algorithm card HTML
function createAlgorithmCard(algo, isFeatured) {
    const isFavorited = favorites.includes(algo.id);

    return `
        <div class="algorithm-card fade-in" data-id="${algo.id}">
            <div class="card-preview" id="preview-${algo.id}">
                <canvas id="canvas-${algo.id}" width="400" height="200"></canvas>
                <div class="favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavorite('${algo.id}', event)">
                    ${isFavorited ? '❤️' : '🤍'}
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${algo.name}</h3>
                <p class="card-description">${algo.description.substring(0, 100)}...</p>
                <div class="card-meta">
                    <div class="flex gap-2">
                        <span class="badge badge-${algo.difficulty}">${algo.difficulty}</span>
                        <span class="badge" style="background: #374151;">${algo.category}</span>
                    </div>
                    <div class="text-purple-400 font-mono text-xs">${algo.timeComplexity}</div>
                </div>
            </div>
        </div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderAlgorithmGrid();
            initializePreviews();
        });
    });

    // Difficulty filters
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentDifficulty = e.target.dataset.difficulty;
            renderAlgorithmGrid();
            initializePreviews();
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length === 0) {
            renderAlgorithmGrid();
        } else {
            const results = searchAlgorithms(query);
            const grid = document.getElementById('algorithmGrid');
            grid.innerHTML = results.map(algo => createAlgorithmCard(algo, false)).join('');
        }
        initializePreviews();
    });

    // Random button
    const randomBtn = document.getElementById('randomBtn');
    randomBtn.addEventListener('click', () => {
        const randomAlgo = ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)];
        window.location.href = `algorithm.html?id=${randomAlgo.id}`;
    });

    // Card clicks
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.algorithm-card');
        if (card && !e.target.closest('.favorite-btn')) {
            const id = card.dataset.id;
            window.location.href = `algorithm.html?id=${id}`;
        }
    });
}

// Toggle favorite
function toggleFavorite(id, event) {
    event.stopPropagation();
    const index = favorites.indexOf(id);

    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Update UI
    const btn = event.target.closest('.favorite-btn');
    if (favorites.includes(id)) {
        btn.classList.add('favorited');
        btn.textContent = '❤️';
    } else {
        btn.classList.remove('favorited');
        btn.textContent = '🤍';
    }
}

// Initialize mini previews for cards
function initializePreviews() {
    document.querySelectorAll('.algorithm-card').forEach(card => {
        const id = card.dataset.id;
        const canvas = document.getElementById(`canvas-${id}`);
        if (canvas) {
            const algo = getAlgorithmById(id);
            renderMiniPreview(canvas, algo);
        }
    });
}

// Render mini preview on card
function renderMiniPreview(canvas, algo) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Simple preview based on category
    if (algo.category === 'sorting') {
        renderSortingPreview(ctx, width, height, algo.id);
    } else if (algo.category === 'search' || algo.category === 'graph') {
        renderGraphPreview(ctx, width, height);
    } else if (algo.category === 'math') {
        renderMathPreview(ctx, width, height, algo.id);
    } else if (algo.category === 'classic') {
        renderClassicPreview(ctx, width, height, algo.id);
    }
}

// Sorting preview
function renderSortingPreview(ctx, width, height, id) {
    const bars = 30;
    const barWidth = width / bars;

    for (let i = 0; i < bars; i++) {
        const barHeight = (Math.sin(i * 0.2) * 0.4 + 0.6) * height * 0.8;
        const hue = (i / bars) * 360;

        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
    }
}

// Graph preview
function renderGraphPreview(ctx, width, height) {
    const nodes = 8;
    const points = [];

    // Generate random points
    for (let i = 0; i < nodes; i++) {
        points.push({
            x: Math.random() * width * 0.8 + width * 0.1,
            y: Math.random() * height * 0.8 + height * 0.1
        });
    }

    // Draw connections
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < nodes; i++) {
        for (let j = i + 1; j < nodes; j++) {
            if (Math.random() > 0.6) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        }
    }

    // Draw nodes
    points.forEach((p, i) => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
        gradient.addColorStop(0, '#a855f7');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Math preview
function renderMathPreview(ctx, width, height, id) {
    if (id === 'fibonacci-spiral') {
        // Draw Fibonacci spiral
        let x = width / 2;
        let y = height / 2;
        let size = 5;

        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;

        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            const angle = (i * Math.PI) / 2;
            ctx.arc(x, y, size, angle, angle + Math.PI / 2);
            ctx.stroke();

            // Update position
            const nextSize = size * 1.618;
            const dx = Math.cos(angle + Math.PI / 2) * size;
            const dy = Math.sin(angle + Math.PI / 2) * size;
            x += dx;
            y += dy;
            size = nextSize;
        }
    } else if (id === 'mandelbrot') {
        // Draw Mandelbrot preview
        for (let px = 0; px < width; px += 2) {
            for (let py = 0; py < height; py += 2) {
                const x0 = (px / width) * 3.5 - 2.5;
                const y0 = (py / height) * 2 - 1;

                let x = 0, y = 0, iteration = 0;
                const maxIterations = 50;

                while (x * x + y * y <= 4 && iteration < maxIterations) {
                    const xtemp = x * x - y * y + x0;
                    y = 2 * x * y + y0;
                    x = xtemp;
                    iteration++;
                }

                if (iteration < maxIterations) {
                    const hue = (iteration / maxIterations) * 360;
                    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                    ctx.fillRect(px, py, 2, 2);
                }
            }
        }
    } else if (id === 'voronoi') {
        // Draw Voronoi preview
        const points = [];
        for (let i = 0; i < 12; i++) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }

        for (let x = 0; x < width; x += 4) {
            for (let y = 0; y < height; y += 4) {
                let minDist = Infinity;
                let closestPoint = null;

                points.forEach(p => {
                    const dist = Math.hypot(x - p.x, y - p.y);
                    if (dist < minDist) {
                        minDist = dist;
                        closestPoint = p;
                    }
                });

                ctx.fillStyle = closestPoint.color;
                ctx.fillRect(x, y, 4, 4);
            }
        }
    } else {
        // Generic math preview
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x += 5) {
            const y = height / 2 + Math.sin(x * 0.05) * height * 0.3;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

// Classic preview
function renderClassicPreview(ctx, width, height, id) {
    if (id === 'game-of-life') {
        // Draw Game of Life grid
        const cellSize = 10;
        const cols = Math.floor(width / cellSize);
        const rows = Math.floor(height / cellSize);

        ctx.fillStyle = '#a855f7';
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (Math.random() > 0.7) {
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
                }
            }
        }
    } else if (id === 'towers-of-hanoi') {
        // Draw Towers of Hanoi
        const towerX = [width * 0.2, width * 0.5, width * 0.8];
        const baseY = height * 0.8;

        ctx.fillStyle = '#666';
        towerX.forEach(x => {
            ctx.fillRect(x - 3, baseY - 80, 6, 80);
        });

        const disks = [3, 2, 1];
        disks.forEach((diskSize, i) => {
            const diskWidth = diskSize * 20;
            const gradient = ctx.createLinearGradient(towerX[0] - diskWidth / 2, 0, towerX[0] + diskWidth / 2, 0);
            gradient.addColorStop(0, '#a855f7');
            gradient.addColorStop(1, '#ec4899');

            ctx.fillStyle = gradient;
            ctx.fillRect(
                towerX[0] - diskWidth / 2,
                baseY - (i + 1) * 15,
                diskWidth,
                12
            );
        });
    } else {
        // Generic classic preview
        ctx.fillStyle = '#a855f7';
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * width,
                Math.random() * height,
                Math.random() * 5 + 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initGallery();
        setTimeout(initializePreviews, 100);
    });
} else {
    initGallery();
    setTimeout(initializePreviews, 100);
}
