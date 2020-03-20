import React, {useRef} from "react";
import useGetAnalytics, {AnalyticsPageStatus} from "./utilitis/use-get-analytics";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {CircularProgress, Typography} from "@material-ui/core";
import SectionWrapper from "./utilitis/section-wrapper";
import Box from "@material-ui/core/Box";
import DocumentsByCategoryBarChart from "./documents-by-category-bar-chart";
import DocumentsHeatMap from "./documents-heat-map";
import DocumentsTextSummary from "./documents-text-summary";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        transitions: theme.transitions.create('backgroundColor'),
        paddingBottom: '200px',
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

                            <DocumentsTextSummary
                                totalDocuments={summaryStatisticsData.totalDocuments}
                                earliestDocumentDate={summaryStatisticsData.earliestDocumentDate}
                                latestDocumentDate={summaryStatisticsData.latestDocumentDate}
                            />

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