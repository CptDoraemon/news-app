import React, {useEffect, useRef, useState} from "react";
import useGetAnalytics, {AnalyticsPageStatus} from "./utilitis/use-get-analytics";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {CircularProgress, Typography} from "@material-ui/core";
import SectionWrapper from "./utilitis/section-wrapper";
import Box from "@material-ui/core/Box";
import DocumentsByCategoryBarChart from "./documents-by-category-bar-chart";
import DocumentsHeatMap from "./documents-heat-map";
import DocumentsTextSummary from "./documents-text-summary";
import useDebounce from "../../tools/use-debounce";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        transition: 'background-color 2s',
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
    const {
        status,
        summaryStatisticsData
    } = useGetAnalytics();

    const bgColorChangeRef = useRef<HTMLDivElement>(null);
    const [bgBlack, setBgBlack] = useState(false);
    const changeBgColor = () => {
        if (!bgColorChangeRef.current) return;
        const target = bgColorChangeRef.current.getBoundingClientRect().top - 100;
        if (target <= 0 && bgBlack) {
            setBgBlack(false)
        } else if (target > 0 && !bgBlack) {
            setBgBlack(true)
        }
    };
    useEffect(() => {
        changeBgColor();
        document.addEventListener('scroll', changeBgColor);
        return () => {
            document.removeEventListener('scroll', changeBgColor);
        }
    }, [status, bgBlack]);

    const isLoaded = status === AnalyticsPageStatus.loaded;
    const width = wrapperRef?.current?.getBoundingClientRect().width;

    return (
        <div className={classes.root} style={{backgroundColor: bgBlack ? `rgba(0,0,0,1)` : `rgba(0,0,0,0)`}}>
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
                            ref={bgColorChangeRef}
                        />

                        <SectionWrapper active={!bgBlack}>
                            <DocumentsByCategoryBarChart
                                isLoaded={isLoaded}
                                data={summaryStatisticsData.documentsCountByCategory.map(obj => ({
                                    title: obj.category,
                                    value: obj.count
                                }))}
                                animate={!bgBlack}
                                width={width}/>
                        </SectionWrapper>
                        <SectionWrapper active={!bgBlack}>
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