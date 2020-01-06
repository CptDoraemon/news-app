import {combineReducers} from "redux";
import category from "./category";
import articles from "./articles";
import copyLinkSnackBar from "./copy-link-snackbar"

const rootReducers = combineReducers({
    category,
    articles,
    copyLinkSnackBar
});

export default rootReducers;