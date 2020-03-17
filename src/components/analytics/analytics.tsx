import React from "react";
import useGetAnalytics, {AnalyticsPageStatus} from "./use-get-analytics";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {page1000WidthWrapper, pageRoot} from "../../styles/styles";
import {CircularProgress} from "@material-ui/core";
import NumberSection from "./number-section";
import DateSection from "./date-section";

const useStyles = makeStyles(theme => ({
    root: {
        ...pageRoot(theme),
        margin: theme.spacing(10, 0, 15, 0)
    },
    widthWrapper: {
        ...page1000WidthWrapper(theme)
    },
    section: {
        margin: theme.spacing(4)
    }
}));

interface AnalyticsProps {

}

const Analytics: React.FC<AnalyticsProps> = () => {
    const classes = useStyles();

    const {
        status,
        summaryStatisticsData
    } = useGetAnalytics();

    return (
        <div className={classes.root}>
            <div className={classes.widthWrapper}>
                {
                    status === AnalyticsPageStatus.loading && <CircularProgress color={"secondary"}/>
                }
                {
                    status === AnalyticsPageStatus.loaded &&
                    summaryStatisticsData &&
                    <>
                        <div className={classes.section}>
                            <NumberSection text={'Total news achieved'} number={summaryStatisticsData.totalDocuments}/>
                        </div>
                        <div className={classes.section}>
                            <DateSection text={'First news achieved'} number={summaryStatisticsData.earliestDocumentDate}/>
                        </div>
                        <div className={classes.section}>
                            <DateSection text={'Most recent news'} number={summaryStatisticsData.latestDocumentDate}/>
                        </div>
                    </>
                }
            </div>
        </div>
    )
};

export default Analytics