import React, {useMemo, useRef, useState} from "react";
import {Fade, makeStyles, Typography} from "@material-ui/core";
import {useMount} from "react-use";
import {grey} from "@material-ui/core/colors";
import FadeAndSlideIn from "./fade-and-slide-in";
import useCallbackOnValueChange from "../../../tools/use-callback-on-value-change";
import {MOBILE} from "../../../theme/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    [MOBILE(theme)]: {
      padding: theme.spacing(1),
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
  },
  titleWrapper: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    [MOBILE(theme)]: {
      width: '100%'
    }
  },
  title: {
    width: '100%',
    textTransform: 'uppercase',
    fontWeight: 900,
    lineHeight: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    textAlign: 'end',
    [MOBILE(theme)]: {
      alignItems: 'flex-start',
      textAlign: 'start',
    }
  },
  content: {
    width: '100%',
    textAlign: 'end',
    fontWeight: 600,
    color: grey[700],
    margin: theme.spacing(1, 0),
    [MOBILE(theme)]: {
      textAlign: 'start',
    }
  },
  chartWrapper: {
    flex: '1 0 auto',
    [MOBILE(theme)]: {
      width: '100%',
      height: 400,
    }
  },
  chartWrapperInner: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [MOBILE(theme)]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  chartWrapperDimension: {

  }
}));

interface SectionWithChartProps {
  title: string | string[],
  content: string,
  children: JSX.Element,
  cbOnChartElReady: () => void,
  belowTitle?: JSX.Element,
  isVisible: boolean
}

const SectionWithChart = ({title, content, children, cbOnChartElReady, belowTitle, isVisible}: SectionWithChartProps) => {
  const classes = useStyles();
  const animationDuration = 600;

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

  useCallbackOnValueChange(chartElReady, () => {
    if (chartElReady) {
      cbOnChartElReady()
    }
  })

  return (
    <div className={classes.root}>
      <div className={classes.titleWrapper}>
        <Typography component={'h2'} variant={'h2'} className={classes.title}>
          {
            words.map((word, i) => (
              <FadeAndSlideIn active={isVisible} direction={i % 2 === 0 ? 'left' : 'right'} key={i} duration={animationDuration}>
                <span>{word}</span>
              </FadeAndSlideIn>
            ))
          }
        </Typography>
        <Typography variant={'h6'} component={'div'} className={classes.content}>
          <FadeAndSlideIn active={isVisible} direction={words.length % 2 === 0 ? 'left' : 'right'} duration={animationDuration}>
            <span>{content}</span>
          </FadeAndSlideIn>
        </Typography>
        <Fade timeout={animationDuration * 2} in={isVisible}>
          <div>
            { belowTitle }
          </div>
        </Fade>
      </div>
      <Fade in={!!chartSize && isVisible} timeout={animationDuration}>
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
      </Fade>
    </div>
  )
};

export default SectionWithChart
