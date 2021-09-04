import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import useRequestState from "../../../tools/use-request-state";
import axios from "axios";
import {usePrevious} from "react-use";

export interface SearchedArticle {
	id: string,
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
	total: number,
	hasNext: boolean
}

const getDateParam = (date: Date) => `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;

const useSearch = () => {
	const [keyword, setKeyword] = useState('');
	const [startDate, setStartDate] = useState<MaterialUiPickersDate>(new Date('2020-01-04T00:00:00'));
	const [endDate, setEndDate] = useState<MaterialUiPickersDate>(new Date());
	const [searchingParams, setSearchingParams] = useState<null | {
		keyword: string,
		startDate: MaterialUiPickersDate,
		endDate: MaterialUiPickersDate
	}>(null);
	const requestState = useRequestState<SearchResponse>();
	const pageRef = useRef(1);

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
		e.preventDefault();
		if (startDate === null || endDate === null || !keyword) {
			return
		}
		setSearchingParams({
			keyword,
			startDate,
			endDate
		})
	}, [endDate, keyword, startDate]);

	const doSearch = useCallback(async () => {
		try {
			if (requestState.isLoading || searchingParams === null) {
				return
			}

			requestState.resetError();
			requestState.setIsLoading(true);
			const res = await axios.get('http://192.168.0.156:5000/api/search-news', {
				params: {
					keyword: searchingParams.keyword,
					startDate: getDateParam(searchingParams.startDate as Date),
					endDate: getDateParam(searchingParams.endDate as Date),
					page: pageRef.current
				}
			});
			const data = res.data;
			if (data.status === 'ok') {
				requestState.setData(prev => {
					const newDocs = prev === null ? data.docs : [...prev.docs, ...data.docs];
					return {
						docs: newDocs,
						total: data.total,
						hasNext: data.hasNext
					}
				});
			} else {
				requestState.setErrorMessage(res.data.message)
			}
			pageRef.current = pageRef.current + 1;
		} catch (e) {
			requestState.setGenericErrorMessage()
		} finally {
			requestState.setIsLoading(false)
		}
	}, [requestState, searchingParams]);

	const previousSearchingParams = usePrevious(searchingParams);
	useEffect(() => {
		if (previousSearchingParams !== searchingParams && searchingParams !== null) {
			pageRef.current = 1;
			requestState.setData(null)
			doSearch()
		}
	}, [doSearch, previousSearchingParams, requestState, searchingParams])

	return {
		keyword,
		handleKeywordChange,
		startDate,
		endDate,
		handleStartDateChange,
		handleEndDateChange,
		submitSearch,
		requestState,
		doSearch,
		searchingParams
	}
}

export default useSearch
