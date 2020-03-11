import {CopyLinkSnackBarActions, CopyLinkSnackbarActionsTypes} from "../actions/copy-link-snackbar";
import {State, initState} from "../state";
import {SearchKeywordActions, SearchKeywordTypes} from "../actions/search-keyword";

function searchKeyword(state = initState.searchKeyword, actions: SearchKeywordActions): State['searchKeyword'] {
    switch(actions.type) {
        case SearchKeywordTypes.SET_KEYWORD:
            return actions.keyword;
        default:
            return state
    }
}

export default searchKeyword