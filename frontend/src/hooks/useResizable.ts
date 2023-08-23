import { useEffect, useRef, useState } from "react";

function useResizable() {
  const [isResizing, setIsResizing] = useState(false);
  const [initialXPosition, setInitialXPosition] = useState<number | null>(null);
  const [initialWidth, setInitialWidth] = useState<number | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const [newWidth, setNewWidth] = useState<number>(0);

  useEffect(() => {
    const sensitivityMultiplier = 2.0;

    const handleMouseMove = (e: MouseEvent) => {
      if (
        isResizing &&
        dividerRef.current &&
        dividerRef.current.previousElementSibling &&
        initialWidth !== null &&
        initialXPosition !== null
      ) {
        document.body.style.userSelect = "none";
        const offsetX = (e.clientX - initialXPosition) * sensitivityMultiplier;
        const currentWidth = initialWidth + offsetX;

        if (currentWidth > 100) {
          (
            dividerRef.current.previousElementSibling as HTMLElement
          ).style.width = `${currentWidth}px`;
          setNewWidth(currentWidth);
        }
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.style.userSelect = "auto";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, initialWidth, initialXPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setInitialXPosition(initialXPosition || e.clientX);

    if (dividerRef.current && dividerRef.current.previousElementSibling) {
      const currentWidth = (
        dividerRef.current.previousElementSibling as HTMLElement
      ).getBoundingClientRect().width;
      setInitialWidth(currentWidth);
    }
  };

  return { isResizing, setIsResizing, dividerRef, handleMouseDown, newWidth };
}

export default useResizable;
