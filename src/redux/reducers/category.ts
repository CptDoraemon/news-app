import {initState, State} from "../state";
import {Category, CategoryActions, CategoryActionsType} from "../actions/category";

function category(state = initState.category, action: CategoryActions): State['category'] {
    switch (action.type) {
        case CategoryActionsType.SET_CATEGORY:
            return Category[action.category];
        default:
            return state
    }
}

export default category;