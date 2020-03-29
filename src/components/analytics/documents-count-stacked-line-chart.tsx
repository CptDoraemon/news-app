import React, {useEffect, useRef, useState} from "react";
import useLazyLoad from "../../tools/use-lazy-load";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Title from "./utilitis/title";
import Content from "./utilitis/content";
import StackedLineChartD3, {StackedLineChartD3Data} from "../../d3-charts/stacked-line-chart-d3";

const useStyles = makeStyles(theme => ({

}));

interface DocumentsHeatMapProps {
    isLoaded: Boolean,
    data: StackedLineChartD3Data,
    width: number,
    height: number
}

const id = 'analytics-documents-count-stacked-bar-chart';

const DocumentsCountStackedLineChart: React.FC<DocumentsHeatMapProps> = ({isLoaded, data, width, height}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useLazyLoad(ref, 0.5);
    const [stackedBarChart, setStackedBarChart] = useState<null | StackedLineChartD3>(null);

    useEffect(() => {
        if (isLoaded && data && width && stackedBarChart === null) {
            const stackedBarChart = new StackedLineChartD3(
                id,
                data,
                width,
                height
            );
            stackedBarChart.main();
            setStackedBarChart(stackedBarChart);
        }
    }, [isLoaded, data, width]);

    useEffect(() => {
        if (stackedBarChart && isVisible) {
            stackedBarChart.animate();
        }
    }, [stackedBarChart, isVisible]);

    return (
        <>
            <Title value={'News archived each day'} />
            <Content value={`Stacked bar chart grouped by category`}/>
            <div id={id} ref={ref}/>
        </>
    )
};

export default DocumentsCountStackedLineChart