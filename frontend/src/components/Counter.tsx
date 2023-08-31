import React, { useState } from "react";

interface CounterProps {
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

function Counter({ initialCount = 0, onCountChange }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (onCountChange) {
      onCountChange(newCount);
    }
  };

  const handleDecrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    if (onCountChange) {
      onCountChange(newCount);
    }
  };

  return (
    <div className="inline-flex space-x-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
        onClick={handleDecrement}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
      </svg>

      {count}
      <svg
        onClick={handleIncrement}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    </div>
  );
}

export default Counter;
