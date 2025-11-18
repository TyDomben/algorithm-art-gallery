# 🎨 Algorithm Art Gallery

**Transform classic algorithms into mesmerizing visual art pieces**

A stunning interactive gallery that visualizes classic programming algorithms as beautiful, educational animations. Each algorithm becomes an interactive artwork that's both educational and aesthetically stunning.

![Algorithm Art Gallery](https://img.shields.io/badge/algorithms-20-purple) ![Status](https://img.shields.io/badge/status-live-success) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 🎭 20 Beautiful Algorithm Visualizations

#### Sorting Algorithms
- **Bubble Sort** - Rising bubbles with colors
- **Quick Sort** - Recursive partitioning as fractal splits
- **Merge Sort** - Merging streams of color
- **Insertion Sort** - Cards sliding into place
- **Radix Sort** - Digit-by-digit rainbow cascade

#### Search & Traversal
- **Binary Search** - Zooming into sorted array
- **Depth-First Search** - Maze exploration with trail
- **Breadth-First Search** - Ripple effect through graph
- **Dijkstra's Algorithm** - Light spreading through network
- **A* Pathfinding** - Intelligent route-finding

#### Mathematical Beauty
- **Fibonacci Spiral** - Golden ratio growing organically
- **Mandelbrot Set** - Deep zoom with color gradients
- **Voronoi Diagrams** - Organic cell-like patterns
- **Prime Number Spiral** - Ulam spiral revealing patterns
- **Perlin Noise Flow** - Particle system with natural motion

#### Classic Problems
- **Conway's Game of Life** - Cellular automata patterns
- **Towers of Hanoi** - Graceful disk movements
- **Sieve of Eratosthenes** - Numbers filtering into primes
- **Pascal's Triangle** - Expanding number pyramid
- **Recursive Tree** - L-system-like branching

### 🎨 Visual Themes

Choose from 7 stunning visual themes:
- **Neon Dreams** - Cyberpunk aesthetic
- **Organic Growth** - Nature-inspired colors
- **Minimalist** - Clean, simple, elegant
- **Retro Terminal** - Green phosphor/amber CRT vibes
- **Synthwave** - 80s sunset gradients
- **Monochrome** - Black and white art
- **Pastel Paradise** - Soft, dreamy colors

### 🎮 Interactive Controls

- ▶️ **Play/Pause** - Control animation playback
- ⏭️ **Step-through** - Analyze frame by frame
- 🎚️ **Speed Control** - Adjust from 0.25x to 4x speed
- 🔄 **Reset** - Start from beginning
- 🎲 **Randomize** - Generate new data
- 🎨 **Theme Selector** - Switch visual styles on the fly
- 📸 **Screenshot** - Export high-quality images
- 📤 **Share** - Generate shareable links

### 📚 Educational Elements

Each visualization includes:
- Algorithm name and description
- Time and space complexity (Big-O notation)
- Step counter and operations tracker
- Syntax-highlighted code snippets
- Links to Wikipedia and learning resources
- Related algorithm suggestions

### 🎯 Gallery Features

- Grid layout with animated previews
- Category filters (Sorting, Search, Math, Graphs, Classics)
- Difficulty tags (Beginner, Intermediate, Advanced)
- Search functionality
- Featured algorithms section
- Favorites system (saved in localStorage)
- Dark/Light mode toggle
- Fully responsive design

## 🚀 Getting Started

### Installation

Simply clone and open in a browser - no build process required!

```bash
git clone https://github.com/yourusername/algorithm-art-gallery.git
cd algorithm-art-gallery
```

### Running Locally

**Quick Start:**
- Open `index.html` for the full gallery experience
- Open `demo.html` for a quick single-algorithm demo

Or use a simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 📁 Project Structure

```
algorithm-art-gallery/
├── index.html              # Gallery homepage
├── algorithm.html          # Algorithm viewer page
├── demo.html              # Quick demo page
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── algorithms-data.js # Algorithm metadata
│   ├── framework.js       # Visualization framework
│   ├── gallery.js         # Gallery interface logic
│   ├── themes.js          # Theme system
│   ├── viewer.js          # Viewer page controller
│   └── algorithms/
│       ├── sorting.js     # Sorting visualizations
│       ├── search.js      # Search visualizations
│       ├── graph.js       # Graph algorithms
│       ├── math.js        # Mathematical visualizations
│       └── classic.js     # Classic problems
└── README.md
```

## 🎨 Usage

### Gallery View

1. Open `index.html` to see all algorithms
2. Use filters to find algorithms by category or difficulty
3. Search for specific algorithms
4. Click on any card to view the full visualization

### Algorithm View

1. Select an algorithm from the gallery
2. Click **Play** to start the animation
3. Adjust **Speed** to control playback
4. Use **Step** to advance frame-by-frame
5. **Randomize** to generate new data
6. Change **Theme** for different visual styles
7. Click **Screenshot** to save the current frame

### Keyboard Shortcuts

- `Space` - Play/Pause
- `→` - Next step
- `R` - Reset
- `D` - Randomize data

## 🔧 Technical Details

### Technologies Used

- **HTML5 Canvas** - For rendering visualizations
- **Vanilla JavaScript** - No frameworks, pure JS
- **Tailwind CSS** - For UI styling
- **LocalStorage** - For favorites and preferences

### Browser Support

Works best in modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Performance

- Optimized for 60fps animations
- Handles 1000+ elements smoothly
- Efficient rendering with canvas
- Pixel-level optimizations for complex fractals

## 🎓 Educational Use

Perfect for:
- Computer Science students learning algorithms
- Teachers demonstrating algorithm behavior
- Coding bootcamps and workshops
- Self-learners exploring data structures
- Algorithm interview preparation

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

1. **Add new algorithms** - Implement new visualizations
2. **Create new themes** - Design beautiful color palettes
3. **Improve animations** - Make visualizations more engaging
4. **Fix bugs** - Report and fix issues
5. **Documentation** - Improve guides and comments

### Adding a New Algorithm

1. Add metadata to `js/algorithms-data.js`
2. Create visualizer class in appropriate file
3. Extend `AlgorithmVisualizer` base class
4. Implement `generateData()`, `calculateSteps()`, and `render()`
5. Add case in `viewer.js` to instantiate your visualizer

## 📝 License

MIT License - feel free to use this project for learning, teaching, or your portfolio!

## 🌟 Credits

Created with ❤️ to make computer science beautiful

Inspired by:
- [VisuAlgo](https://visualgo.net)
- [The Coding Train](https://thecodingtrain.com)
- Processing and p5.js communities

## 🎯 Roadmap

Future enhancements:
- [ ] More algorithms (Heap Sort, Red-Black Trees, etc.)
- [ ] Algorithm comparisons (side-by-side)
- [ ] Custom data input
- [ ] Sound design/sonification
- [ ] GIF export
- [ ] Social sharing with preview images
- [ ] Mobile touch controls
- [ ] Algorithm race mode

## 📧 Contact

Have questions or suggestions? Open an issue or reach out!

---

**Made with 💜 for the algorithm art community**

*"I never knew algorithms could be this beautiful!"*
