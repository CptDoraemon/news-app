export enum CopyLinkSnackbarActionsTypes {
  CLOSE_SNACKBAR = 'CLOSE_SNACKBAR',
  OPEN_SNACKBAR = 'OPEN_SNACKBAR'
}

export interface CopyLinkSnackBarActions {
  type: CopyLinkSnackbarActionsTypes,
  payload: {
    link: string
  }
}

export function closeCopyLinkSnackBar() {
  return {
    type: CopyLinkSnackbarActionsTypes.CLOSE_SNACKBAR
  }
}

export function openCopyLinkSnackBar(link: string) {
  return {
    type: CopyLinkSnackbarActionsTypes.OPEN_SNACKBAR,
    payload: {
      link
    }
  }
}
