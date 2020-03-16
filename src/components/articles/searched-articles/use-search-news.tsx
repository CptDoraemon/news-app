import {useEffect, useState} from "react";
import requestSearchNews from "./request-search-news";
import Status from "./status";
import SortTypes from "./sort/sort-types";

const useSearchNews = (keyword: string) => {

    const [status, setStatus] = useState(Status.LOADING);
    const [data, setData] = useState<any>([]);
    const [sortType, setSortType] = useState(SortTypes.relevance);
    const [totalCount, setTotalCount] = useState(0);
    const [frequencyData, setFrequencyData] = useState<any>(null);
    const [filterDate, setFilterDate] = useState<number>(0);

    const newSearch = async () => {
        try {
            setData([]);
            setFrequencyData(null);
            setTotalCount(0);
            setSortType(SortTypes.relevance);

            setStatus(Status.LOADING);
            const json: any = await requestSearchNews(keyword, 0, true);
            setData(json.data);
            setFrequencyData(json.frequency);
            setTotalCount(json.totalCount);
            setLoadedStatus(json);
        } catch (e) {
            setStatus(Status.ERROR)
        }
    };

    const loadMore = async () => {
        try {
            if (status === Status.LOADING) return;

            setStatus(Status.LOADING);
            const json: any = await requestSearchNews(keyword, data.length, false, sortType, filterDate);
            setData((prevData: any[]) => [...prevData, ...json.data]);
            setLoadedStatus(json)
        } catch (e) {
            setStatus(Status.ERROR)
        }
    };

    const toggleSort = async (type: SortTypes) => {
        try {
            console.log(type, sortType);
            if (status === Status.LOADING) return;
            if (type === sortType) return;
            // reset
            setData([]);
            setSortType(type);

            //
            setStatus(Status.LOADING);
            const json: any = await requestSearchNews(keyword, 0, false, type);
            setData(json.data);
            setLoadedStatus(json)
        } catch (e) {
            setStatus(Status.ERROR)
        }
    };

    const setLoadedStatus = (json: any) => {
        if (json.data.length === json.totalCount) {
            setStatus(Status.LOADED_NO_MORE)
        } else if (json.totalCount === 0) {
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
        toggleSort,
        loadMore,
    };
};

export default useSearchNews