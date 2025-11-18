// Algorithm Art Gallery - Theme System

const VISUAL_THEMES = {
    neon: {
        name: 'Neon Dreams',
        background: '#0a0a0a',
        colors: [
            '#ff006e', // Hot pink
            '#00f5ff', // Cyan
            '#ffbe0b', // Yellow
            '#8338ec', // Purple
            '#3a86ff', // Blue
            '#fb5607', // Orange
            '#ff006e', // Pink
            '#06ffa5'  // Mint
        ],
        glow: true,
        particleColor: '#00f5ff',
        trailOpacity: 0.3
    },
    organic: {
        name: 'Organic Growth',
        background: '#1a2f1a',
        colors: [
            '#52b788', // Forest green
            '#95d5b2', // Mint
            '#d8f3dc', // Light green
            '#74c69d', // Medium green
            '#40916c', // Dark green
            '#2d6a4f', // Forest
            '#1b4332', // Deep green
            '#b7e4c7'  // Pale green
        ],
        glow: false,
        particleColor: '#95d5b2',
        trailOpacity: 0.2
    },
    minimalist: {
        name: 'Minimalist',
        background: '#ffffff',
        colors: [
            '#000000', // Black
            '#333333', // Dark gray
            '#666666', // Gray
            '#999999', // Light gray
            '#111111', // Near black
            '#222222', // Very dark gray
            '#444444', // Medium gray
            '#555555'  // Gray
        ],
        glow: false,
        particleColor: '#000000',
        trailOpacity: 0.15
    },
    retro: {
        name: 'Retro Terminal',
        background: '#000000',
        colors: [
            '#00ff00', // Classic green
            '#00cc00', // Medium green
            '#009900', // Dark green
            '#33ff33', // Light green
            '#00ff66', // Cyan green
            '#00cc33', // Green
            '#66ff66', // Pale green
            '#00ff99'  // Aqua green
        ],
        glow: true,
        particleColor: '#00ff00',
        trailOpacity: 0.4,
        scanlines: true
    },
    synthwave: {
        name: 'Synthwave',
        background: '#2b0f35',
        colors: [
            '#ff00ff', // Magenta
            '#ff0080', // Hot pink
            '#ff0040', // Red pink
            '#ff6ec7', // Light pink
            '#00ffff', // Cyan
            '#8000ff', // Purple
            '#ff00aa', // Pink
            '#aa00ff'  // Violet
        ],
        glow: true,
        particleColor: '#ff00ff',
        trailOpacity: 0.35,
        grid: true
    },
    monochrome: {
        name: 'Monochrome',
        background: '#000000',
        colors: [
            '#ffffff', // White
            '#e0e0e0', // Very light gray
            '#c0c0c0', // Light gray
            '#a0a0a0', // Gray
            '#808080', // Medium gray
            '#606060', // Dark gray
            '#404040', // Very dark gray
            '#d0d0d0'  // Off white
        ],
        glow: false,
        particleColor: '#ffffff',
        trailOpacity: 0.2
    },
    pastel: {
        name: 'Pastel Paradise',
        background: '#fef9f3',
        colors: [
            '#ffadad', // Pink
            '#ffd6a5', // Peach
            '#fdffb6', // Yellow
            '#caffbf', // Mint
            '#9bf6ff', // Light blue
            '#a0c4ff', // Blue
            '#bdb2ff', // Lavender
            '#ffc6ff'  // Light pink
        ],
        glow: false,
        particleColor: '#ffadad',
        trailOpacity: 0.25
    }
};

// Get color from theme based on value (0-1)
function getThemeColor(theme, value) {
    const colors = VISUAL_THEMES[theme].colors;
    const index = Math.floor(value * (colors.length - 1));
    return colors[index];
}

// Get color from theme based on index
function getThemeColorByIndex(theme, index) {
    const colors = VISUAL_THEMES[theme].colors;
    return colors[index % colors.length];
}

// Interpolate between two colors
function lerpColor(color1, color2, amount) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * amount);
    const g = Math.round(g1 + (g2 - g1) * amount);
    const b = Math.round(b1 + (b2 - b1) * amount);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Get gradient colors from theme
function getThemeGradient(theme, steps) {
    const colors = VISUAL_THEMES[theme].colors;
    const gradient = [];

    for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const colorIndex = t * (colors.length - 1);
        const index1 = Math.floor(colorIndex);
        const index2 = Math.ceil(colorIndex);
        const amount = colorIndex - index1;

        gradient.push(lerpColor(colors[index1], colors[index2 % colors.length], amount));
    }

    return gradient;
}

// Apply theme to canvas context
function applyTheme(ctx, theme) {
    const themeData = VISUAL_THEMES[theme];

    if (themeData.glow) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = themeData.particleColor;
    } else {
        ctx.shadowBlur = 0;
    }
}

// Dark mode / Light mode toggle
function initializeThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved preference
    const savedTheme = localStorage.getItem('pageTheme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        body.classList.remove('bg-gray-900', 'text-white');
        body.classList.add('bg-white', 'text-gray-900');
        if (toggle) toggle.textContent = '☀️ Light';
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');

            if (body.classList.contains('light-mode')) {
                body.classList.remove('bg-gray-900', 'text-white');
                body.classList.add('bg-white', 'text-gray-900');
                toggle.textContent = '☀️ Light';
                localStorage.setItem('pageTheme', 'light');
            } else {
                body.classList.remove('bg-white', 'text-gray-900');
                body.classList.add('bg-gray-900', 'text-white');
                toggle.textContent = '🌙 Dark';
                localStorage.setItem('pageTheme', 'dark');
            }
        });
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeToggle);
} else {
    initializeThemeToggle();
}
