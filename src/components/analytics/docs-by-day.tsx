import React, {useCallback, useRef} from "react";
import {makeStyles, useMediaQuery, useTheme} from "@material-ui/core";
import FullscreenSection from "./layouts/fullscreen-section";
import SectionWithChart from "./layouts/section-with-chart";
import {AnalyticsData} from "./hooks/use-get-analytics";
import HeatMapD3 from "../../d3-charts/heat-map-d3";
import useIsVisible from "../../tools/use-is-visible";
import useCallbackOnValueChange from "../../tools/use-callback-on-value-change";
import {MOBILE} from "../../theme/theme";

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
  const d3Ref = useRef<null | HeatMapD3>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(MOBILE(theme));

  const initChart = useCallback(() => {
    d3Ref.current = new HeatMapD3(
      id,
      data,
      isMobile
    );
    d3Ref.current.main();
  }, [data, isMobile]);

  useCallbackOnValueChange(isVisible, () => {
    if (isVisible) {
      d3Ref.current!.animate();
    }
  })

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
