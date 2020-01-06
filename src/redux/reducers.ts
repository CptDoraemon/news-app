import {ArticleType, ArticleActions, Categories, CategoryActions, CopyLinkSnackbarActions} from "./actions";
import { combineReducers } from "redux";

export interface InitState {
    category: Categories,
    articles: {
        isError: boolean,
        isFetching: boolean,
        articles: Array<ArticleType>
    },
    isCopyLinkSnackbarActive: boolean
}

export const initState = {
    category: Categories.HEADLINE,
    articles: {
        isError: false,
        isFetching: true,
        articles: []
    },
    isCopyLinkSnackbarActive: false
};

function category (state = initState.category, action: {type: CategoryActions, category: Categories}) {
    switch (action.type) {
        case CategoryActions.SET_CATEGORY:
            return Categories[action.category];
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
        default:
            return state
    }
}

function isCopyLinkSnackbarActive(state = initState.isCopyLinkSnackbarActive, actions: any) {
    switch(actions.type) {
        case CopyLinkSnackbarActions.CLOSE_SNACKBAR:
            return false;
        case CopyLinkSnackbarActions.OPEN_SNACKBAR:
            return true;
        default:
            return state
    }
}

const rootReducers = combineReducers({
    category,
    articles,
    isCopyLinkSnackbarActive
});

export default rootReducers;