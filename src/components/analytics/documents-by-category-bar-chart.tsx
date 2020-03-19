import React, {useEffect, useRef, useState} from "react";
import {AnalyticsPageStatus, SummaryStatisticsData} from "./utilitis/use-get-analytics";
import BarChartD3, {BarChartData} from "../../d3-charts/bar-chart-d3";
import useLazyLoad from "../../tools/use-lazy-load";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({

}));

interface DocumentsByCategoryBarChartProps {
    isLoaded: boolean,
    data: BarChartData,
    width?: number
}

const DocumentsByCategoryBarChart: React.FC<DocumentsByCategoryBarChartProps> = ({isLoaded, data, width}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useLazyLoad(ref, 0.5);
    const [barChart, setBarChart] = useState<null | BarChartD3>(null);

    useEffect(() => {
        if (isLoaded && data && width) {
            const barChart = new BarChartD3(
                'analytics-documents-count-by-category',
                data,
                width
            );
            barChart.main();
            setBarChart(barChart);
        }
    }, [isLoaded, data, width]);

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