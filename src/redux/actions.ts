export enum Categories {
    HEADLINE= `HEADLINE`,
    BUSINESS= `BUSINESS`,
    ENTERTAINMENT= `ENTERTAINMENT`,
    HEALTH= `HEALTH`,
    SCIENCE= `SCIENCE`,
    SPORTS= `SPORTS`,
    TECHNOLOGY= `TECHNOLOGY`,
}
export const categories: Array<keyof typeof Categories> = [
    `HEADLINE`, `BUSINESS`, `ENTERTAINMENT`, `HEALTH`, `SCIENCE`, `SPORTS`, `TECHNOLOGY`
];

export interface ArticleType {
    source: string,
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string
}

export enum CategoryActions {
    SET_CATEGORY = 'SET_CATEGORY'
}

export function setCategoryIfNeeded(category: Categories) {
    return (dispatch: any, getState: any) => {
        // if (getState().category === category) return;
        return {
            type: CategoryActions.SET_CATEGORY,
            category
        }
    };
}

export enum ArticleActions {
    IS_ERROR = 'IS_ERROR',
    REQUEST_ARTICLES = 'REQUEST_ARTICLES',
    RECEIVE_ARTICLES = 'RECEIVE_ARTICLES'
}

function requestArticlesFailed() {
    return {
        type: ArticleActions.IS_ERROR
    }
}

function requestArticles() {
    return {
        type: ArticleActions.REQUEST_ARTICLES
    }
}

function receiveArticles(articles: any) {
    return {
        type: ArticleActions.RECEIVE_ARTICLES,
        articles: articles.slice()
    }
}

const NEWS_API = 'https://www.xiaoxihome.com/api/news?query=';
// const NEWS_API = 'http://localhost:5000/api/news?query=';

export function fetchArticles(category: keyof typeof Categories) {
    const QUERY = `
        {
            getNews(category: ${category}) {
                source,
                author,
                title,
                description,
                url,
                urlToImage,
                publishedAt,
                content
            }
        }
    `;

    return (dispatch: any) => {
        dispatch(requestArticles());
        return fetch(NEWS_API + encodeURIComponent(QUERY))
            .then(res => res.json())
            .then(json => {
                if (json.errors) {
                    dispatch(requestArticlesFailed())
                } else {
                    dispatch(receiveArticles(json.data.getNews))
                }
            })
    }
}