import React, {useEffect, useRef, useState} from "react";
import {AnalyticsPageStatus, SummaryStatisticsData} from "./use-get-analytics";
import BarChartD3 from "../../d3-charts/bar-chart-d3";
import useLazyLoad from "../../tools/use-lazy-load";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: theme.spacing(4)
    }
}));

interface DocumentsByCategoryBarChartProps {
    status: AnalyticsPageStatus,
    summaryStatisticsData: SummaryStatisticsData,
    width?: number
}

const DocumentsByCategoryBarChart: React.FC<DocumentsByCategoryBarChartProps> = ({status, summaryStatisticsData, width}) => {
    const classes = useStyles();
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useLazyLoad(ref, 0.5);
    const [barChart, setBarChart] = useState<null | BarChartD3>(null);

    useEffect(() => {
        if (status === AnalyticsPageStatus.loaded && summaryStatisticsData && width) {
            const data = summaryStatisticsData.documentsCountByCategory.map(obj => ({
                title: obj.category,
                value: obj.count
            }));
            const barChart = new BarChartD3(
                'analytics-documents-count-by-category',
                data,
                width
            );
            barChart.main();
            setBarChart(barChart);
        }
    }, [status, summaryStatisticsData, width]);

    useEffect(() => {
        if (barChart && isVisible) {
            barChart.animate();
        }
    }, [barChart, isVisible]);

    return (
        <>
            <Typography variant={'body2'} component={'h2'}>
                <Box>{'News achieved by category'}</Box>
            </Typography>
            <div id='analytics-documents-count-by-category' ref={ref}/>
        </>
    )
};

export default DocumentsByCategoryBarChart