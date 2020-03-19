import React, {useEffect, useRef} from "react";
import useGetAnalytics, {AnalyticsPageStatus} from "./utilitis/use-get-analytics";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {page1000WidthWrapper, pageRoot} from "../../styles/styles";
import {CircularProgress, Typography} from "@material-ui/core";
import NumberSection from "./utilitis/number-section";
import DateSection from "./utilitis/date-section";
import BarChartD3 from "../../d3-charts/bar-chart-d3";
import SectionWrapper from "./utilitis/section-wrapper";
import Box from "@material-ui/core/Box";
import DocumentsByCategoryBarChart from "./documents-by-category-bar-chart";
import DocumentsHeatMap from "./documents-heat-map";
import Status from "../articles/searched-articles/utilities/status";

const useStyles = makeStyles(theme => ({
    root: {
        ...pageRoot(theme),
    },
    widthWrapper: {
        ...page1000WidthWrapper(theme)
    },
}));

interface AnalyticsProps {

}

const Analytics: React.FC<AnalyticsProps> = () => {
    const classes = useStyles();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const {
        status,
        summaryStatisticsData
    } = useGetAnalytics();

    const isLoaded = status === AnalyticsPageStatus.loaded;
    const width = wrapperRef?.current?.getBoundingClientRect().width;

    return (
        <div className={classes.root}>
            <div className={classes.widthWrapper} ref={wrapperRef}>
                {
                    status === AnalyticsPageStatus.loading && <CircularProgress color={"secondary"}/>
                }
                {
                    status === AnalyticsPageStatus.loaded &&
                    summaryStatisticsData &&
                    <>
                        <SectionWrapper>
                            <NumberSection text={'Total news achieved'} number={summaryStatisticsData.totalDocuments}/>
                            <DateSection text={'First news achieved'} number={summaryStatisticsData.earliestDocumentDate}/>
                            <DateSection text={'Most recent news'} number={summaryStatisticsData.latestDocumentDate}/>
                        </SectionWrapper>
                        <SectionWrapper>
                            <DocumentsByCategoryBarChart
                                isLoaded={isLoaded}
                                data={summaryStatisticsData.documentsCountByCategory.map(obj => ({
                                    title: obj.category,
                                    value: obj.count
                                }))}
                                width={width}/>
                        </SectionWrapper>
                        <SectionWrapper>
                            <DocumentsHeatMap isLoaded={isLoaded} data={summaryStatisticsData.documentsCountByDay} width={width}/>
                        </SectionWrapper>
                    </>
                }
                {
                    status === AnalyticsPageStatus.error &&
                    <Typography variant={'body2'} component={'h1'}>
                        <Box fontWeight={700}>Server error, please try again later</Box>
                    </Typography>
                }
            </div>
        </div>
    )
};

export default Analytics