// App.jsx
import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [array, setArray] = useState(generateArray(30));
  const [size, setSize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState("Bubble Sort");
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(null);

  function generateArray(n = 30) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * 300) + 20);
  }

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const delay = () => 101 - speed;

  const handleGenerate = () => {
    if (isSorting) return;
    setArray(generateArray(size));
    setSortedIndices([]);
    setPivotIndex(null);
  };

  const handleStart = async () => {
    if (isSorting) return;
    setIsSorting(true);
    setSortedIndices([]);
    setPivotIndex(null);

    let arr = [...array];

    switch (algorithm) {
      case "Bubble Sort":
        await bubbleSort(arr);
        break;
      case "Selection Sort":
        await selectionSort(arr);
        break;
      case "Insertion Sort":
        await insertionSort(arr);
        break;
      case "Merge Sort":
        await mergeSort(arr, 0, arr.length - 1);
        break;
      case "Quick Sort":
        await quickSort(arr, 0, arr.length - 1);
        break;
      default:
        break;
    }

    setActiveIndices([]);
    setPivotIndex(null);
    setSortedIndices(arr.map((_, i) => i));
    setIsSorting(false);
  };

  const bubbleSort = async (arr) => {
    let sorted = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await sleep(delay());

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
      sorted.push(arr.length - i - 1);
      setSortedIndices([...sorted]);
    }
  };

  const selectionSort = async (arr) => {
    let sorted = [];
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        setActiveIndices([minIdx, j]);
        await sleep(delay());

        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray([...arr]);
      sorted.push(i);
      setSortedIndices([...sorted]);
    }
  };

  const insertionSort = async (arr) => {
    let sorted = [0];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        setActiveIndices([j, j + 1]);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        j--;
        await sleep(delay());
      }
      arr[j + 1] = key;
      setArray([...arr]);

      sorted.push(i);
      setSortedIndices([...sorted]);
    }
  };

  const merge = async (arr, l, m, r) => {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);

    let i = 0,
      j = 0,
      k = l;

    while (i < left.length && j < right.length) {
      setActiveIndices([k]);
      await sleep(delay());

      if (left[i] <= right[j]) arr[k++] = left[i++];
      else arr[k++] = right[j++];

      setArray([...arr]);
    }

    while (i < left.length) {
      arr[k++] = left[i++];
      setArray([...arr]);
      await sleep(delay());
    }

    while (j < right.length) {
      arr[k++] = right[j++];
      setArray([...arr]);
      await sleep(delay());
    }
  };

  const mergeSort = async (arr, l, r) => {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);

    if (l === 0 && r === arr.length - 1) {
      setSortedIndices(arr.map((_, i) => i));
    }
  };

  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    setPivotIndex(high);

    let i = low - 1;

    for (let j = low; j < high; j++) {
      setActiveIndices([j]);
      await sleep(delay());

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setSortedIndices((prev) => [...prev, i + 1]);
    return i + 1;
  };

  const quickSort = async (arr, low, high) => {
    if (low < high) {
      let pi = await partition(arr, low, high);
      setPivotIndex(null);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Algo Visualizer</h1>
      </header>

      <div className="controls">
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={isSorting}
        >
          <option>Bubble Sort</option>
          <option>Selection Sort</option>
          <option>Insertion Sort</option>
          <option>Merge Sort</option>
          <option>Quick Sort</option>
        </select>

        <button onClick={handleGenerate} disabled={isSorting}>
          Generate Array
        </button>

        <div className="slider">
          <label>Size</label>
          <input
            type="range"
            min="10"
            max="100"
            value={size}
            disabled={isSorting}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSize(val);
              setArray(generateArray(val));
            }}
          />
        </div>

        <div className="slider">
          <label>Speed</label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>

        <button className="start-btn" onClick={handleStart}>
          Start
        </button>
      </div>

      {/* Legend */}
      <div className="legend">
        <div><span className="box active"></span> Active / Comparing</div>
        <div><span className="box pivot"></span> Pivot (Quick Sort)</div>
        <div><span className="box sorted"></span> Sorted</div>
      </div>

      <div className="visualizer">
        {array.map((value, idx) => {
          let className = "bar";

          if (idx === pivotIndex) className += " pivot";
          else if (activeIndices.includes(idx)) className += " active";
          else if (sortedIndices.includes(idx)) className += " sorted";

          return (
            <div
              key={idx}
              className={className}
              style={{ height: `${value}px` }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}



