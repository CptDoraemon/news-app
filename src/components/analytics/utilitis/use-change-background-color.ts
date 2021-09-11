import {useCallback, useEffect, useRef, useState} from "react";
import {useMount, usePrevious, useUnmount} from "react-use";

const useChangeBackgroundColor = (isPageReady: boolean) => {
  const bgColorChangeRef = useRef<HTMLDivElement>(null);
  const [bgBlack, setBgBlack] = useState(false);

  const changeBgColor = useCallback(() => {
    if (!bgColorChangeRef.current) return;
    const target = bgColorChangeRef.current.getBoundingClientRect().top - 200;
    setBgBlack(target > 0);
  }, []);

  const previousBgBlack = usePrevious(bgBlack);
  useEffect(() => {
    if (previousBgBlack !== bgBlack && previousBgBlack !== undefined) {
      document.body.style.backgroundColor = bgBlack ? 'black' : ''
    }
  }, [bgBlack, previousBgBlack]);

  const prevIsPageReady = usePrevious(isPageReady);
  useEffect(() => {
    console.log(prevIsPageReady, isPageReady);
    if (prevIsPageReady !== isPageReady && prevIsPageReady !== undefined && isPageReady) {
      changeBgColor();
    }
  }, [bgBlack, changeBgColor, isPageReady, prevIsPageReady, previousBgBlack]);

  useMount(() => {
    document.addEventListener('scroll', changeBgColor);
    return () => {
      document.removeEventListener('scroll', changeBgColor);
    }
  })

  useUnmount(() => {
    document.body.style.backgroundColor = ''
  })

  return {
    bgColorChangeRef,
    bgBlack
  }
}

export default useChangeBackgroundColor
