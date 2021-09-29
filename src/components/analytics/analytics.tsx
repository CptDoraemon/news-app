import React, {useMemo} from "react";
import {CircularProgress, makeStyles} from "@material-ui/core";
import WordCloud from "./word-cloud/word-cloud";
import useGetAnalytics from "./hooks/use-get-analytics";
import Box from "@material-ui/core/Box";
import MessageWithIcon from "../utility-components/message-with-icon";
import InfoIcon from "@material-ui/icons/Info";
import TextSummary from "./text-summary";
import useChangeBackgroundColor from "./hooks/use-change-background-color";
import DocsByCategory from "./docs-by-category";
import DocsByDay from "./docs-by-day";
import DocsByDayAndCategory from "./docs-by-day-and-category";
import FullscreenSection from "./layouts/fullscreen-section";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    maxWidth: '100%',
    overflowX: 'hidden'
  },
  centering: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

interface AnalyticsProps {}

const Analytics = () => {
  const classes = useStyles();
  const getAnalytics = useGetAnalytics();
  const isDataReady = useMemo(() => !getAnalytics.isLoading && !getAnalytics.isError && !!getAnalytics.data, [getAnalytics.data, getAnalytics.isError, getAnalytics.isLoading]);

  const {
    bgColorChangeRef,
    bgBlack
  } = useChangeBackgroundColor(isDataReady);

  return (
    <div className={classes.root}>
      {
        getAnalytics.isLoading &&
        <FullscreenSection>
          <div className={classes.centering}>
            <CircularProgress color={"secondary"}/>
          </div>
        </FullscreenSection>
      }
      {
        !getAnalytics.isLoading && getAnalytics.isError &&
        <Box my={2} width={'100%'}>
          <MessageWithIcon
            icon={<InfoIcon/>}
            title={'Server Error'}
            text={'Please try again later'}
          />
        </Box>
      }
      {
        !getAnalytics.isLoading && !getAnalytics.isError && !!getAnalytics.data &&
        <>
          <TextSummary
            totalDocuments={getAnalytics.data.summary.totalCount}
            earliestDocumentDate={getAnalytics.data.summary.firstDocDate}
            latestDocumentDate={getAnalytics.data.summary.lastDocDate}
          />
          <div ref={bgColorChangeRef} />
          <DocsByCategory data={getAnalytics.data.countByCategory} />
          <DocsByDay data={getAnalytics.data.docsCountByDay} />
          <DocsByDayAndCategory data={getAnalytics.data.docCountByDayAndCategory} />
          <WordCloud data={getAnalytics.data.wordCloud} />
        </>
      }
    </div>
  )
};

export default Analytics
