import React, { useState, useRef } from "react";

const Visualize = () => {
  const [activeTab, setActiveTab] = useState("sorting");
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(20);
  const [sortingSpeed, setSortingSpeed] = useState(50);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");
  const [isSorting, setIsSorting] = useState(false);
  const sortingRef = useRef(null);

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
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const bubbleSort = async () => {
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
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
        arr[k] = L[i];
        i++;
        k++;
        setArray([...arr]);
        await sleep(sortingSpeed);
      }

      while (j < n2) {
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
      setIsSorting(false);
      return;
    }
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
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "sorting"
              ? "bg-blue-500 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setActiveTab("sorting")}
        >
          Sorting
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "pathfinding"
              ? "bg-blue-500 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setActiveTab("pathfinding")}
        >
          Pathfinding
        </button>
      </div>

      {activeTab === "sorting" && (
        <>
          <div className="flex justify-around max-h-15 mb-8 pr-100">
            <select
              className="px-4 py-2 bg-blue-600 rounded mr-4"
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
            >
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
            </select>

            <button
              className="px-4 py-2 bg-green-600 rounded"
              onClick={startSorting}
            >
              {isSorting ? "Stop Sorting" : "Start Sorting"}
            </button>

            <button
              className="px-4 py-2 bg-blue-600 rounded mr-4"
              onClick={resetArray}
            >
              Reset Array
            </button>

            <div className="bg-slate-800 p-2 rounded-lg">
              <span className="block text-slate-300 mb-2">
                Array Size: {arraySize}
              </span>

              <input
                type="range"
                min="5"
                max="100"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="mr-4"
              />
            </div>

            <div className="bg-slate-800 p-2 rounded-lg">
              <span className="block text-slate-300 mb-2">
                Sorting Speed: {sortingSpeed}ms
              </span>
              <input
                type="range"
                min="10"
                max="200"
                value={sortingSpeed}
                onChange={(e) => setSortingSpeed(Number(e.target.value))}
                className="ml-4 mr-4"
              />
            </div>
          </div>

          <div className="flex items-end justify-center h-96">
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
    </div>
  );
};

export default Visualize;
