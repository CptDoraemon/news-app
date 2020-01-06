import {fetchArticles} from "./articles";
import {ActionCreator, Dispatch} from "redux";
import {ThunkAction} from "redux-thunk";
import {State} from "../state";

export enum Category {
    HEADLINE= `HEADLINE`,
    BUSINESS= `BUSINESS`,
    ENTERTAINMENT= `ENTERTAINMENT`,
    HEALTH= `HEALTH`,
    SCIENCE= `SCIENCE`,
    SPORTS= `SPORTS`,
    TECHNOLOGY= `TECHNOLOGY`,
}

export type Categories = Array<keyof typeof Category>;

export const categories: Categories = [
    `HEADLINE`, `BUSINESS`, `ENTERTAINMENT`, `HEALTH`, `SCIENCE`, `SPORTS`, `TECHNOLOGY`
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

const setCategoryAndFetchArticles
    = (category: Category) => {
    return (dispatch: any) => {
        dispatch(setCategory(category));
        // dispatch(fetchArticles(category));
    };
};

export function setNextCategory() {
    return (dispatch: any, getState: any) => {
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
    return (dispatch: any, getState: any) => {
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
    return (dispatch: any, getState: any) => {
        if (getState().category === category) return;
        dispatch(setCategoryAndFetchArticles(category));
    };
}
