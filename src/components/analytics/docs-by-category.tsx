import React, {useCallback, useRef} from "react";
import {makeStyles} from "@material-ui/core";
import FullscreenSection from "./layouts/fullscreen-section";
import SectionWithChart from "./layouts/section-with-chart";
import PieChartD3 from "../../d3-charts/pie-chart-d3";
import {AnalyticsData} from "./hooks/use-get-analytics";
import useIsVisible from "../../tools/use-is-visible";
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
    height: '50%'
  }
}));

interface DocsByCategoryProps {
  data: AnalyticsData['countByCategory'],
}

const DocsByCategory = ({data}: DocsByCategoryProps) => {
  const classes = useStyles();
  const id = 'analytics-docs-by-category';
  const {
    isVisible,
    isVisibleElRef
  } = useIsVisible<HTMLDivElement>(false);
  const d3Ref = useRef<null | PieChartD3>(null);

  const initChart = useCallback(() => {
    d3Ref.current = new PieChartD3(
      id,
      data.map(obj => ({
        value: obj.count,
        title: obj.category
      }))
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
        title={'News archived by category'}
        content={`Overall I'd say the news are pretty well balanced.`}
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

export default DocsByCategory
