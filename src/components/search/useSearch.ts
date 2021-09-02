import {ChangeEvent, useCallback, useState} from "react";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";

const useSearch = () => {
	const [keyword, setKeyword] = useState('');
	const [startDate, setStartDate] = useState<MaterialUiPickersDate>(new Date('2014-08-18T21:11:54'));
	const [endDate, setEndDate] = useState<MaterialUiPickersDate>(new Date('2018-08-18T21:11:54'));

	const handleKeywordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.currentTarget.value);
	}, []);

	const handleStartDateChange = useCallback((date: MaterialUiPickersDate) => {
		setStartDate(date);
	}, []);

	const handleEndDateChange = useCallback((date: MaterialUiPickersDate) => {
		setEndDate(date);
	}, []);

	return {
		keyword,
		handleKeywordChange,
		startDate,
		endDate,
		handleStartDateChange,
		handleEndDateChange
	}
}

export default useSearch
