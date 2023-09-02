import { Input } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import useUser from "../hooks/useUser";

interface CounterProps {
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

function Counter({ initialCount = 1, onCountChange }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  const handleIncrement = () => {
    let newCount = count + 1;
    if (newCount <= 0) {
      newCount = 0;
    }
    setCount(newCount);
    if (onCountChange) {
      onCountChange(newCount);
    }
  };

  const handleDecrement = () => {
    let newCount = count - 1;
    if (newCount <= 0) {
      newCount = 0;
    }
    setCount(newCount);
    if (onCountChange) {
      onCountChange(newCount);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setCount(newValue);
    if (onCountChange) {
      onCountChange(newValue);
    }
  };

  return (
    <div className="flex border px-0.5 justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 flex-none align-middle self-center"
        onClick={handleDecrement}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
      </svg>
      <Input
        className="w-[50px] max-w-[50px] !min-w-[50px] text-center"
        value={count}
        onChange={handleChange}
        placeholder="Enter a number"
        size="sm"
        borderBottom={"none"}
        borderTop={"none"}
      />
      <svg
        onClick={handleIncrement}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 flex-none align-middle self-center"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    </div>
  );
}

export default Counter;
