import React, {useEffect, useRef, useState} from "react";
import useLazyLoad from "../../tools/use-lazy-load";
import makeStyles from "@material-ui/core/styles/makeStyles";
import HeatMapD3, {HeatMapData} from "../../d3-charts/heat-map-d3";
import Title from "./utilitis/title";
import Content from "./utilitis/content";

const useStyles = makeStyles(theme => ({

}));

interface DocumentsHeatMapProps {
    isLoaded: Boolean,
    data: HeatMapData,
    width?: number
}

const id = 'analytics-documents-count-stacked-bar-chart';

const DocumentsCountStackedBarChart: React.FC<DocumentsHeatMapProps> = ({isLoaded, data, width}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useLazyLoad(ref, 0.5);
    const [heatMap, setHeatMap] = useState<null | HeatMapD3>(null);

    useEffect(() => {
        if (isLoaded && data && width && heatMap === null) {
            const heatMap = new HeatMapD3(
                id,
                data,
                width
            );
            heatMap.main();
            setHeatMap(heatMap);
        }
    }, [isLoaded, data, width]);

    useEffect(() => {
        if (heatMap && isVisible) {
            heatMap.animate();
        }
    }, [heatMap, isVisible]);

    return (
        <>
            <Title value={'News archived each day'} />
            <Content value={`Stacked bar chart grouped by category`}/>
            <div id={id} ref={ref}/>
        </>
    )
};

export default DocumentsCountStackedBarChart