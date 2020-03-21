import React, {useEffect, useRef, useState} from "react";
import BarChartD3, {BarChartData} from "../../d3-charts/bar-chart-d3";
import useLazyLoad from "../../tools/use-lazy-load";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Title from "./utilitis/title";
import Content from "./utilitis/content";

const useStyles = makeStyles(theme => ({

}));

interface DocumentsByCategoryBarChartProps {
    isLoaded: boolean,
    data: BarChartData,
    animate: boolean
    width?: number
}

const DocumentsByCategoryBarChart: React.FC<DocumentsByCategoryBarChartProps> = ({isLoaded, data, animate, width}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [barChart, setBarChart] = useState<null | BarChartD3>(null);

    useEffect(() => {
        if (isLoaded && data && width && barChart === null) {
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
        if (barChart && animate) {
            barChart.animate();
        }
    }, [barChart, animate]);

    return (
        <>
            <Title value={'News achieved by category'} />
            <Content value={`Overall I'd say the news are pretty balanced.`}/>
            <div id='analytics-documents-count-by-category' ref={ref}/>
        </>
    )
};

export default DocumentsByCategoryBarChart