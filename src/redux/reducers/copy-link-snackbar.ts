import {CopyLinkSnackBarActions, CopyLinkSnackbarActionsTypes} from "../actions/copy-link-snackbar";
import {State, initState} from "../state";

function copyLinkSnackbar(state = initState.copyLinkSnackBar, actions: CopyLinkSnackBarActions): State['copyLinkSnackBar'] {
    switch(actions.type) {
        case CopyLinkSnackbarActionsTypes.CLOSE_SNACKBAR:
            return {
                isActive: false
            };
        case CopyLinkSnackbarActionsTypes.OPEN_SNACKBAR:
            return {
                isActive: true
            };
        default:
            return state
    }
}

export default copyLinkSnackbar