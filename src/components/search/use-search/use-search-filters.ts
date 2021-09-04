import {ChangeEvent, useState} from "react";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";

const useSearchFilters = () => {
	const [pendingFilters, setPendingFilters] = useState({
		'keyword': {
			key: 'keyword',
			value: '',
			onChange: (e: ChangeEvent<HTMLInputElement>) => e.currentTarget.value
		},
		'startDate': {
			key: 'startDate',
			value: new Date('2020-01-04T00:00:00'),
			onChange: (date: MaterialUiPickersDate) => date as Date
		},
		'endDate': {
			key: 'endDate',
			value: new Date(),
			onChange: (date: MaterialUiPickersDate) => date as Date
		},
	});

	// const getFilterChangeHandler = <TChangeHandler extends () => void>(key: keyof typeof pendingFilters) => {
	// 	const changeHandler: TChangeHandler = (...args) => {
	// 		const newValue = pendingFilters[key].onChange(args);
	// 		setPendingFilters(prev => {
	// 			const updated = cloneDeep(prev);
	// 			updated[key].value = newValue;
	// 			return updated
	// 		})
	// 	}
	//
	// 	return changeHandler
	// }
};

export default useSearchFilters
