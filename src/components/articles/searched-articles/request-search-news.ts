import {Dispatch, SetStateAction} from "react";
import Status from "./status";

const baseUrl = 'https://www.xiaoxihome.com/api/search-news';

const requestSearchNews = (keyword: string, skip: number, setStatus: Dispatch<SetStateAction<Status>>, setData: Dispatch<SetStateAction<any>>, data: any) => {
    const url = skip === 0 ?
        `${baseUrl}?keyword=${keyword}` :
        `${baseUrl}?keyword=${keyword}&skip=${skip}`;

    fetch(url)
        .then(res => res.json())
        .then(json => {
            if (json.status === 'error') {
                setStatus(Status.ERROR)
            } else {
                if (!json.resultsFound) {
                    if (data.length > 0) {
                        setStatus(Status.LOADED_NO_MORE);
                    } else {
                        setStatus(Status.LOADED_EMPTY);
                    }
                } else {
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