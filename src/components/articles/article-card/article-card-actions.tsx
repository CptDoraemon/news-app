import React, {useCallback} from "react";
import {Button, makeStyles, Link} from "@material-ui/core";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ShareIcon from '@material-ui/icons/Share';
import {ArticleData} from "../use-load-articles";
import copyToClipboard from "../../../tools/copy-to-clipboard";
import {useDispatch} from "react-redux";
import {openCopyLinkSnackBar} from "../../../redux/actions/copy-link-snackbar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(-1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  button: {
    margin: theme.spacing(1)
  }
}));

interface ArticleCardActionsProps {
  data: ArticleData
}

const ArticleCardActions = ({data}: ArticleCardActionsProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleShare = useCallback(() => {
    const link = '123123';
    copyToClipboard(link);
    dispatch(openCopyLinkSnackBar(link));
  }, [dispatch])
  
  return (
    <div className={classes.root}>
      <Button className={classes.button} startIcon={<OpenInNewIcon/>} component={Link} href={data.url} target={'_blank'} rel={'noopener'}>
        Learn More
      </Button>
      <Button className={classes.button} startIcon={<ShareIcon/>} onClick={handleShare}>
        Share
      </Button>
    </div>
  )
};

export default ArticleCardActions
