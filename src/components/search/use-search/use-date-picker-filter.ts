import {useCallback, useState} from "react";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";

const useDatePickerFilter = (initValue = new Date()) => {
  const [value, setValue] = useState<MaterialUiPickersDate>(initValue);

  const handleChange = useCallback((date: MaterialUiPickersDate) => {
    setValue(date);
  }, []);

  return {
    value,
    _setValue: setValue,
    handleChange
  }
}

export default useDatePickerFilter
