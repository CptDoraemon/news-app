import CopyLinkSnackbar from "../components/copy-link-snackbar";

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

function setCategory(category: Categories) {
    return {
        type: CategoryActions.SET_CATEGORY,
        category
    }
}

function setCategoryAndFetchArticles(category: Categories) {
    return (dispatch: any, getState: any) => {
        dispatch(setCategory(category));
        dispatch(fetchArticles(category));
    };
}

export function setNextCategory() {
    return (dispatch: any, getState: any) => {
        const currentCategory = getState().category;
        const currentIndex = categories.indexOf(currentCategory);
        const isLast = currentIndex === categories.length - 1;
        if (isLast) {
            dispatch(setCategoryAndFetchArticles(Categories[categories[0]]));
        } else {
            dispatch(setCategoryAndFetchArticles(Categories[categories[currentIndex + 1]]));
        }
    };
}

export function setPreviousCategory() {
    return (dispatch: any, getState: any) => {
        const currentCategory = getState().category;
        const currentIndex = categories.indexOf(currentCategory);
        const isFirst = currentIndex === 0;
        if (isFirst) {
            dispatch(setCategoryAndFetchArticles(Categories[categories[categories.length - 1]]));
        } else {
            dispatch(setCategoryAndFetchArticles(Categories[categories[currentIndex - 1]]));
        }
    };
}

export function setCategoryIfNeeded(category: Categories) {
    return (dispatch: any, getState: any) => {
        if (getState().category === category) return;
        dispatch(setCategoryAndFetchArticles(category));
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

export enum CopyLinkSnackbarActions {
    CLOSE_SNACKBAR = 'CLOSE_SNACKBAR',
    OPEN_SNACKBAR = 'OPEN_SNACKBAR'
}

export function closeCopyLinkSnackBar() {
    return {
        type: CopyLinkSnackbarActions.CLOSE_SNACKBAR
    }
}

export function openCopyLinkSnackBar() {
    console.log('called');
    return {
        type: CopyLinkSnackbarActions.OPEN_SNACKBAR
    }
}