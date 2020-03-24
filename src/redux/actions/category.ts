import {fetchArticles} from "./articles";
import {ActionCreator, AnyAction} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {State} from "../state";

export enum Category {
    HEADLINE= `HEADLINE`,
    BUSINESS= `BUSINESS`,
    ENTERTAINMENT= `ENTERTAINMENT`,
    HEALTH= `HEALTH`,
    SCIENCE= `SCIENCE`,
    SPORTS= `SPORTS`,
    TECHNOLOGY= `TECHNOLOGY`,
    SEARCH=`SEARCH`,
    ANALYTICS='ANALYTICS',
    TOPIC='TOPIC'
}

export type Categories = Array<Category>;

export const categories: Categories = [
    Category.HEADLINE, Category.BUSINESS, Category.ENTERTAINMENT, Category.HEALTH, Category.SCIENCE, Category.SPORTS, Category.TECHNOLOGY
];

export enum CategoryActionsType {
    SET_CATEGORY = 'SET_CATEGORY'
}

export interface CategoryActions {
    type: CategoryActionsType,
    category: Category
}

const setCategory: ActionCreator<CategoryActions> = (category: Category) => {
    return {
        type: CategoryActionsType.SET_CATEGORY,
        category
    }
};

export function goToSearchPanel() {
    return {
        type: CategoryActionsType.SET_CATEGORY,
        category: Category.SEARCH
    }
}

export function goToAnalyticsPanel() {
    return {
        type: CategoryActionsType.SET_CATEGORY,
        category: Category.ANALYTICS
    }
}

export function goToTopicPanel() {
    return {
        type: CategoryActionsType.SET_CATEGORY,
        category: Category.TOPIC
    }
}

const setCategoryAndFetchArticles = (category: Category) => {
    return (dispatch: ThunkDispatch<State, null, AnyAction>) => {
        dispatch(setCategory(category));
        dispatch(fetchArticles(category));
    };
};

export function setNextCategory() {
    return (dispatch: ThunkDispatch<State, null, AnyAction>, getState: () => State) => {
        const currentCategory = getState().category;
        const currentIndex = categories.indexOf(currentCategory);
        const isLast = currentIndex === categories.length - 1;
        if (isLast) {
            dispatch(setCategoryAndFetchArticles(Category[categories[0]]));
        } else {
            dispatch(setCategoryAndFetchArticles(Category[categories[currentIndex + 1]]));
        }
    };
}

export function setPreviousCategory() {
    return (dispatch: ThunkDispatch<State, null, AnyAction>, getState: () => State) => {
        const currentCategory = getState().category;
        const currentIndex = categories.indexOf(currentCategory);
        const isFirst = currentIndex === 0;
        if (isFirst) {
            dispatch(setCategoryAndFetchArticles(Category[categories[categories.length - 1]]));
        } else {
            dispatch(setCategoryAndFetchArticles(Category[categories[currentIndex - 1]]));
        }
    };
}

export function setCategoryIfNeeded(category: Category) {
    return (dispatch: ThunkDispatch<State, null, AnyAction>, getState: () => State) => {
        if (getState().category === category) return;
        dispatch(setCategoryAndFetchArticles(category));
    };
}
