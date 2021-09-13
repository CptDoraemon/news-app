import React, {useMemo} from "react";
import {CircularProgress, makeStyles} from "@material-ui/core";
import WordCloud from "./word-cloud/word-cloud";
import useGetAnalytics from "./utilitis/use-get-analytics";
import SectionWrapper from "./utilitis/section-wrapper";
import Box from "@material-ui/core/Box";
import MessageWithIcon from "../utility-components/message-with-icon";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles((theme) => ({

}));

interface AnalyticsProps {}

const Analytics = () => {
  const classes = useStyles();
  const getAnalytics = useGetAnalytics();
  const isDataReady = useMemo(() => !getAnalytics.isLoading && !getAnalytics.isError && !!getAnalytics.data, [getAnalytics.data, getAnalytics.isError, getAnalytics.isLoading]);

  return (
    <div>
      {
        getAnalytics.isLoading &&
        <SectionWrapper>
          <CircularProgress color={"secondary"}/>
        </SectionWrapper>
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
        <WordCloud data={getAnalytics.data.wordCloud}/>
      }
    </div>
  )
};

export default Analytics
