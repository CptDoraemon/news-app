export enum CopyLinkSnackbarActionsTypes {
    CLOSE_SNACKBAR = 'CLOSE_SNACKBAR',
    OPEN_SNACKBAR = 'OPEN_SNACKBAR'
}

export interface CopyLinkSnackBarActions {
    type: CopyLinkSnackbarActionsTypes
}

export function closeCopyLinkSnackBar() {
    return {
        type: CopyLinkSnackbarActionsTypes.CLOSE_SNACKBAR
    }
}

export function openCopyLinkSnackBar() {
    return {
        type: CopyLinkSnackbarActionsTypes.OPEN_SNACKBAR
    }
}