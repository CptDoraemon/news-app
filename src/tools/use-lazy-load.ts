import React, {useEffect, useState} from "react";

// @param triggerPoint in range (0, 1)
export default function useLazyLoad(ref: React.RefObject<HTMLDivElement>, triggerPoint?: number) {
  const [isVisible, setIsVisible] = useState(false);
  let scrollHandlerLastCalledAt = Date.now() - 1000;

  function checkIsVisible() {
    const calledAt = Date.now();
    if (calledAt - scrollHandlerLastCalledAt < 20) {
      return
    } else {
      scrollHandlerLastCalledAt = calledAt
    }
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const isBefore = rect.top + rect.height < 0;
    const isAfter = triggerPoint ?
      rect.top > window.innerHeight * triggerPoint :
      rect.top > window.innerHeight;
    if (!isBefore && !isAfter) setIsVisible(true);
  }

  useEffect(() => {
    if (isVisible) return;
    checkIsVisible();
    document.addEventListener('scroll', checkIsVisible);
    return () => {
      document.removeEventListener('scroll', checkIsVisible);
    }
  }, [isVisible, ref]);

  return isVisible
}
