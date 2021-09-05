import {ChangeEvent, useCallback, useState} from "react";

const useInputFilter = (initValue = '') => {
  const [value, setValue] = useState(initValue);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }, []);

  return {
    value,
    _setValue: setValue,
    handleChange
  }
}

export default useInputFilter
