import {combineReducers} from "redux";
import category from "./category";
import articles from "./articles";
import copyLinkSnackBar from "./copy-link-snackbar";
import searchKeyword from "./search-keyword";

const rootReducers = combineReducers({
    category,
    articles,
    copyLinkSnackBar,
    searchKeyword
});

export default rootReducers;