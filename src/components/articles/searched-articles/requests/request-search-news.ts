import SortTypes from "../filters/sort-types";
import {IResponse} from "./response-types";

// const baseUrl = 'https://www.xiaoxihome.com/api/search-news';
const baseUrl = 'http://localhost:5000/api/search-news';

const requestSearchNews = (
    keyword: string,
    skip: number,
    frequency: boolean,
    sort?: SortTypes,
    date?: number
) => {
    return new Promise<IResponse>((resolve, reject) => {
        const dateComponent = date ? `&date=${date}` : '';
        sort = sort || SortTypes.relevance;
        const url = `${baseUrl}?keyword=${keyword}&frequency=${frequency}&skip=${skip}&sort=${sort}${dateComponent}`;

        fetch(url)
            .then(res => res.json())
            .then(json => {
                if (json.status === 'ok') {
                    resolve(json);
                } else {
                    console.log(json);
                    reject(json);
                }
            })
            .catch(e => {
                console.log(e);
                reject(e)
            })
    });
};

export default requestSearchNews
