function useDebounce(debounceInterval: number) {
  let lastExecuted = Date.now();

  function shouldBeExecuted() {
    const now = Date.now();
    if (now - lastExecuted > debounceInterval) {
      lastExecuted = now;
      return true
    } else {
      return false
    }
  }

  return shouldBeExecuted;
}

export default useDebounce;
