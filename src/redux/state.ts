export interface State {
  copyLinkSnackBar: {
    isActive: boolean,
    text: string
  }
}

export const initState: State = {
  copyLinkSnackBar: {
    isActive: false,
    text: ''
  }
};
