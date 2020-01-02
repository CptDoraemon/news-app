import {ArticleActions, Categories, CategoryActions} from "./actions";
import { combineReducers } from "redux";

function category (state = initState.category, action: {type: CategoryActions, category: Categories}) {
    switch (action.type) {
        case CategoryActions.SET_CATEGORY:
            return action.category;
        default:
            return state
    }
}

function articles(state = initState.articles, actions: any) {
    switch(actions.type) {
        case ArticleActions.IS_ERROR:
            return Object.assign({}, state, {isError: true});
        case ArticleActions.REQUEST_ARTICLES:
            return Object.assign({}, state, {
                isError: false,
                isFetching: true
            });
        case ArticleActions.RECEIVE_ARTICLES:
            return Object.assign({}, {
                isError: false,
                isFetching: false,
                articles: actions.articles.slice()
            });
    }
}

const rootReducers = combineReducers({
    category,
    articles
});

export const initState = {
    category: Categories.HEADLINE,
    articles: {
        isError: false,
        isFetching: true,
        articles: []
    }
};

export default rootReducers;