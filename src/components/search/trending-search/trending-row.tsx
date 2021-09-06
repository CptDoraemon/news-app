import React from "react";
import {Button, makeStyles, Typography} from "@material-ui/core";
import {TrendingItem} from "./use-trending-search";
import {Link} from "react-router-dom";
import routers from "../../../routers";
import {MOBILE} from "../../../theme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  buttonWrapper: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    margin: theme.spacing(-1),
    [MOBILE(theme)]: {
      justifyContent: 'center',
    }
  },
  button: {
    margin: theme.spacing(1),
    textTransform: 'none',
    backgroundColor: '#ddd',
    '&:hover, &:focus': {
      backgroundColor: '#f57c00',
      color: '#fff'
    }
  }
}));

interface TrendingRowProps {
  data: TrendingItem[] | null,
  title: string
}

const TrendingRow = ({data, title}: TrendingRowProps) => {
  const classes = useStyles();

  if (data === null) return <></>

  return (
    <div className={classes.root}>
      <Typography variant={'body1'} component={'div'} className={classes.subTitle}>
        {`${title}: `}
      </Typography>
      <div className={classes.buttonWrapper}>
        {
          data.length ?
            data.map(item => (
              <Button key={item.key} className={classes.button} component={Link} to={`${routers.search.path}?keyword=${item.key}`}>
                {item.key}
              </Button>
            )) :
            'Not enough searches'
        }
      </div>
    </div>
  )
};

export default TrendingRow
