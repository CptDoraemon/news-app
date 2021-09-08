import React from "react";
import {alpha, Button, makeStyles, Typography} from "@material-ui/core";
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
    padding: theme.spacing(0.25, 1),
    textTransform: 'none',
    fontWeight: 700,
    backgroundColor: alpha(orange[600], 0.08),
    borderLeft: `solid 8px ${alpha(orange[600], 0.64)}`,
    color: 'rgba(0,0,0,0.7)',
    '&:hover, &:focus': {
      backgroundColor: orange[600],
      color: '#fff',
    },
    '& .MuiButton-endIcon': {
      marginLeft: theme.spacing(2),
      display: 'block'
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
    width: '10ch',
    textTransform: 'capitalize',
    fontSize: theme.typography.caption.fontSize,
    color: theme.palette.grey[600]
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
