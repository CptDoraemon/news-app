import React, {useMemo, useRef} from "react";
import useGetAnalytics from "./utilitis/use-get-analytics";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {CircularProgress} from "@material-ui/core";
import SectionWrapper from "./utilitis/section-wrapper";
import Box from "@material-ui/core/Box";
import DocumentsByCategoryBarChart from "./documents-by-category-bar-chart";
import DocumentsHeatMap from "./documents-heat-map";
import DocumentsTextSummary from "./documents-text-summary";
import Fade from "@material-ui/core/Fade";
import AnimationSlideIn, {AnimationSlideInDirection} from "./utilitis/animation-slide-in";
import AnimationFixed from "./utilitis/animation-fixed";
import DocumentsCountStackedLineChart from "./documents-count-stacked-line-chart";
import StackedLineChartExpansionPanelNote from "./stacked-line-chart-expansion-panel-note";
import MessageWithIcon from "../utility-components/message-with-icon";
import InfoIcon from "@material-ui/icons/Info";
import useChangeBackgroundColor from "./utilitis/use-change-background-color";

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'hidden',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: '200px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '250px',
    }
  },
  widthWrapper: {
    width: '1000px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
}));

interface AnalyticsProps {

}

const Analytics: React.FC<AnalyticsProps> = () => {
  const classes = useStyles();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const getAnalytics = useGetAnalytics();
  const isDataReady = useMemo(() => !getAnalytics.isLoading && !getAnalytics.isError && !!getAnalytics.data, [getAnalytics.data, getAnalytics.isError, getAnalytics.isLoading]);
  const {
    bgColorChangeRef,
    bgBlack
  } = useChangeBackgroundColor(isDataReady);

  const width = wrapperRef?.current?.getBoundingClientRect().width || 100;

  return (
    <div className={classes.root}>
      <div className={classes.widthWrapper} ref={wrapperRef}>
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
          isDataReady &&
          <>
            <DocumentsTextSummary
              totalDocuments={getAnalytics.data!.summary.totalCount}
              earliestDocumentDate={getAnalytics.data!.summary.firstDocDate}
              latestDocumentDate={getAnalytics.data!.summary.lastDocDate}
            />

            <div ref={bgColorChangeRef}/>

            <Fade in={!bgBlack} timeout={2000}>
              <SectionWrapper>
                <DocumentsByCategoryBarChart
                  isLoaded={true}
                  data={getAnalytics.data!.countByCategory.map(obj => ({
                    title: obj.category,
                    value: obj.count
                  }))}
                  animate={!bgBlack}
                  width={width}/>
              </SectionWrapper>
            </Fade>

            <AnimationSlideIn direction={AnimationSlideInDirection.left}>
              <SectionWrapper>
                <DocumentsHeatMap isLoaded={true} data={getAnalytics.data!.docsCountByDay} width={width}/>
              </SectionWrapper>
            </AnimationSlideIn>

            <AnimationSlideIn direction={AnimationSlideInDirection.right}>
              <SectionWrapper>
                <DocumentsCountStackedLineChart
                  isLoaded={true}
                  data={getAnalytics.data!.docCountByDayAndCategory}
                  width={width}
                  height={width >= 1000 ? 600 : width / 2}
                />
              </SectionWrapper>
            </AnimationSlideIn>

          </>
        }


        {/*{*/}
        {/*  status === AnalyticsPageStatus.loaded &&*/}
        {/*  summaryStatisticsData &&*/}
        {/*  <>*/}

        {/*    <DocumentsTextSummary*/}
        {/*      totalDocuments={summaryStatisticsData.totalDocuments}*/}
        {/*      earliestDocumentDate={summaryStatisticsData.earliestDocumentDate}*/}
        {/*      latestDocumentDate={summaryStatisticsData.latestDocumentDate}*/}
        {/*      ref={bgColorChangeRef}*/}
        {/*    />*/}

            {/*<Fade in={!bgBlack} timeout={2000}>*/}
            {/*  <SectionWrapper>*/}
            {/*    <DocumentsByCategoryBarChart*/}
            {/*      isLoaded={isLoaded}*/}
            {/*      data={summaryStatisticsData.documentsCountByCategory.map(obj => ({*/}
            {/*        title: obj.category,*/}
            {/*        value: obj.count*/}
            {/*      }))}*/}
            {/*      animate={!bgBlack}*/}
            {/*      width={width}/>*/}
            {/*  </SectionWrapper>*/}
            {/*</Fade>*/}

            {/*<AnimationSlideIn direction={AnimationSlideInDirection.left}>*/}
            {/*  <SectionWrapper>*/}
            {/*    <DocumentsHeatMap isLoaded={isLoaded} data={summaryStatisticsData.documentsCountByDay} width={width}/>*/}
            {/*  </SectionWrapper>*/}
            {/*</AnimationSlideIn>*/}

            {/*<AnimationSlideIn direction={AnimationSlideInDirection.right}>*/}
            {/*  <SectionWrapper>*/}
            {/*    <DocumentsCountStackedLineChart*/}
            {/*      isLoaded={isLoaded}*/}
            {/*      data={{*/}
            {/*        quantity: summaryStatisticsData.documentsCountByDayAndCategory.documentCount,*/}
            {/*        series: summaryStatisticsData.documentsCountByDayAndCategory.series,*/}
            {/*        order: summaryStatisticsData.documentsCountByDayAndCategory.category*/}
            {/*      }}*/}
            {/*      width={width}*/}
            {/*      height={width >= 1000 ? 600 : width / 2}*/}
            {/*    />*/}
            {/*  </SectionWrapper>*/}
            {/*</AnimationSlideIn>*/}

        {/*    <StackedLineChartExpansionPanelNote/>*/}

        {/*    <AnimationFixed>*/}
        {/*      <SectionWrapper>*/}
        {/*        <WordCloud isLoaded={isLoaded} data={summaryStatisticsData.wordCloud} width={width}/>*/}
        {/*      </SectionWrapper>*/}
        {/*    </AnimationFixed>*/}
        {/*    /!*<div style={{width: 100, height: 3000, backgroundColor: 'rgba(255,0,0,0.5)'}}> </div>*!/*/}
        {/*  </>*/}
        {/*}*/}
      </div>
    </div>
  )
};

export default Analytics
