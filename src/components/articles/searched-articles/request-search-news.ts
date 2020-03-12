import {Dispatch, SetStateAction} from "react";
import Status from "./status";

const baseUrl = 'https://www.xiaoxihome.com/api/search-news';

const requestSearchNews = (
    keyword: string,
    skip: number,
    setStatus: Dispatch<SetStateAction<Status>>,
    setData: Dispatch<SetStateAction<any>>,
    data: any,
    setTotalCount: any
) => {
    setStatus(Status.LOADING);

    const url = skip === 0 ?
        `${baseUrl}?keyword=${keyword}` :
        `${baseUrl}?keyword=${keyword}&skip=${skip}`;

    fetch(url)
        .then(res => res.json())
        .then(json => {
            if (json.status === 'error') {
                setStatus(Status.ERROR)
            } else {
                if (!json.totalCount) {
                    setTotalCount(0);
                    setStatus(Status.LOADED_EMPTY);
                } else {
                    setTotalCount(json.totalCount);
                    setData((prevData: any) => [...prevData, ...json.data]);
                    setStatus(Status.LOADED_NORMAL);
                }
            }
        })
        .catch(e => {
            console.log(e);
            setStatus(Status.ERROR)
        })
};

export default requestSearchNews