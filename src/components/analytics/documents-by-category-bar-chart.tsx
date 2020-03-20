import React, {useEffect, useRef, useState} from "react";
import BarChartD3, {BarChartData} from "../../d3-charts/bar-chart-d3";
import useLazyLoad from "../../tools/use-lazy-load";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Title from "./utilitis/title";

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
        if (barChart && isVisible) {
            barChart.animate();
        }
    }, [barChart, isVisible]);

    return (
        <>
            <Title value={'News achieved by category'} />
            <div id='analytics-documents-count-by-category' ref={ref}/>
        </>
    )
};

export default DocumentsByCategoryBarChart