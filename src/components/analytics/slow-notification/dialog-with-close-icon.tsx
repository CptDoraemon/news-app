import React from "react";
import {makeStyles, DialogTitle as MuiDialogTitle, Typography, IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `0 ${48 + theme.spacing(2)}px 0 0`,
    padding: theme.spacing(2, 3),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

interface DialogTitleWithCloseIconProps {
  children?: JSX.Element | string,
  onClose: () => void,
  closeDisabled?: boolean
}

const DialogTitleWithCloseIcon: React.FC<DialogTitleWithCloseIconProps> = ({children, onClose, closeDisabled, ...other }) => {
  const classes = useStyles();

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose} disabled={closeDisabled}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export default DialogTitleWithCloseIcon
