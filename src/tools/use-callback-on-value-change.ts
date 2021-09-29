import {usePrevious} from "react-use";
import {useEffect} from "react";

// usePrevious first return undefined
// callback will be executed when value change (mount won't trigger)

const useCallbackOnValueChange = (value: any, callback: () => void) => {
  const previousValue = usePrevious(value);
  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      callback()
    }
  });
}

export default useCallbackOnValueChange
