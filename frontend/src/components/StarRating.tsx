import React, { useEffect, useState } from "react";

interface StarRatingProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

function StarRating({ value, onChange }: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  let stars = [];

  for (let i = 0; i < 5; i++) {
    let isFilled = value !== null && i <= value;
    let isHovered = hoveredStar !== null && i <= hoveredStar;

    stars.push(
      <svg
        key={i}
        onClick={() => onChange(i)}
        onMouseOver={() => setHoveredStar(i)}
        onMouseOut={() => setHoveredStar(null)}
        xmlns="http://www.w3.org/2000/svg"
        fill={isFilled ? "yellow" : isHovered ? "yellow" : "none"}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        style={{ opacity: isHovered && !isFilled ? 0.5 : 1 }}
        className="w-6 h-6 cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    );
  }

  return <div className="flex">{stars}</div>;
}

export default StarRating;
