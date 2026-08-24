import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/Appstore";

// Traffic lights component
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-4 shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
        onClick={() => toggleMaximize(windowId)}
        title={maximized ? "Restore" : "Maximize"}
      >
        <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          {maximized ? (
            <>
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default function Calculator({ windowId }) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const val = parseFloat(display);
    if (val !== 0) {
      setDisplay(String(-val));
    }
  };

  const inputPercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      let newValue = currentValue;

      switch (operator) {
        case "+":
          newValue = currentValue + inputValue;
          break;
        case "−":
          newValue = currentValue - inputValue;
          break;
        case "×":
          newValue = currentValue * inputValue;
          break;
        case "÷":
          newValue = inputValue !== 0 ? currentValue / inputValue : "Error";
          break;
        default:
          break;
      }

      setPreviousValue(newValue === "Error" ? null : newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(parseInt(e.key, 10));
      } else if (e.key === ".") {
        inputDecimal();
      } else if (e.key === "=" || e.key === "Enter") {
        e.preventDefault();
        performOperation("=");
      } else if (e.key === "+") {
        performOperation("+");
      } else if (e.key === "-") {
        performOperation("−");
      } else if (e.key === "*") {
        performOperation("×");
      } else if (e.key === "/") {
        e.preventDefault();
        performOperation("÷");
      } else if (e.key === "%") {
        inputPercent();
      } else if (e.key === "Backspace") {
        setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      } else if (e.key === "Escape") {
        clearAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Calculate dynamic font size based on length
  const getFontSize = () => {
    const len = display.length;
    if (len > 12) return "text-2xl";
    if (len > 8) return "text-3xl";
    return "text-5xl";
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]/90 text-white backdrop-blur-3xl select-none overflow-hidden">
      {/* Title bar */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-white/5 window-drag-handle">
        <TrafficLights windowId={windowId} />
        <span className="text-xs font-semibold text-white/50">Calculator</span>
        <div className="w-10"></div>
      </div>

      {/* Screen */}
      <div className="px-5 py-4 flex items-end justify-end flex-1 min-h-[80px]">
        <span className={`${getFontSize()} font-light tracking-tight text-white transition-all`}>
          {display}
        </span>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-1.5 p-3 bg-black/30">
        <button
          onClick={clearAll}
          className="h-12 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-sm font-medium transition-colors"
        >
          {display !== "0" || previousValue !== null ? "C" : "AC"}
        </button>
        <button
          onClick={toggleSign}
          className="h-12 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-sm font-medium transition-colors"
        >
          ±
        </button>
        <button
          onClick={inputPercent}
          className="h-12 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-sm font-medium transition-colors"
        >
          %
        </button>
        <button
          onClick={() => performOperation("÷")}
          className={`h-12 rounded-full text-lg font-medium transition-colors ${
            operator === "÷" && waitingForOperand ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb038] text-white"
          }`}
        >
          ÷
        </button>

        <button
          onClick={() => inputDigit(7)}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal transition-colors"
        >
          7
        </button>
        <button
          onClick={() => inputDigit(8)}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal transition-colors"
        >
          8
        </button>
        <button
          onClick={() => inputDigit(9)}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal transition-colors"
        >
          9
        </button>
        <button
          onClick={() => performOperation("×")}
          className={`h-12 rounded-full text-lg font-medium transition-colors ${
            operator === "×" && waitingForOperand ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb038] text-white"
          }`}
        >
          ×
        </button>

        <button
          onClick={() => inputDigit(4)}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal transition-colors"
        >
          4
        </button>
        <button
          onClick={() => inputDigit(5)}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal transition-colors"
        >
          5
        </button>
        <button
          onClick={() => inputDigit(6)}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal transition-colors"
        >
          6
        </button>
        <button
          onClick={() => performOperation("−")}
          className={`h-12 rounded-full text-lg font-medium transition-colors ${
            operator === "−" && waitingForOperand ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb038] text-white"
          }`}
        >
          −
        </button>

        <button
          onClick={() => inputDigit(1)}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal transition-colors"
        >
          1
        </button>
        <button
          onClick={() => inputDigit(2)}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal transition-colors"
        >
          2
        </button>
        <button
          onClick={() => inputDigit(3)}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal transition-colors"
        >
          3
        </button>
        <button
          onClick={() => performOperation("+")}
          className={`h-12 rounded-full text-lg font-medium transition-colors ${
            operator === "+" && waitingForOperand ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb038] text-white"
          }`}
        >
          +
        </button>

        <button
          onClick={() => inputDigit(0)}
          className="h-12 col-span-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-normal text-left pl-6 transition-colors"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-lg font-medium transition-colors"
        >
          .
        </button>
        <button
          onClick={() => performOperation("=")}
          className="h-12 rounded-full bg-[#ff9f0a] hover:bg-[#ffb038] active:bg-[#e08900] text-lg font-medium transition-colors"
        >
          =
        </button>
      </div>
    </div>
  );
}

