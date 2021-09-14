import React, {useEffect, useState} from "react";

// @param triggerPoint in range (0, 1)
export default function useLazyLoad(ref: React.RefObject<HTMLDivElement>, triggerPoint?: number) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;

    const checkIsVisible = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const isBefore = rect.top + rect.height < 0;
      const isAfter = triggerPoint ?
        rect.top > window.innerHeight * triggerPoint :
        rect.top > window.innerHeight;
      if (!isBefore && !isAfter) setIsVisible(true);
    }

    checkIsVisible();
    document.addEventListener('scroll', checkIsVisible);
    return () => {
      document.removeEventListener('scroll', checkIsVisible);
    }
  }, [isVisible, ref, triggerPoint]);

  return isVisible
}
