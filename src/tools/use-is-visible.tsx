import {useEffect, useRef, useState} from "react";

/**
 * updated 2021/Sep/13
 */

const useIsVisible = <Element extends HTMLElement>(initValue: boolean) => {
  const [isVisible, setIsVisible] = useState(initValue);
  const isVisibleElRef = useRef<Element>(null);

  useEffect(() => {
    const checkIsVisible = () => {
      if (!isVisibleElRef.current) return;
      const rect = isVisibleElRef.current.getBoundingClientRect();
      const center = (rect.top + rect.bottom) / 2;
      // when NOT visible ?
      // 1. bottom of the rect is above the top of viewport
      // 2. center of the rect is below the trigger point of viewport height
      const notVisible = rect.bottom < 0 || center > 0.9 * window.innerHeight;
      setIsVisible(!notVisible);
    }
    checkIsVisible();
    document.addEventListener('scroll', checkIsVisible);
    return () => {
      document.removeEventListener('scroll', checkIsVisible)
    }
  }, []);

  return {
    isVisibleElRef,
    isVisible
  }
}

export default useIsVisible
