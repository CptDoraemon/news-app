import React, {useEffect, useRef, useState} from "react";
import useLazyLoad from "../../tools/use-lazy-load";
import makeStyles from "@material-ui/core/styles/makeStyles";
import HeatMapD3, {HeatMapData} from "../../d3-charts/heat-map-d3";
import Title from "./utilitis/title";
import Content from "./utilitis/content";

const useStyles = makeStyles(theme => ({}));

interface DocumentsHeatMapProps {
  isLoaded: Boolean,
  data: HeatMapData,
  width: number
}

const DocumentsHeatMap: React.FC<DocumentsHeatMapProps> = ({isLoaded, data, width}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useLazyLoad(ref, 0.5);
  const [heatMap, setHeatMap] = useState<null | HeatMapD3>(null);

  useEffect(() => {
    if (isLoaded && data && heatMap === null) {
      const heatMap = new HeatMapD3(
        'analytics-documents-heat-map',
        data,
        width
      );
      heatMap.main();
      setHeatMap(heatMap);
    }
  }, [isLoaded, data]);

  useEffect(() => {
    if (heatMap && isVisible) {
      heatMap.animate();
    }
  }, [heatMap, isVisible]);

  return (
    <>
      <Title value={'News archived each day'}/>
      <Content value={`Glad to see that people enjoyed their weekends.`}/>
      <div id='analytics-documents-heat-map' ref={ref}/>
    </>
  )
};

export default DocumentsHeatMap
