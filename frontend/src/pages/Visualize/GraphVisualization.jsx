import React, { useState, useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";

const GraphVisualization = () => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [algorithm, setAlgorithm] = useState("dfs");
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [error, setError] = useState("");
  const networkRef = useRef(null);
  const containerRef = useRef(null);
  const pauseRef = useRef(false);
  const algorithmRunningRef = useRef(false); 

  const options = {
    nodes: {
      color: {
        background: "#4299E1",
        border: "#2B6CB0",
      },
      font: { color: "white" },
    },
    edges: {
      color: "#718096",
      font: { color: "white" },
      width: 2,
    },
    physics: {
      enabled: true,
      solver: "forceAtlas2Based",
    },
    interaction: {
      zoomView: false,
      mouseWheel: false,
    },
  };

  useEffect(() => {
    generateRandomGraph();
    return () => {
      algorithmRunningRef.current = false;
      pauseRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      networkRef.current = new Network(containerRef.current, graph, options);
    }
  }, [graph]);

  const sleep = async (baseMs) => {
    const delay = 1000 - (speed / 100) * 950 + 50;
    let start = Date.now();
    while (Date.now() - start < delay && algorithmRunningRef.current) {
      if (pauseRef.current) {
        await new Promise((resolve) => {
          const checkPause = () => {
            if (!pauseRef.current && algorithmRunningRef.current) {
              resolve();
            } else if (!algorithmRunningRef.current) {
              resolve();
            } else {
              setTimeout(checkPause, 100);
            }
          };
          checkPause();
        });
        start = Date.now();
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  };

  const generateRandomGraph = () => {
    algorithmRunningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    pauseRef.current = false;
    setError("");
    setSource(null);
    setDestination(null);

    const nodeCount = 8;
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      label: `${i}`,
    }));

    const edges = [];
    for (let i = 0; i < nodeCount; i++) {
      const connectionCount = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < connectionCount; j++) {
        const target = Math.floor(Math.random() * nodeCount);
        if (
          target !== i &&
          !edges.some(
            (e) =>
              (e.from === i && e.to === target) ||
              (e.from === target && e.to === i)
          )
        ) {
          edges.push({
            from: i,
            to: target,
            label: `${Math.floor(Math.random() * 9) + 1}`,
          });
        }
      }
    }
    setGraph({ nodes, edges });
  };

  const validateNodeInput = (value, type) => {
    const nodeIds = graph.nodes.map((node) => node.id);
    if (value === "" || value === null) {
      setError(`Please enter a ${type} node`);
      return false;
    }
    if (!nodeIds.includes(value)) {
      setError(`${type} node ${value} does not exist in the graph`);
      return false;
    }
    setError("");
    return true;
  };

  const handleSourceChange = (value) => {
    const parsedValue = value === "" ? null : parseInt(value);
    setSource(parsedValue);
    if (parsedValue !== null) {
      validateNodeInput(parsedValue, "source");
    }
  };

  const handleDestinationChange = (value) => {
    const parsedValue = value === "" ? null : parseInt(value);
    setDestination(parsedValue);
    if (parsedValue !== null) {
      validateNodeInput(parsedValue, "destination");
    }
  };

  const highlightNode = async (nodeId, color) => {
    const nodes = networkRef.current.body.data.nodes;
    nodes.update({ id: nodeId, color: { background: color } });
    await sleep(500);
  };

  const highlightEdge = async (from, to, color) => {
    const edges = networkRef.current.body.data.edges;
    const edge = edges
      .get()
      .find(
        (e) =>
          (e.from === from && e.to === to) || (e.from === to && e.to === from)
      );
    if (edge) {
      edges.update({
        id: edge.id,
        color: { color: color },
        width: 6,
      });
    }
    await sleep(500);
  };

  const resetColors = () => {
    const nodes = networkRef.current.body.data.nodes;
    const edges = networkRef.current.body.data.edges;
    nodes.forEach((node) => {
      nodes.update({ id: node.id, color: { background: "#4299E1" } });
    });
    edges.forEach((edge) => {
      edges.update({
        id: edge.id,
        color: { color: "#718096" },
        width: 2,
      });
    });
  };
  const startVisualization = () => {
    if (!validateNodeInput(source, "source")) return;
    if (
      algorithm === "dijkstra" &&
      !validateNodeInput(destination, "destination")
    )
      return;

    setIsRunning(true);
    setIsPaused(false);
    pauseRef.current = false;
    algorithmRunningRef.current = true; 

    if (algorithm === "dfs") dfsTraversal(source);
    else if (algorithm === "bfs") bfsTraversal(source);
    else if (algorithm === "dijkstra") dijkstraTraversal(source, destination);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    pauseRef.current = !pauseRef.current;
  };

  const dfsTraversal = async (start) => {
    if (start === null) return;
    resetColors();
    const visited = new Set();

    const dfs = async (nodeId) => {
      if (!algorithmRunningRef.current || visited.has(nodeId)) return;
      visited.add(nodeId);
      await highlightNode(nodeId, "#48BB78");

      const edges = networkRef.current.body.data.edges.get();
      for (const edge of edges) {
        if (!algorithmRunningRef.current) return;
        if (edge.from === nodeId && !visited.has(edge.to)) {
          await highlightEdge(edge.from, edge.to, "#48BB78");
          await dfs(edge.to);
        } else if (edge.to === nodeId && !visited.has(edge.from)) {
          await highlightEdge(edge.from, edge.to, "#48BB78");
          await dfs(edge.from);
        }
      }
    };

    await dfs(start);
    algorithmRunningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    pauseRef.current = false;
  };

  const bfsTraversal = async (start) => {
    if (start === null) return;
    resetColors();
    const visited = new Set();
    const queue = [start];
    visited.add(start);

    while (queue.length > 0 && algorithmRunningRef.current) {
      const nodeId = queue.shift();
      await highlightNode(nodeId, "#48BB78");

      const edges = networkRef.current.body.data.edges.get();
      for (const edge of edges) {
        if (!algorithmRunningRef.current) break;
        let nextNode = null;
        if (edge.from === nodeId && !visited.has(edge.to)) {
          nextNode = edge.to;
        } else if (edge.to === nodeId && !visited.has(edge.from)) {
          nextNode = edge.from;
        }

        if (nextNode !== null) {
          visited.add(nextNode);
          queue.push(nextNode);
          await highlightEdge(edge.from, edge.to, "#48BB78");
        }
      }
    }

    algorithmRunningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    pauseRef.current = false;
  };

  const dijkstraTraversal = async (start, end) => {
    if (start === null || end === null) return;
    resetColors();

    const nodes = networkRef.current.body.data.nodes.get();
    const edges = networkRef.current.body.data.edges.get();

    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes.map((n) => n.id));

    nodes.forEach((node) => {
      distances[node.id] = Infinity;
    });
    distances[start] = 0;

    while (unvisited.size > 0 && algorithmRunningRef.current) {
      let current = null;
      let minDistance = Infinity;

      for (const nodeId of unvisited) {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          current = nodeId;
        }
      }

      if (current === null || distances[current] === Infinity) break;

      await highlightNode(current, "#9F7AEA");
      unvisited.delete(current);

      for (const edge of edges) {
        if (!algorithmRunningRef.current) break;
        let neighbor = null;
        if (edge.from === current && unvisited.has(edge.to)) {
          neighbor = edge.to;
        } else if (edge.to === current && unvisited.has(edge.from)) {
          neighbor = edge.from;
        }

        if (neighbor !== null) {
          const weight = parseInt(edge.label);
          const distance = distances[current] + weight;

          if (distance < distances[neighbor]) {
            distances[neighbor] = distance;
            previous[neighbor] = current;
          }
        }
      }
    }

    if (distances[end] !== Infinity && algorithmRunningRef.current) {
      let current = end;
      while (current !== start && algorithmRunningRef.current) {
        await highlightNode(current, "#48BB78");
        await highlightEdge(current, previous[current], "#48BB78");
        current = previous[current];
      }
      if (algorithmRunningRef.current) {
        await highlightNode(start, "#48BB78");
      }
    }

    algorithmRunningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    pauseRef.current = false;
  };


  return (
    <div className="min-h-screen bg-slate-900 text-white p-10 pt-0 px-0">
      <div className="space-y-4">
        <div className="space-x-4 flex max-h-12">
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
            onClick={generateRandomGraph}
          >
            New Graph
          </button>
          <select
            className="px-4 py-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isRunning}
          >
            <option className="bg-slate-900" value="dfs">
              DFS
            </option>
            <option className="bg-slate-900" value="bfs">
              BFS
            </option>
            <option className="bg-slate-900" value="dijkstra">
              Dijkstra's
            </option>
          </select>

          {(algorithm === "dfs" || algorithm === "bfs") && (
            <input
              type="number"
              placeholder="Source"
              className="bg-gray-800 text-white px-2 py-2 rounded max-w-30 cursor-pointer"
              onChange={(e) => handleSourceChange(e.target.value)}
              disabled={isRunning}
              value={source === null ? "" : source}
            />
          )}

          {algorithm === "dijkstra" && (
            <>
              <input
                type="number"
                placeholder="Source"
                className="bg-gray-800 text-white px-2 py-2 rounded max-w-30 "
                onChange={(e) => handleSourceChange(e.target.value)}
                disabled={isRunning}
                value={source === null ? "" : source}
              />
              <input
                type="number"
                placeholder="Destination"
                className="bg-gray-800 text-white px-2 py-2 rounded max-w-30"
                onChange={(e) => handleDestinationChange(e.target.value)}
                disabled={isRunning}
                value={destination === null ? "" : destination}
              />
            </>
          )}

          <div className="space-x-2 bg-slate-800 p-2 py-1 rounded-lg flex flex-col items-center">
            <span className="text-sm text-slate-300 mb-1">Speed:{speed}%</span>
            <input
              type="range"
              min="10"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="cursor-pointer"
            />
          </div>

          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded cursor-pointer"
            onClick={startVisualization}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Start"}
          </button>

          {isRunning && (
            <button
              className={`px-4 py-2 cursor-pointer ${
                isPaused
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-orange-600 hover:bg-orange-700"
              } rounded`}
              onClick={togglePause}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          )}
        </div>

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div
          ref={containerRef}
          className="h-120 border border-gray-700 rounded"
        />
      </div>
    </div>
  );
};

export default GraphVisualization;
