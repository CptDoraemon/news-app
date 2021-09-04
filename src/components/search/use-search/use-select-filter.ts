import {useCallback, useState} from "react";

interface Option {
	key: string,
	displayName: string
}

const useSelectFilter = (initValue: string, options: Option[]) => {
	const [value, setValue] = useState(initValue);

	const handleChange = useCallback((selected: string) => {
		setValue(selected)
	}, []);

	return {
		value,
		_setValue: setValue,
		handleChange,
		options
	}
}

export default useSelectFilter
