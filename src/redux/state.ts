import {Article} from "./actions/articles";

export interface State {
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
    articles: {
        isError: false,
        isFetching: true,
        articles: []
    },
    copyLinkSnackBar: {
        isActive: false
    }
};
