import React, {useMemo} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSpring, animated, config, SpringValue} from '@react-spring/web';
import {Typography} from "@material-ui/core";
import FullscreenSection from "./layouts/fullscreen-section";

const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#F2F2F2'
  },
  section: {
    margin: theme.spacing(5, 0),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 0)
    }
  },
  title: {
    fontWeight: 700
  },
  number: {
    fontWeight: 900
  }
}));

const roundAndToMs = (isoString: string) => {
  const date = new Date(isoString);
  const rounded = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayMsMinusOneS = 1000 * 60 * 60 * 24 - 1;
  return rounded.getTime() + dayMsMinusOneS;
}

const useCountUpAnimation = (totalDocuments: number, earliestDocumentDate: string, latestDocumentDate: string) => {
  const earliestMs = useMemo(() => roundAndToMs(earliestDocumentDate), [earliestDocumentDate]);
  const latestMs = useMemo(() => roundAndToMs(latestDocumentDate), [latestDocumentDate]);

  const commonProps = {
    delay: 200,
    config: config.molasses,
  }
  const {total} = useSpring({
    from: {total: 0},
    total: totalDocuments,
    ...commonProps
  })
  const {earliest} = useSpring({
    from: {earliest: 0},
    earliest: earliestMs,
    ...commonProps
  })
  const {latest} = useSpring({
    from: {latest: 0},
    latest: latestMs,
    ...commonProps
  });

  return {
    total,
    earliest,
    latest
  }
}

interface TextSummaryProps {
  totalDocuments: number,
  earliestDocumentDate: string,
  latestDocumentDate: string
}

const TextSummary = React.forwardRef<HTMLDivElement, TextSummaryProps>((
  {
    totalDocuments,
    earliestDocumentDate,
    latestDocumentDate
  }, forwardedRef) => {
  const classes = useStyles();
  const {
    total,
    earliest,
    latest
  } = useCountUpAnimation(totalDocuments, earliestDocumentDate, latestDocumentDate);

  const title = (value: string) => (
    <Typography
      className={classes.title}
      variant={'body1'}
      component={'h2'}
    >
      {value}
    </Typography>
  );
  const date = (number: SpringValue<number>) => {
    return (
      <Typography variant={'h1'} component={'p'} className={classes.number}>
        <animated.span>
          {
            number.to(n => {
              const dateObj = new Date(n);
              return `${dateObj.getDate()} ${monthStrings[dateObj.getMonth()]}, ${dateObj.getFullYear()}`
            })
          }
        </animated.span>
      </Typography>
    )
  };

  return (
    <FullscreenSection fullHeightOffset={100}>
      <div className={classes.root}>
        <div className={classes.section}>
          {title('Total news articles archived')}
          <Typography variant={'h1'} component={'p'} className={classes.number}>
            <animated.span>
              {
                total.to(n => Math.round(n))
              }
            </animated.span>
          </Typography>
        </div>
        <div className={classes.section}>
          {title('First news article archived')}
          {date(earliest)}
        </div>
        <div className={classes.section}>
          {title('Most recent news article archived')}
          {date(latest)}
        </div>
      </div>
    </FullscreenSection>
  )
});

export default TextSummary
