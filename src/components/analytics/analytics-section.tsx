import React, {useEffect, useMemo, useRef, useState} from "react";
import {makeStyles, Typography, useMediaQuery, useTheme} from "@material-ui/core";
import {MOBILE} from "../../theme/theme";
import Title from "./utilitis/title";
import Content from "./utilitis/content";
import {useMount, usePrevious} from "react-use";
import {grey} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleWrapper: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  title: {
    textAlign: 'start',
    width: '100%',
    textTransform: 'uppercase',
    fontWeight: 900,
    lineHeight: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  content: {
    width: '100%',
    textAlign: 'end',
    fontSize: theme.typography.h6.fontSize,
    fontWeight: 600,
    color: grey[700],
    margin: theme.spacing(1, 0)
  },
  chartWrapper: {
    flex: '1 0 auto'
  },
  chartWrapperInner: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  chartWrapperDimension: {

  }
}));

interface AnalyticsSectionProps {
  title: string | string[],
  content: string,
  children: JSX.Element,
  fullHeightOffset?: number,
  cbOnChartElReady: () => void
}

const AnalyticsSection = ({title, content, children, fullHeightOffset, cbOnChartElReady}: AnalyticsSectionProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(MOBILE(theme));
  const height = useMemo(() => {
    const max = 1440;
    const min = 900;
    const headerHeight = fullHeightOffset || 50;
    return Math.min(max, Math.max(min, window.innerHeight)) - headerHeight;
  }, [fullHeightOffset]);

  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState(0);
  const [chartElReady, setCharElReady] = useState(false);
  useMount(() => {
    if (!chartWrapperRef.current) return;
    const rect = chartWrapperRef.current.getBoundingClientRect();
    setChartSize(Math.min(rect.width, rect.height));
    setCharElReady(true);
  });

  const words = useMemo(() => Array.isArray(title) ? title : title.split(' '), [title]);

  const previousChartElReady = usePrevious(chartElReady);
  useEffect(() => {
    if (previousChartElReady !== chartElReady && previousChartElReady !== undefined && chartElReady) {
      cbOnChartElReady()
    }
  }, [cbOnChartElReady, chartElReady, previousChartElReady])

  return (
    <div className={classes.root} style={{height}}>
      <div className={classes.titleWrapper}>
        <Typography component={'h2'} variant={'h4'} className={classes.title}>
          {
            words.map((word, i) => (
              <span key={i}>{word}</span>
            ))
          }
        </Typography>
        <Typography variant={'body1'} component={'p'} className={classes.content}>
          {content}
        </Typography>
      </div>
      <div className={classes.chartWrapper}>
        <div className={classes.chartWrapperInner} ref={chartWrapperRef}>
          {
            !!chartSize &&
            <div className={classes.chartWrapperDimension} style={{width: chartSize, height: chartSize}}>
              {children}
            </div>
          }
        </div>
      </div>
    </div>
  )
};

export default AnalyticsSection
