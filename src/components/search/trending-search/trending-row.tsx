import React from "react";
import {Button, makeStyles, Typography} from "@material-ui/core";
import {TrendingItem} from "./use-trending-search";
import {Link} from "react-router-dom";
import routers from "../../../routers";
import {orange} from "@material-ui/core/colors";

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
    margin: theme.spacing(0, -0.5)
  },
  button: {
    margin: theme.spacing(0.5),
    textTransform: 'none',
    fontWeight: 700,
    backgroundColor: orange[600],
    color: '#fff',
    '&:hover, &:focus': {
      backgroundColor: orange[100],
      color: 'rgba(0,0,0,0.7)',
    },
    '& .MuiButton-endIcon': {

    }
  },
  buttonText: {
    maxWidth: '10ch',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordBreak: 'break-all',
    overflow: 'hidden',
    display: 'block'
  },
  title: {
    fontWeight: 900,
    whiteSpace: 'pre',
    width: 80,
    textTransform: 'uppercase',
    fontSize: theme.typography.caption.fontSize
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
      <Typography variant={'h5'} component={'div'} className={classes.title}>
        <span>{`${title}: `}</span>
      </Typography>
      <div className={classes.buttonWrapper}>
        {
          data.length ?
            data.map(item => (
              <Button
                key={item.key}
                className={classes.button}
                component={Link}
                to={`${routers.search.path}?keyword=${item.key}`}
                size={'small'}
                endIcon={<>{item.doc_count}</>}
              >
                <span className={classes.buttonText}>{item.key}</span>
              </Button>
            )) :
            'Not enough searches'
        }
      </div>
    </div>
  )
};

export default TrendingRow
