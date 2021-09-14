import React, {useCallback} from "react";
import {makeStyles} from "@material-ui/core";
import FullscreenSection from "./layouts/fullscreen-section";
import SectionWithChart from "./layouts/section-with-chart";
import {AnalyticsData} from "./hooks/use-get-analytics";
import HeatMapD3 from "../../d3-charts/heat-map-d3";
import useIsVisible from "../../tools/use-is-visible";

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
    width: '100%'
  }
}));

interface DocsByDayProps {
  data: AnalyticsData['docsCountByDay'],
}

const DocsByDay = ({data}: DocsByDayProps) => {
  const classes = useStyles();
  const id = 'analytics-docs-by-day';
  const {
    isVisible,
    isVisibleElRef
  } = useIsVisible<HTMLDivElement>(false);

  const initChart = useCallback(() => {
    const heatMap = new HeatMapD3(
      id,
      data
    );
    heatMap.main();
    heatMap.animate();
  }, [data])

  return (
    <FullscreenSection ref={isVisibleElRef}>
      <SectionWithChart
        title={'News archived each day'}
        content={`Glad to see that people enjoyed their weekends.`}
        cbOnChartElReady={initChart}
        isVisible={isVisible}
      >
        <div className={classes.containerWrapper}>
          <div id={id} className={classes.container}> </div>
        </div>
      </SectionWithChart>
    </FullscreenSection>
  )
};

export default DocsByDay
