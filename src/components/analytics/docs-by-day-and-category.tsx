import React, {useCallback, useRef} from "react";
import {makeStyles} from "@material-ui/core";
import FullscreenSection from "./layouts/fullscreen-section";
import SectionWithChart from "./layouts/section-with-chart";
import {AnalyticsData} from "./hooks/use-get-analytics";
import StackedLineChartD3 from "../../d3-charts/stacked-line-chart-d3";
import useIsVisible from "../../tools/use-is-visible";
import HeatMapD3 from "../../d3-charts/heat-map-d3";
import useCallbackOnValueChange from "../../tools/use-callback-on-value-change";

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
    height: '80%'
  }
}));

interface DocsByDayAndCategoryProps {
  data: AnalyticsData['docCountByDayAndCategory'],
}

const DocsByDayAndCategory = ({data}: DocsByDayAndCategoryProps) => {
  const classes = useStyles();
  const id = 'analytics-docs-by-day-and-category';
  const {
    isVisible,
    isVisibleElRef
  } = useIsVisible<HTMLDivElement>(false);
  const d3Ref = useRef<null | StackedLineChartD3>(null);

  const initChart = useCallback(() => {
    d3Ref.current = new StackedLineChartD3(
      id,
      data
    );
    d3Ref.current.main();
  }, [data]);

  useCallbackOnValueChange(isVisible, () => {
    if (isVisible) {
      d3Ref.current!.animate();
    }
  })

  return (
    <FullscreenSection ref={isVisibleElRef}>
      <SectionWithChart
        title={['News', 'archived', 'by', 'day & category']}
        content={`Art made of data.`}
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

export default DocsByDayAndCategory
