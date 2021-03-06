import React, {useEffect, useRef, useState} from "react";
import useGetAnalytics, {AnalyticsPageStatus} from "./utilitis/use-get-analytics";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {CircularProgress, Typography} from "@material-ui/core";
import SectionWrapper from "./utilitis/section-wrapper";
import Box from "@material-ui/core/Box";
import DocumentsByCategoryBarChart from "./documents-by-category-bar-chart";
import DocumentsHeatMap from "./documents-heat-map";
import DocumentsTextSummary from "./documents-text-summary";
import Fade from "@material-ui/core/Fade";
import AnimationSlideIn, {AnimationSlideInDirection} from "./utilitis/animation-slide-in";
import WordCloud from "./documents-word-cloud";
import AnimationFixed from "./utilitis/animation-fixed";
import DocumentsCountStackedLineChart from "./documents-count-stacked-line-chart";
import StackedLineChartExpansionPanelNote from "./stacked-line-chart-expansion-panel-note";

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
            setBgBlack(false);
            document.body.style.backgroundColor = '';
        } else if (target > 0 && !bgBlack) {
            setBgBlack(true);
            document.body.style.backgroundColor = 'black'
        }
    };
    useEffect(() => {
        changeBgColor();
        document.addEventListener('scroll', changeBgColor);
        return () => {
            document.removeEventListener('scroll', changeBgColor);
        }
    }, [status, bgBlack]);

    useEffect(() => {
        return () => {
            document.body.style.backgroundColor = ''
        };
    }, []);

    const isLoaded = status === AnalyticsPageStatus.loaded;
    const width = wrapperRef?.current?.getBoundingClientRect().width || 100;

    return (
        <div className={classes.root}>
            <div className={classes.widthWrapper} ref={wrapperRef}>
                {
                    status === AnalyticsPageStatus.loading &&
                    <SectionWrapper>
                        <CircularProgress color={"secondary"}/>
                    </SectionWrapper>
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

                        <Fade in={!bgBlack} timeout={2000}>
                            <SectionWrapper>
                                <DocumentsByCategoryBarChart
                                    isLoaded={isLoaded}
                                    data={summaryStatisticsData.documentsCountByCategory.map(obj => ({
                                        title: obj.category,
                                        value: obj.count
                                    }))}
                                    animate={!bgBlack}
                                    width={width}/>
                            </SectionWrapper>
                        </Fade>

                        <AnimationSlideIn direction={AnimationSlideInDirection.left}>
                            <SectionWrapper>
                                <DocumentsHeatMap isLoaded={isLoaded} data={summaryStatisticsData.documentsCountByDay} width={width}/>
                            </SectionWrapper>
                        </AnimationSlideIn>

                        <AnimationSlideIn direction={AnimationSlideInDirection.right}>
                            <SectionWrapper>
                                <DocumentsCountStackedLineChart
                                    isLoaded={isLoaded}
                                    data={{
                                        quantity: summaryStatisticsData.documentsCountByDayAndCategory.documentCount,
                                        series: summaryStatisticsData.documentsCountByDayAndCategory.series,
                                        order: summaryStatisticsData.documentsCountByDayAndCategory.category
                                    }}
                                    width={width}
                                    height={width >= 1000 ? 600 : width / 2}
                                />
                            </SectionWrapper>
                        </AnimationSlideIn>

                        <StackedLineChartExpansionPanelNote />

                        <AnimationFixed>
                            <SectionWrapper>
                                <WordCloud isLoaded={isLoaded} data={summaryStatisticsData.wordCloud} width={width}/>
                            </SectionWrapper>
                        </AnimationFixed>
                        {/*<div style={{width: 100, height: 3000, backgroundColor: 'rgba(255,0,0,0.5)'}}> </div>*/}
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