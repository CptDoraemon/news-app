import {initState, State} from "../state";
import {ArticleActionsTypes, ArticlesActions} from "../actions/articles";

function articles(state = initState.articles, actions: ArticlesActions): State['articles'] {
    switch(actions.type) {
        case ArticleActionsTypes.IS_ERROR:
            return Object.assign({}, state, {isError: true});
        case ArticleActionsTypes.REQUEST_ARTICLES:
            return Object.assign({}, state, {
                isError: false,
                isFetching: true
            });
        case ArticleActionsTypes.RECEIVE_ARTICLES:
            return Object.assign({}, {
                isError: false,
                isFetching: false,
                articles: actions.articles.slice()
            });
        default:
            return state
    }
}

export default articles;