// Sorting Algorithms Visualizations

class BubbleSortVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'bubble-sort');
        this.comparisons = [];
        this.swaps = [];
    }

    generateData(size = 50) {
        this.data = generateRandomArray(size, 10, 90);
        this.calculateSteps();
    }

    calculateSteps() {
        const arr = [...this.data];
        this.steps = [{
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: []
        }];

        const n = arr.length;
        const sorted = [];

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Compare step
                this.steps.push({
                    array: [...arr],
                    comparing: [j, j + 1],
                    swapping: [],
                    sorted: [...sorted]
                });

                if (arr[j] > arr[j + 1]) {
                    // Swap step
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.steps.push({
                        array: [...arr],
                        comparing: [],
                        swapping: [j, j + 1],
                        sorted: [...sorted]
                    });
                }
            }
            sorted.push(n - i - 1);
        }

        this.steps.push({
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, i) => i)
        });

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];
        const barWidth = this.width / step.array.length;
        const maxValue = Math.max(...this.data);

        step.array.forEach((value, i) => {
            const barHeight = (value / maxValue) * this.height * 0.8;
            const x = i * barWidth;
            const y = this.height - barHeight;

            let color;
            if (step.sorted.includes(i)) {
                color = getThemeColorByIndex(this.theme, 0); // Sorted - first theme color
            } else if (step.comparing.includes(i)) {
                color = getThemeColorByIndex(this.theme, 3); // Comparing
            } else if (step.swapping.includes(i)) {
                color = getThemeColorByIndex(this.theme, 5); // Swapping
            } else {
                const colorValue = value / maxValue;
                color = getThemeColor(this.theme, colorValue);
            }

            this.drawBar(
                x + 2,
                y,
                barWidth - 4,
                barHeight,
                color,
                step.comparing.includes(i) || step.swapping.includes(i)
            );
        });

        this.operations = this.currentStepIndex;
    }
}

class QuickSortVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'quick-sort');
        this.partitions = [];
    }

    generateData(size = 50) {
        this.data = generateRandomArray(size, 10, 90);
        this.calculateSteps();
    }

    calculateSteps() {
        const arr = [...this.data];
        this.steps = [{
            array: [...arr],
            pivot: -1,
            comparing: [],
            partitions: [],
            sorted: []
        }];

        const sorted = [];

        const quickSort = (arr, low, high, depth = 0) => {
            if (low < high) {
                const pi = partition(arr, low, high, depth);
                quickSort(arr, low, pi - 1, depth + 1);
                quickSort(arr, pi + 1, high, depth + 1);
            } else if (low === high) {
                sorted.push(low);
                this.steps.push({
                    array: [...arr],
                    pivot: -1,
                    comparing: [],
                    partitions: [],
                    sorted: [...sorted]
                });
            }
        };

        const partition = (arr, low, high, depth) => {
            const pivot = arr[high];
            let i = low - 1;

            this.steps.push({
                array: [...arr],
                pivot: high,
                comparing: [],
                partitions: [[low, high]],
                sorted: [...sorted]
            });

            for (let j = low; j < high; j++) {
                this.steps.push({
                    array: [...arr],
                    pivot: high,
                    comparing: [j],
                    partitions: [[low, high]],
                    sorted: [...sorted]
                });

                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];

                    this.steps.push({
                        array: [...arr],
                        pivot: high,
                        comparing: [i, j],
                        partitions: [[low, high]],
                        sorted: [...sorted]
                    });
                }
            }

            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            sorted.push(i + 1);

            this.steps.push({
                array: [...arr],
                pivot: i + 1,
                comparing: [],
                partitions: [[low, high]],
                sorted: [...sorted]
            });

            return i + 1;
        };

        quickSort(arr, 0, arr.length - 1);

        this.steps.push({
            array: [...arr],
            pivot: -1,
            comparing: [],
            partitions: [],
            sorted: Array.from({ length: arr.length }, (_, i) => i)
        });

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];
        const barWidth = this.width / step.array.length;
        const maxValue = Math.max(...this.data);

        step.array.forEach((value, i) => {
            const barHeight = (value / maxValue) * this.height * 0.8;
            const x = i * barWidth;
            const y = this.height - barHeight;

            let color;
            if (step.sorted.includes(i)) {
                color = getThemeColorByIndex(this.theme, 0);
            } else if (i === step.pivot) {
                color = getThemeColorByIndex(this.theme, 6); // Pivot
            } else if (step.comparing.includes(i)) {
                color = getThemeColorByIndex(this.theme, 3);
            } else {
                const colorValue = value / maxValue;
                color = getThemeColor(this.theme, colorValue);
            }

            this.drawBar(
                x + 2,
                y,
                barWidth - 4,
                barHeight,
                color,
                i === step.pivot || step.comparing.includes(i)
            );
        });

        this.operations = this.currentStepIndex;
    }
}

class MergeSortVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'merge-sort');
    }

    generateData(size = 50) {
        this.data = generateRandomArray(size, 10, 90);
        this.calculateSteps();
    }

    calculateSteps() {
        const arr = [...this.data];
        this.steps = [{
            array: [...arr],
            merging: [],
            sorted: []
        }];

        const sorted = new Set();

        const mergeSort = (arr, left, right, original) => {
            if (left >= right) {
                sorted.add(left);
                return;
            }

            const mid = Math.floor((left + right) / 2);
            mergeSort(arr, left, mid, original);
            mergeSort(arr, mid + 1, right, original);
            merge(arr, left, mid, right, original);
        };

        const merge = (arr, left, mid, right, original) => {
            const leftArr = arr.slice(left, mid + 1);
            const rightArr = arr.slice(mid + 1, right + 1);

            let i = 0, j = 0, k = left;

            while (i < leftArr.length && j < rightArr.length) {
                this.steps.push({
                    array: [...original],
                    merging: [left + i, mid + 1 + j],
                    sorted: Array.from(sorted)
                });

                if (leftArr[i] <= rightArr[j]) {
                    original[k] = leftArr[i];
                    i++;
                } else {
                    original[k] = rightArr[j];
                    j++;
                }
                k++;

                this.steps.push({
                    array: [...original],
                    merging: [k - 1],
                    sorted: Array.from(sorted)
                });
            }

            while (i < leftArr.length) {
                original[k] = leftArr[i];
                i++;
                k++;
                this.steps.push({
                    array: [...original],
                    merging: [k - 1],
                    sorted: Array.from(sorted)
                });
            }

            while (j < rightArr.length) {
                original[k] = rightArr[j];
                j++;
                k++;
                this.steps.push({
                    array: [...original],
                    merging: [k - 1],
                    sorted: Array.from(sorted)
                });
            }

            for (let idx = left; idx <= right; idx++) {
                sorted.add(idx);
            }
        };

        mergeSort(arr, 0, arr.length - 1, arr);

        this.steps.push({
            array: [...arr],
            merging: [],
            sorted: Array.from({ length: arr.length }, (_, i) => i)
        });

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];
        const barWidth = this.width / step.array.length;
        const maxValue = Math.max(...this.data);

        step.array.forEach((value, i) => {
            const barHeight = (value / maxValue) * this.height * 0.8;
            const x = i * barWidth;
            const y = this.height - barHeight;

            let color;
            if (step.sorted.includes(i)) {
                color = getThemeColorByIndex(this.theme, 0);
            } else if (step.merging.includes(i)) {
                color = getThemeColorByIndex(this.theme, 4);
            } else {
                const colorValue = value / maxValue;
                color = getThemeColor(this.theme, colorValue);
            }

            this.drawBar(
                x + 2,
                y,
                barWidth - 4,
                barHeight,
                color,
                step.merging.includes(i)
            );
        });

        this.operations = this.currentStepIndex;
    }
}

class InsertionSortVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'insertion-sort');
    }

    generateData(size = 50) {
        this.data = generateRandomArray(size, 10, 90);
        this.calculateSteps();
    }

    calculateSteps() {
        const arr = [...this.data];
        this.steps = [{
            array: [...arr],
            current: -1,
            comparing: [],
            sorted: [0]
        }];

        for (let i = 1; i < arr.length; i++) {
            const key = arr[i];
            let j = i - 1;

            this.steps.push({
                array: [...arr],
                current: i,
                comparing: [],
                sorted: Array.from({ length: i }, (_, idx) => idx)
            });

            while (j >= 0 && arr[j] > key) {
                this.steps.push({
                    array: [...arr],
                    current: i,
                    comparing: [j, j + 1],
                    sorted: Array.from({ length: i }, (_, idx) => idx)
                });

                arr[j + 1] = arr[j];
                j--;

                this.steps.push({
                    array: [...arr],
                    current: i,
                    comparing: [j + 1],
                    sorted: Array.from({ length: i }, (_, idx) => idx)
                });
            }

            arr[j + 1] = key;

            this.steps.push({
                array: [...arr],
                current: -1,
                comparing: [],
                sorted: Array.from({ length: i + 1 }, (_, idx) => idx)
            });
        }

        this.steps.push({
            array: [...arr],
            current: -1,
            comparing: [],
            sorted: Array.from({ length: arr.length }, (_, i) => i)
        });

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];
        const barWidth = this.width / step.array.length;
        const maxValue = Math.max(...this.data);

        step.array.forEach((value, i) => {
            const barHeight = (value / maxValue) * this.height * 0.8;
            const x = i * barWidth;
            const y = this.height - barHeight;

            let color;
            if (step.sorted.includes(i)) {
                color = getThemeColorByIndex(this.theme, 0);
            } else if (i === step.current) {
                color = getThemeColorByIndex(this.theme, 5);
            } else if (step.comparing.includes(i)) {
                color = getThemeColorByIndex(this.theme, 3);
            } else {
                const colorValue = value / maxValue;
                color = getThemeColor(this.theme, colorValue);
            }

            this.drawBar(
                x + 2,
                y,
                barWidth - 4,
                barHeight,
                color,
                i === step.current || step.comparing.includes(i)
            );
        });

        this.operations = this.currentStepIndex;
    }
}

class RadixSortVisualizer extends AlgorithmVisualizer {
    constructor(canvasId) {
        super(canvasId, 'radix-sort');
    }

    generateData(size = 50) {
        this.data = generateRandomArray(size, 1, 999);
        this.calculateSteps();
    }

    calculateSteps() {
        const arr = [...this.data];
        const max = Math.max(...arr);
        const maxDigits = Math.floor(Math.log10(max)) + 1;

        this.steps = [{
            array: [...arr],
            digit: -1,
            buckets: [],
            highlighted: []
        }];

        for (let d = 0; d < maxDigits; d++) {
            const buckets = Array.from({ length: 10 }, () => []);

            // Place numbers in buckets
            arr.forEach((num, idx) => {
                const digit = Math.floor(num / Math.pow(10, d)) % 10;
                buckets[digit].push({ value: num, originalIndex: idx });

                this.steps.push({
                    array: [...arr],
                    digit: d,
                    buckets: buckets.map(b => [...b]),
                    highlighted: [idx]
                });
            });

            // Collect from buckets
            let index = 0;
            for (let i = 0; i < 10; i++) {
                for (const item of buckets[i]) {
                    arr[index] = item.value;
                    index++;

                    this.steps.push({
                        array: [...arr],
                        digit: d,
                        buckets: buckets.map(b => [...b]),
                        highlighted: [index - 1]
                    });
                }
            }
        }

        this.steps.push({
            array: [...arr],
            digit: -1,
            buckets: [],
            highlighted: []
        });

        this.totalSteps = this.steps.length;
    }

    render() {
        this.clear();

        const step = this.steps[this.currentStepIndex] || this.steps[0];
        const barWidth = this.width / step.array.length;
        const maxValue = Math.max(...this.data);

        // Draw bars
        step.array.forEach((value, i) => {
            const barHeight = (value / maxValue) * this.height * 0.7;
            const x = i * barWidth;
            const y = this.height * 0.8 - barHeight;

            let color;
            if (step.digit === -1) {
                color = getThemeColorByIndex(this.theme, 0);
            } else if (step.highlighted.includes(i)) {
                const digit = Math.floor(value / Math.pow(10, step.digit)) % 10;
                color = getThemeColorByIndex(this.theme, digit % 7);
            } else {
                const colorValue = value / maxValue;
                color = getThemeColor(this.theme, colorValue);
            }

            this.drawBar(
                x + 2,
                y,
                barWidth - 4,
                barHeight,
                color,
                step.highlighted.includes(i)
            );
        });

        // Draw digit indicator
        if (step.digit >= 0) {
            this.drawText(
                `Sorting by digit ${step.digit + 1}`,
                this.width / 2,
                30,
                getThemeColorByIndex(this.theme, 0),
                20
            );
        }

        this.operations = this.currentStepIndex;
    }
}
