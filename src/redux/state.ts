import {Category} from "./actions/category";
import {Article} from "./actions/articles";

export interface State {
    category: Category,
    articles: {
        isError: boolean,
        isFetching: boolean,
        articles: Array<Article>
    },
    copyLinkSnackBar: {
        isActive: boolean
    }
}

export const initState: State = {
    category: Category.HEADLINE,
    articles: {
        isError: false,
        isFetching: true,
        articles: []
    },
    copyLinkSnackBar: {
        isActive: false
    }
};