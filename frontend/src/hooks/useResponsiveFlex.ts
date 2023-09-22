import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { getDivWidth } from "../pages/AddItem";
import { throttle } from "lodash";

type Breakpoint = {
  max: number;
  class: string;
};

function useResponsiveFlex(
  divRef: React.RefObject<HTMLDivElement | null>,
  breakpoints: Breakpoint[],
  initialDirection?: string
) {
  const [flexDirection, setFlexDirection] = useState(initialDirection);

  const lastFlexDirection = useRef(flexDirection);

  const handleResize = throttle(() => {
    const currentWidth = getDivWidth(divRef.current);

    for (let bp of breakpoints) {
      if (currentWidth <= bp.max) {
        if (lastFlexDirection.current !== bp.class) {
          setFlexDirection(bp.class);
          lastFlexDirection.current = bp.class;
        }
        break;
      }
    }
  }, 775);

  useEffect(() => {
    if (initialDirection !== flexDirection) {
      setFlexDirection(initialDirection);
      lastFlexDirection.current = initialDirection;
    }
  }, [initialDirection, flexDirection]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [divRef, breakpoints]);

  useLayoutEffect(() => {
    const currentWidth = getDivWidth(divRef.current);

    if (currentWidth > breakpoints[breakpoints.length - 1].max) {
      if (
        lastFlexDirection.current !== breakpoints[breakpoints.length - 1].class
      ) {
        setFlexDirection(breakpoints[breakpoints.length - 1].class);
        lastFlexDirection.current = breakpoints[breakpoints.length - 1].class;
      }
    }
  }, [divRef.current, breakpoints]);

  return flexDirection;
}

export default useResponsiveFlex;
