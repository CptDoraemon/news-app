import React from "react";
import {makeStyles, Typography, CircularProgress} from "@material-ui/core";
import WhatshotIcon from '@material-ui/icons/Whatshot';
import {MOBILE} from "../../../theme";
import PaperWrapper from "../paper-wrapper";
import useTrendingSearch from "./use-trending-search";
import TrendingRow from "./trending-row";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  title: {
    fontWeight: 700,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: '1ch',
  },
  rowWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(1)
  },
}));

interface TrendingSearchProps {
}

const TrendingSearch = () => {
  const classes = useStyles();
  const trending = useTrendingSearch();

  return (
    <PaperWrapper>
      <div className={classes.root}>
        <div className={classes.rowWrapper}>
          <Typography variant={'body1'} component={'div'} className={classes.title}>
            <span style={{marginRight: 8}}>Trending Searches</span>
            <WhatshotIcon style={{color: '#f57c00'}}/>
          </Typography>

          {
            trending.request.isLoading &&
            <CircularProgress size={25}/>
          }

          {
            trending.request.isError &&
            trending.request.errorMessage
          }
        </div>

        {
          trending.request.data !== null &&
          <>
            <TrendingRow data={trending.request.data.lastWeek} title={'Last week'} />
            <TrendingRow data={trending.request.data.allTime} title={'All time'} />
          </>
        }
      </div>
    </PaperWrapper>
  )
};

export default TrendingSearch
