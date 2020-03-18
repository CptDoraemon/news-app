import React, {useEffect, useRef} from "react";
import useGetAnalytics, {AnalyticsPageStatus} from "./use-get-analytics";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {page1000WidthWrapper, pageRoot} from "../../styles/styles";
import {CircularProgress} from "@material-ui/core";
import NumberSection from "./number-section";
import DateSection from "./date-section";
import BarChartD3 from "../../d3-charts/bar-chart-d3";
import SectionWrapper from "./section-wrapper";

const useStyles = makeStyles(theme => ({
    root: {
        ...pageRoot(theme),
        margin: theme.spacing(10, 0, 15, 0)
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

    useEffect(() => {
        if (status === AnalyticsPageStatus.loaded && summaryStatisticsData && wrapperRef.current) {
            const data = summaryStatisticsData.documentsCountByCategory.map(obj => ({
                title: obj.category,
                value: obj.count
            }));
            const barChart = new BarChartD3(
                'analytics-documents-count-by-category',
                data,
                wrapperRef.current.getBoundingClientRect().width
            );
            barChart.main();
        }
    }, [status, summaryStatisticsData, wrapperRef]);

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
                            <div id='analytics-documents-count-by-category'/>
                        </SectionWrapper>
                    </>
                }
            </div>
        </div>
    )
};

export default Analytics