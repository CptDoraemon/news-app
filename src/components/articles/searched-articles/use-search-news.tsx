import {useEffect, useState} from "react";
import requestSearchNews from "./request-search-news";
import Status from "./status";
import SortTypes from "./sort/sort-types";

const useSearchNews = (keyword: string) => {

    const [status, setStatus] = useState(Status.LOADING);
    const [data, setData] = useState<any>([]);
    const [sortType, setSortType] = useState(SortTypes.RELEVANCE);
    const [totalCount, setTotalCount] = useState(0);
    const [frequencyData, setFrequencyData] = useState<any>(null);

    const sortByDate = () => {
        setData((prevData: any) => {
            return prevData.sort((a: any, b: any) => {
                const dateA = new Date(a.publishedAt).getTime();
                const dateB = new Date(b.publishedAt).getTime();
                return dateB - dateA
            })
        });
        setSortType(SortTypes.DATE)
    };

    const sortByRelevance = () => {
        setData((prevData: any) => {
            return prevData.sort((a: any, b: any) => b.score - a.score)
        });
        setSortType(SortTypes.RELEVANCE)
    };

    useEffect(() => {
        // Called upon new keyword received
        // Reset data
        setData([]);
        setFrequencyData(null);
        setTotalCount(0);
        setSortType(SortTypes.RELEVANCE);
        requestSearchNews(keyword, 0, setStatus, setData, [], setTotalCount, setFrequencyData)
    }, [keyword]);

    return {
        status,
        setStatus,
        data,
        setData,
        sortType,
        sortByDate,
        sortByRelevance,
        totalCount,
        setTotalCount,
        frequencyData
    };
};

export default useSearchNews