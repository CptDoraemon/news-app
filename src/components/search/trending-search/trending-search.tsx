import React from "react";
import {makeStyles, Typography, Button, CircularProgress} from "@material-ui/core";
import WhatshotIcon from '@material-ui/icons/Whatshot';
import {MOBILE} from "../../../theme";
import routers from "../../../routers";
import PaperWrapper from "../paper-wrapper";
import {Link} from "react-router-dom";
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
    [MOBILE(theme)]: {
      flex: '1 0 100%',
      marginBottom: theme.spacing(1)
    }
  },
  subTitle: {

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
            <WhatshotIcon style={{color: '#f57c00'}}/>
            <span>Trending Searches: </span>
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
