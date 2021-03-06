import {useEffect, useState} from "react";
import requestSearchNews from "./request-search-news";
import Status from "../utilities/status";
import SortTypes from "../filters/sort-types";
import {ISearchedArticle, IResponse, IFrequencyData} from "./response-types";

const useSearchNews = (keyword: string) => {

    const [status, setStatus] = useState(Status.LOADING);
    const [data, setData] = useState<ISearchedArticle[]>([]);
    const [sortType, setSortType] = useState(SortTypes.relevance);
    const [totalCount, setTotalCount] = useState(0);
    const [frequencyData, setFrequencyData] = useState<IFrequencyData | null>(null);
    const [pendingDateFilter, _setPendingDateFilter] = useState<number>(0);
    const [dateFilter, _setDateFilter] = useState<number>(0);

    const newSearch = async () => {
        try {
            setData([]);
            setFrequencyData(null);
            setTotalCount(0);
            setSortType(SortTypes.relevance);
            _setPendingDateFilter(0);
            _setDateFilter(0);


            setStatus(Status.LOADING);
            const json: IResponse = await requestSearchNews(keyword, 0, true);
            setData(json.data);
            setFrequencyData({
                bin: json.series.slice(),
                frequency: json.frequency.slice()
            });
            setTotalCount(json.totalCount);
            setLoadedStatus(json.data.length, json.totalCount);
        } catch (e) {
            setStatus(Status.ERROR)
        }
    };

    const loadMore = async () => {
        try {
            if (status === Status.LOADING) return;

            setStatus(Status.LOADING);
            const json: IResponse = await requestSearchNews(keyword, data.length, false, sortType, dateFilter);

            let updatedDataLength = 0;
            setData((prevData) => {
                updatedDataLength = prevData.length + json.data.length;
                return [...prevData, ...json.data]
            });
            setLoadedStatus(updatedDataLength, json.totalCount)
        } catch (e) {
            setStatus(Status.ERROR)
        }
    };

    const toggleSort = async (type: SortTypes) => {
        try {
            if (status === Status.LOADING) return;
            if (type === sortType) return;
            // reset
            setData([]);
            setSortType(type);

            //
            setStatus(Status.LOADING);
            const json: IResponse = await requestSearchNews(keyword, 0, false, type, dateFilter);
            setData(json.data);
            setLoadedStatus(json.data.length, json.totalCount)
        } catch (e) {
            setStatus(Status.ERROR)
        }
    };

    const setPendingDateFilter = (date: number) => {
        _setPendingDateFilter(date);
    };

    const setDateFilter = async (date: number) => {
        try {
            if (status === Status.LOADING) return;
            if (date === dateFilter) return;
            // reset
            setData([]);
            setTotalCount(0);
            _setPendingDateFilter(0);
            _setDateFilter(date);

            //
            setStatus(Status.LOADING);
            const json: IResponse = await requestSearchNews(keyword, 0, false, sortType, date);
            setData(json.data);
            setTotalCount(json.totalCount);
            setLoadedStatus(json.data.length, json.totalCount)
        } catch (e) {
            setStatus(Status.ERROR)
        }
    };

    const setLoadedStatus = (updatedDataLength: number, totalCount: number) => {
        if (updatedDataLength === totalCount && totalCount !== 0) {
            setStatus(Status.LOADED_NO_MORE)
        } else if (totalCount === 0) {
            setStatus(Status.LOADED_EMPTY)
        } else {
            setStatus((Status.LOADED_NORMAL))
        }
    };

    useEffect(() => {
        newSearch();
    }, [keyword]);

    return {
        status,
        data,
        frequencyData,
        sortType,
        totalCount,
        pendingDateFilter,
        dateFilter,
        toggleSort,
        loadMore,
        setPendingDateFilter,
        setDateFilter,
    };
};

export default useSearchNews