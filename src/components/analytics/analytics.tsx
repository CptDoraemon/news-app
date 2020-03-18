import React, {useEffect, useRef} from "react";
import useGetAnalytics, {AnalyticsPageStatus} from "./use-get-analytics";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {page1000WidthWrapper, pageRoot} from "../../styles/styles";
import {CircularProgress, Typography} from "@material-ui/core";
import NumberSection from "./number-section";
import DateSection from "./date-section";
import BarChartD3 from "../../d3-charts/bar-chart-d3";
import SectionWrapper from "./section-wrapper";
import Box from "@material-ui/core/Box";
import DocumentsByCategoryBarChart from "./documents-by-category-bar-chart";

const useStyles = makeStyles(theme => ({
    root: {
        ...pageRoot(theme),
        margin: theme.spacing(5, 0, 15, 0),
        [theme.breakpoints.down('sm')]: {
            margin: theme.spacing(2, 0, 15, 0),
        }
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
                        </SectionWrapper>
                        <SectionWrapper>
                            <DateSection text={'First news achieved'} number={summaryStatisticsData.earliestDocumentDate}/>
                        </SectionWrapper>
                        <SectionWrapper>
                            <DateSection text={'Most recent news'} number={summaryStatisticsData.latestDocumentDate}/>
                        </SectionWrapper>
                        <SectionWrapper>
                            <DocumentsByCategoryBarChart status={status} summaryStatisticsData={summaryStatisticsData} width={wrapperRef?.current?.getBoundingClientRect().width}/>
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