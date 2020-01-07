import {Action, ActionCreator, AnyAction} from "redux";
import { Category } from './category';
import {State} from "../state";
import {ThunkDispatch} from "redux-thunk";

export interface Article {
    source: string,
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string
}


export enum ArticleActionsTypes {
    IS_ERROR = 'IS_ERROR',
    REQUEST_ARTICLES = 'REQUEST_ARTICLES',
    RECEIVE_ARTICLES = 'RECEIVE_ARTICLES'
}

export interface ArticlesRequestFailedAction {
    type: ArticleActionsTypes.IS_ERROR
}

const requestArticlesFailed: ActionCreator<ArticlesRequestFailedAction> = () => {
    return {
        type: ArticleActionsTypes.IS_ERROR
    }
};

export interface ArticlesRequestAction {
    type: ArticleActionsTypes.REQUEST_ARTICLES
}

const requestArticles: ActionCreator<ArticlesRequestAction> = () => {
    return {
        type: ArticleActionsTypes.REQUEST_ARTICLES
    }
};

export interface ArticlesReceiveAction {
    type: ArticleActionsTypes.RECEIVE_ARTICLES,
    articles: Array<Article>
}

const receiveArticles: ActionCreator<ArticlesReceiveAction> = (articles: Array<Article>) => {
    return {
        type: ArticleActionsTypes.RECEIVE_ARTICLES,
        articles: articles.slice()
    }
};

const NEWS_API = 'https://www.xiaoxihome.com/api/news?query=';

export const fetchArticles = (category: Category) => {
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

    return (dispatch: ThunkDispatch<State, null, AnyAction>) => {
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
};

export type ArticlesActions =  ArticlesRequestAction | ArticlesRequestFailedAction | ArticlesReceiveAction;