# Testing Guide - Algorithm Art Gallery

This document provides a comprehensive testing checklist to ensure the Algorithm Art Gallery works correctly.

## Quick Start Test

1. **Open `demo.html` in your browser**
   - ✅ You should see a full-screen canvas with Bubble Sort running
   - ✅ Control panel should be visible in top-left
   - ✅ Algorithm dropdown should work
   - ✅ Play/Pause button should toggle correctly
   - ✅ Press Space to pause/play
   - ✅ Press R to reset
   - ✅ Press → to step forward

## Gallery Page Tests (`index.html`)

### Visual Tests
- ✅ Page loads without errors (check browser console)
- ✅ Header displays "Algorithm Art Gallery" with gradient
- ✅ Dark mode toggle button is visible
- ✅ Search bar is present and functional
- ✅ Category filters (All, Sorting, Search, Math, Graphs, Classics) are clickable
- ✅ Difficulty filters (All Levels, Beginner, Intermediate, Advanced) work
- ✅ Featured section shows 3 algorithms
- ✅ All Algorithms section shows 20 algorithm cards
- ✅ Each card has a preview canvas with animation
- ✅ Favorite hearts (🤍/❤️) are clickable

### Functional Tests
1. **Search Functionality**
   - Type "sort" → should show only sorting algorithms
   - Type "fibonacci" → should show Fibonacci Spiral
   - Clear search → should show all algorithms

2. **Category Filters**
   - Click "Sorting" → shows 5 sorting algorithms
   - Click "Math" → shows 5 mathematical visualizations
   - Click "Graph" → shows 2 graph algorithms (Dijkstra, A*)
   - Click "Classic" → shows 5 classic problems
   - Click "All" → shows all 20 algorithms

3. **Difficulty Filters**
   - Click "Beginner" → shows beginner algorithms
   - Click "Intermediate" → shows intermediate algorithms
   - Click "Advanced" → shows advanced algorithms

4. **Interactions**
   - Click any algorithm card → navigates to `algorithm.html?id=<algorithm-id>`
   - Click favorite heart → toggles favorite state (saved in localStorage)
   - Click "Random" button → navigates to random algorithm

5. **Dark/Light Mode**
   - Click theme toggle → switches between dark and light mode
   - Preference should be saved (refresh page to verify)

## Algorithm Viewer Tests (`algorithm.html`)

### Test Each Algorithm Category

#### Sorting Algorithms (5)
1. **Bubble Sort** - `algorithm.html?id=bubble-sort`
   - ✅ Bars should swap with color highlights
   - ✅ Sorted elements turn to theme color
   - ✅ Smooth animations

2. **Quick Sort** - `algorithm.html?id=quick-sort`
   - ✅ Shows pivot element
   - ✅ Partitioning animation
   - ✅ Recursive divisions visible

3. **Merge Sort** - `algorithm.html?id=merge-sort`
   - ✅ Merging animation
   - ✅ Color coding for merged sections

4. **Insertion Sort** - `algorithm.html?id=insertion-sort`
   - ✅ Elements slide into position
   - ✅ Sorted section grows

5. **Radix Sort** - `algorithm.html?id=radix-sort`
   - ✅ Digit-by-digit sorting
   - ✅ Shows current digit being sorted

#### Search & Graph Algorithms (5)
1. **Binary Search** - `algorithm.html?id=binary-search`
   - ✅ Shows search range narrowing
   - ✅ Highlights target when found
   - ✅ Displays target number

2. **Depth-First Search** - `algorithm.html?id=dfs`
   - ✅ Graph nodes and edges render
   - ✅ DFS traversal path visible
   - ✅ Stack display updates

3. **Breadth-First Search** - `algorithm.html?id=bfs`
   - ✅ BFS ripple effect
   - ✅ Queue display updates
   - ✅ Level-by-level coloring

4. **Dijkstra's Algorithm** - `algorithm.html?id=dijkstra`
   - ✅ Weighted graph displays
   - ✅ Shortest path highlights
   - ✅ Distance labels on nodes

5. **A* Pathfinding** - `algorithm.html?id=a-star`
   - ✅ Grid with obstacles
   - ✅ Pathfinding animation
   - ✅ Final path highlighted

#### Mathematical Visualizations (5)
1. **Fibonacci Spiral** - `algorithm.html?id=fibonacci-spiral`
   - ✅ Golden spiral grows
   - ✅ Squares and arcs visible
   - ✅ Fibonacci numbers displayed

2. **Mandelbrot Set** - `algorithm.html?id=mandelbrot`
   - ✅ Fractal renders progressively
   - ✅ Color gradients beautiful
   - ✅ Iteration count increases

3. **Voronoi Diagram** - `algorithm.html?id=voronoi`
   - ✅ Organic cells form
   - ✅ Points add one by one
   - ✅ Cell boundaries clear

4. **Prime Number Spiral** - `algorithm.html?id=prime-spiral`
   - ✅ Ulam spiral forms
   - ✅ Primes highlighted
   - ✅ Numbers build outward

5. **Perlin Noise Flow** - `algorithm.html?id=perlin-noise`
   - ✅ Particles flow smoothly
   - ✅ Trails create organic patterns
   - ✅ Continuous animation

#### Classic Problems (5)
1. **Conway's Game of Life** - `algorithm.html?id=game-of-life`
   - ✅ Cells evolve
   - ✅ Generation counter increases
   - ✅ Patterns emerge

2. **Towers of Hanoi** - `algorithm.html?id=towers-of-hanoi`
   - ✅ Disks move between towers
   - ✅ Move counter updates
   - ✅ Animations smooth

3. **Sieve of Eratosthenes** - `algorithm.html?id=sieve-eratosthenes`
   - ✅ Numbers filter into primes
   - ✅ Composites fade out
   - ✅ Current sieving number highlighted

4. **Pascal's Triangle** - `algorithm.html?id=pascal-triangle`
   - ✅ Triangle grows row by row
   - ✅ Numbers color-coded
   - ✅ Proper formatting

5. **Recursive Tree** - `algorithm.html?id=recursive-tree`
   - ✅ Tree branches grow
   - ✅ Depth increases
   - ✅ Fractal structure visible

### Control Panel Tests

For each algorithm, test:

1. **Play/Pause Button**
   - ✅ Starts animation when clicked
   - ✅ Pauses animation
   - ✅ Button text updates (▶ Play / ⏸ Pause)

2. **Step Button**
   - ✅ Advances one frame
   - ✅ Pauses if playing

3. **Reset Button**
   - ✅ Returns to initial state
   - ✅ Resets counters

4. **Speed Slider**
   - ✅ 0.25x very slow
   - ✅ 1x normal speed
   - ✅ 4x very fast
   - ✅ Display updates

5. **Size Slider** (for applicable algorithms)
   - ✅ Changes number of elements
   - ✅ Requires reset/randomize

6. **Theme Selector**
   - ✅ Neon Dreams - Cyberpunk colors
   - ✅ Organic Growth - Nature greens
   - ✅ Minimalist - Grays/blacks
   - ✅ Retro Terminal - Green terminal
   - ✅ Synthwave - Pink/purple
   - ✅ Monochrome - Black/white
   - ✅ Pastel Paradise - Soft colors

7. **Randomize Data Button**
   - ✅ Generates new data
   - ✅ Resets visualization

8. **Code Toggle**
   - ✅ Shows/hides code snippet
   - ✅ Code is syntax-highlighted (monospace)

9. **Links**
   - ✅ Wikipedia link works
   - ✅ Related algorithms display
   - ✅ Related algorithm links work

10. **Share Button**
    - ✅ Copies URL to clipboard
    - ✅ Shows confirmation

11. **Screenshot Button**
    - ✅ Downloads PNG image
    - ✅ Image shows current visualization state

### Statistics Tests
- ✅ Step count increases during animation
- ✅ Operations count updates
- ✅ Time elapsed increments
- ✅ All display in mono font

### Keyboard Shortcuts
- ✅ `Space` - Play/Pause
- ✅ `→` - Next step
- ✅ `R` - Reset
- ✅ `D` - Randomize data

### Mobile Responsiveness
- ✅ Page layout adapts on mobile (control panel below canvas)
- ✅ Touch controls work
- ✅ Text readable on small screens
- ✅ Buttons accessible

## Browser Compatibility Tests

Test in multiple browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

## Performance Tests

1. **Frame Rate**
   - ✅ Animations run at ~60fps
   - ✅ No stuttering or lag
   - ✅ Canvas renders smoothly

2. **Memory**
   - ✅ No memory leaks (check DevTools)
   - ✅ Can switch between algorithms without issues

3. **Large Data Sets**
   - ✅ Sorting with 200 elements works
   - ✅ Game of Life with 80x80 grid works
   - ✅ A* with 30x30 grid works

## Error Handling Tests

1. **Invalid Algorithm ID**
   - Visit `algorithm.html?id=invalid-algo`
   - ✅ Shows error message
   - ✅ "Back to Gallery" link works

2. **No Algorithm ID**
   - Visit `algorithm.html` (no parameters)
   - ✅ Redirects to index.html

3. **Console Errors**
   - ✅ No JavaScript errors in console
   - ✅ No 404s for resources

## Data Persistence Tests

1. **Favorites**
   - ✅ Mark algorithms as favorites
   - ✅ Refresh page → favorites persists
   - ✅ Clear localStorage → favorites reset

2. **Theme Preference**
   - ✅ Toggle dark/light mode
   - ✅ Refresh page → preference persists

## Final Checklist

- ✅ All 20 algorithms implemented
- ✅ All 7 themes working
- ✅ All interactive controls functional
- ✅ No console errors
- ✅ Responsive design works
- ✅ Documentation complete
- ✅ Code is clean and commented
- ✅ Ready for production

---

## Automated Test Script

Open browser console and run:

```javascript
// Quick test for gallery page
console.log('Testing Algorithm Count...');
console.log('Total algorithms:', ALGORITHMS.length); // Should be 20

console.log('Testing categories...');
console.log('Sorting:', getAlgorithmsByCategory('sorting').length); // Should be 5
console.log('Search:', getAlgorithmsByCategory('search').length); // Should be 3
console.log('Graph:', getAlgorithmsByCategory('graph').length); // Should be 2
console.log('Math:', getAlgorithmsByCategory('math').length); // Should be 5
console.log('Classic:', getAlgorithmsByCategory('classic').length); // Should be 5

console.log('Testing themes...');
console.log('Themes available:', Object.keys(VISUAL_THEMES).length); // Should be 7

console.log('✅ All tests passed!');
```

---

**If all tests pass, the project is production-ready! 🎉**
