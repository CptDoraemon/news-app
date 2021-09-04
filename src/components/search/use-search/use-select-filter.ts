import {ChangeEvent, useCallback, useState} from "react";

interface Option {
	key: string,
	displayName: string
}

const useSelectFilter = (initValue: string, options: Option[]) => {
	const [value, setValue] = useState(initValue);

	const handleChange = useCallback((e: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
		setValue(e.target.value as string)
	}, []);

	return {
		value,
		_setValue: setValue,
		handleChange,
		options
	}
}

export default useSelectFilter
