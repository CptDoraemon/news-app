import React, {useCallback} from "react";
import {makeStyles} from "@material-ui/core";
import FullscreenSection from "./layouts/fullscreen-section";
import SectionWithChart from "./layouts/section-with-chart";
import PieChartD3 from "../../d3-charts/pie-chart-d3";
import {AnalyticsData} from "./utilitis/use-get-analytics";

const useStyles = makeStyles((theme) => ({
  containerWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '70%'
  }
}));

interface DocsByCategoryProps {
  data: AnalyticsData['countByCategory'],
}

const DocsByCategory = ({data}: DocsByCategoryProps) => {
  const classes = useStyles();
  const id = 'analytics-docs-by-category';

  const initChart = useCallback(() => {
    const pieChart = new PieChartD3(
      id,
      data.map(obj => ({
        value: obj.count,
        title: obj.category
      }))
    );
    pieChart.main();
    pieChart.animate();
  }, [data])

  return (
    <FullscreenSection>
      <SectionWithChart
        title={'News archived by category'}
        content={`Overall I'd say the news are pretty well balanced.`}
        cbOnChartElReady={initChart}
      >
        <div className={classes.containerWrapper}>
          <div id={id} className={classes.container}> </div>
        </div>
      </SectionWithChart>
    </FullscreenSection>
  )
};

export default DocsByCategory
