import {ChangeEvent, useCallback, useState} from "react";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import useRequestState from "../../tools/use-request-state";
import axios from "axios";

export interface SearchedArticle {
	author: string
	category: string,
	content: string,
	description: string,
	publishedAt: string
	source: string
	title: string,
	url: string,
	urlToImage: string
}

interface SearchResponse {
	docs: SearchedArticle[],
	total: number
}

const getDateParam = (date: Date) => `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;

const useSearch = () => {
	const [keyword, setKeyword] = useState('');
	const [startDate, setStartDate] = useState<MaterialUiPickersDate>(new Date('2020-01-04T00:00:00'));
	const [endDate, setEndDate] = useState<MaterialUiPickersDate>(new Date());
	const requestState = useRequestState<SearchResponse>();
	const [page, setPage] = useState(1);

	const handleKeywordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (e.currentTarget.value.length > 200) {
			return
		}
		setKeyword(e.currentTarget.value);
	}, []);

	const handleStartDateChange = useCallback((date: MaterialUiPickersDate) => {
		setStartDate(date);
	}, []);

	const handleEndDateChange = useCallback((date: MaterialUiPickersDate) => {
		setEndDate(date);
	}, []);

	const submitSearch = useCallback(async (e: ChangeEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			if (startDate === null || endDate === null || !keyword || requestState.isLoading) {
				return
			}

			requestState.resetError();
			requestState.setIsLoading(true);
			const res = await axios.get('http://localhost:5000/api/search-news', {
				params: {
					keyword,
					startDate: getDateParam(startDate),
					endDate: getDateParam(endDate),
					page
				}
			});
			if (res.data.status === 'ok') {
				requestState.setData(res.data)
			} else {
				requestState.setErrorMessage(res.data.message)
			}
			setPage(prev => prev + 1);
		} catch (e) {
			requestState.setGenericErrorMessage()
		} finally {
			requestState.setIsLoading(false)
		}
	}, [endDate, keyword, page, requestState, startDate])

	return {
		keyword,
		handleKeywordChange,
		startDate,
		endDate,
		handleStartDateChange,
		handleEndDateChange,
		submitSearch,
		requestState
	}
}

export default useSearch
