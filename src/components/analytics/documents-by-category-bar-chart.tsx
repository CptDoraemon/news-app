import React, {useEffect, useRef, useState} from "react";
import PieChartD3, {PieChartData} from "../../d3-charts/pie-chart-d3";
import useLazyLoad from "../../tools/use-lazy-load";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Title from "./utilitis/title";
import Content from "./utilitis/content";

const useStyles = makeStyles(theme => ({}));

interface DocumentsByCategoryBarChartProps {
  isLoaded: boolean,
  data: PieChartData,
  animate: boolean
  width?: number
}

const id = 'analytics-documents-count-by-category-pie-chart';

const DocumentsByCategoryPieChart: React.FC<DocumentsByCategoryBarChartProps> = ({isLoaded, data, animate, width}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pieChart, setPieChart] = useState<null | PieChartD3>(null);

  useEffect(() => {
    if (isLoaded && data && width && pieChart === null) {
      const barChart = new PieChartD3(
        id,
        data,
        width
      );
      barChart.main();
      setPieChart(barChart);
    }
  }, [isLoaded, data, width]);

  useEffect(() => {
    if (pieChart && animate) {
      pieChart.animate();
    }
  }, [pieChart, animate]);

  return (
    <>
      <Title value={'News archived by category'}/>
      <Content value={`Overall I'd say the news are pretty well balanced.`}/>
      <div id={id} ref={ref}/>
    </>
  )
};

export default DocumentsByCategoryPieChart
