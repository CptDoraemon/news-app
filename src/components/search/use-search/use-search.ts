import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import useRequestState from "../../../tools/use-request-state";
import axios from "axios";
import {useMount, usePrevious} from "react-use";
import useInputFilter from "./use-input-filter";
import useDatePickerFilter from "./use-date-picker-filter";
import {useHistory, useLocation} from "react-router-dom";
import routers, {newsCategories} from "../../../routers";
import useSelectFilter from "./use-select-filter";
const queryString = require('query-string');

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

const categoryOptions = [
	{
		key: 'all',
		displayName: 'all'
	},
	...newsCategories.map(c => ({
		key: c,
		displayName: c
	}))
];

const sortByOptions = [
	{
		key: 'relevance',
		displayName: 'relevance'
	},
	{
		key: 'date',
		displayName: 'date'
	}
];

const sortOrderOptions = [
	{
		key: 'desc',
		displayName: 'descending'
	},
	{
		key: 'asc',
		displayName: 'ascending'
	}
]

const dateToYyyymmdd = (date: Date) => `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
const yyyymmddToDate = (yyyymmdd: string) => {
	const array = yyyymmdd.split('-');
	// @ts-ignore
	return new Date(Date.UTC(...array))
}

const useSearch = () => {
	const keyword = useInputFilter('');
	const startDate = useDatePickerFilter(new Date('2020-01-04T00:00:00'));
	const endDate = useDatePickerFilter();
	const category = useSelectFilter(categoryOptions[0].key, categoryOptions);
	const sortBy = useSelectFilter(sortByOptions[0].key, sortByOptions);
	const sortOrder = useSelectFilter(sortOrderOptions[0].key, sortOrderOptions);

	const history = useHistory();
	const location = useLocation();
	const requestState = useRequestState<SearchResponse>();
	const pageRef = useRef(1);

	const redirectWithQueryParam = () => {
		const params = {
			keyword: keyword.value,
			startDate: dateToYyyymmdd(startDate.value as Date),
			endDate: dateToYyyymmdd(endDate.value as Date),
			category: category.value,
			sortBy: sortBy.value,
			sortOrder: sortOrder.value
		};
		history.push(`${routers.search.path}?${queryString.stringify(params)}`);
	};

	const parseStateFromQueryParam = () => {
		const parsed = queryString.parse(location.search);
		const filters: {[key: string]: any} = {
			keyword,
			startDate,
			endDate,
			category,
			sortBy,
			sortOrder
		}
		Object.keys(parsed).forEach(key => {
			if (key === 'startDate' || key === 'endDate') {
				filters[key]._setValue(yyyymmddToDate(parsed[key]))
			} else if (filters[key]) {
				filters[key]._setValue(parsed[key])
			}
		});

		// need search?
		return location.search.length !== 0;
	}

	const submitSearch = useCallback(async (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (startDate === null || endDate === null || !keyword) {
			return
		}
		redirectWithQueryParam()
	}, [endDate, keyword, redirectWithQueryParam, startDate]);

	const doSearch = useCallback(async () => {
		try {
			if (requestState.isLoading) {
				return
			}

			requestState.resetError();
			requestState.setIsLoading(true);
			const res = await axios.get('http://192.168.0.156:5000/api/search-news', {
				params: {
					...queryString.parse(location.search),
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
						hasNext: data.hasNext,
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
	}, [location.search, requestState]);

	const previousLocationSearch = usePrevious(location.search);
	const didSearch = location.search.length > 0;
	useEffect(() => {
		if (previousLocationSearch !== undefined && previousLocationSearch !== location.search && didSearch) {
			pageRef.current = 1;
			requestState.setData(null)
			doSearch()
		}
	}, [didSearch, doSearch, location.search, previousLocationSearch, requestState]);

	useMount(() => {
		const needSearch = parseStateFromQueryParam();
		if (needSearch) doSearch();
	})

	return {
		keyword,
		startDate,
		endDate,
		category,
		sortBy,
		sortOrder,
		submitSearch,
		requestState,
		doSearch,
		didSearch
	}
}

export default useSearch
