import React, { useState, useRef } from "react";
import GraphVisualization from "./GraphVisualization";

const Visualize = () => {
  const [activeTab, setActiveTab] = useState("sorting");
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(20);
  const [sortingSpeed, setSortingSpeed] = useState(50);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");
  const [isSorting, setIsSorting] = useState(false);
  const stopSortingRef = useRef(false);

  const getDelay = () => {
    const MAX_SPEED = 200;
    const MIN_DELAY = 10;
    const MAX_DELAY = 200;
    return (
      MAX_DELAY -
      ((sortingSpeed - MIN_DELAY) * (MAX_DELAY - MIN_DELAY)) /
        (MAX_SPEED - MIN_DELAY)
    );
  };

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 100) + 5
    );
    setArray(newArray);
  };

  const resetArray = () => {
    generateRandomArray();
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, getDelay()));
  };

  const bubbleSort = async () => {
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (stopSortingRef.current) return;
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(sortingSpeed);
        }
      }
    }
  };

  const selectionSort = async () => {
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (stopSortingRef.current) return;
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      setArray([...arr]);
      await sleep(sortingSpeed);
    }
  };

  const insertionSort = async () => {
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        if (stopSortingRef.current) return;
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await sleep(sortingSpeed);
    }
  };

  const mergeSort = async () => {
    const merge = async (arr, l, m, r) => {
      let n1 = m - l + 1;
      let n2 = r - m;
      let L = new Array(n1);
      let R = new Array(n2);

      for (let i = 0; i < n1; i++) L[i] = arr[l + i];
      for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

      let i = 0,
        j = 0,
        k = l;
      while (i < n1 && j < n2) {
        if (stopSortingRef.current) return;
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        k++;
        setArray([...arr]);
        await sleep(sortingSpeed);
      }

      while (i < n1) {
        if (stopSortingRef.current) return;
        arr[k] = L[i];
        i++;
        k++;
        setArray([...arr]);
        await sleep(sortingSpeed);
      }

      while (j < n2) {
        if (stopSortingRef.current) return;
        arr[k] = R[j];
        j++;
        k++;
        setArray([...arr]);
        await sleep(sortingSpeed);
      }
    };

    const sort = async (arr, l, r) => {
      if (l >= r) return;
      let m = l + Math.floor((r - l) / 2);
      await sort(arr, l, m);
      await sort(arr, m + 1, r);
      await merge(arr, l, m, r);
    };

    let arr = [...array];
    await sort(arr, 0, arr.length - 1);
  };

  const quickSort = async () => {
    const partition = async (arr, low, high) => {
      let pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (stopSortingRef.current) return;
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await sleep(sortingSpeed);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await sleep(sortingSpeed);
      return i + 1;
    };

    const sort = async (arr, low, high) => {
      if (low < high) {
        let pi = await partition(arr, low, high);
        await sort(arr, low, pi - 1);
        await sort(arr, pi + 1, high);
      }
    };

    let arr = [...array];
    await sort(arr, 0, arr.length - 1);
  };

  const startSorting = async () => {
    if (isSorting) {
      stopSortingRef.current = true;
      setIsSorting(false);
      return;
    }

    stopSortingRef.current = false;
    setIsSorting(true);

    switch (selectedAlgorithm) {
      case "bubble":
        await bubbleSort();
        break;
      case "selection":
        await selectionSort();
        break;
      case "insertion":
        await insertionSort();
        break;
      case "merge":
        await mergeSort();
        break;
      case "quick":
        await quickSort();
        break;
      default:
        break;
    }

    setIsSorting(false);
  };

  React.useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-38 pt-20 pb-0">
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === "sorting"
              ? "bg-blue-500 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setActiveTab("sorting")}
        >
          Sorting
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === "graph"
              ? "bg-blue-500 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setActiveTab("graph")}
        >
          Graph
        </button>
      </div>

      {activeTab === "sorting" && (
        <>
          <div className="flex space-x-4 max-h-12 mb-8 items-center">
            <select
              className="px-2 py-2 cursor-pointer bg-blue-500 text-white rounded mr-4 max-w-40"
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
            >
              <option className="bg-slate-900" value="bubble">
                Bubble Sort
              </option>
              <option className="bg-slate-900" value="selection">
                Selection Sort
              </option>
              <option className="bg-slate-900" value="insertion">
                Insertion Sort
              </option>
              <option className="bg-slate-900" value="merge">
                Merge Sort
              </option>
              <option className="bg-slate-900" value="quick">
                Quick Sort
              </option>
            </select>

            <button
              className="px-4 py-2 bg-green-600 rounded cursor-pointer"
              onClick={startSorting}
            >
              {isSorting ? "Stop Sorting" : "Start Sorting"}
            </button>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded mr-4 cursor-pointer"
              onClick={resetArray}
            >
              Reset Array
            </button>

            <div className="bg-slate-800 p-2 py-1 rounded-lg flex flex-col items-center">
              <span className="text-slate-300 text-sm mb-1">
                Array Size: {arraySize}
              </span>

              <input
                type="range"
                min="5"
                max="100"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="cursor-pointer"
              />
            </div>

            <div className="bg-slate-800 p-2 py-1 rounded-lg flex flex-col items-center">
              <span className="text-sm text-slate-300 mb-1">
                Speed: {Math.round((sortingSpeed / 200) * 100)}%
              </span>
              <input
                type="range"
                min="10"
                max="200"
                value={sortingSpeed}
                onChange={(e) => setSortingSpeed(Number(e.target.value))}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-end justify-center h-96 mt-20">
            {array.map((value, idx) => (
              <div
                key={idx}
                className="bg-blue-500 mx-1"
                style={{ height: `${value}%`, width: `${100 / arraySize}%` }}
              />
            ))}
          </div>
        </>
      )}

      {activeTab=="graph"&&(
        <GraphVisualization/>
      )}
    </div>
  );
};

export default Visualize;