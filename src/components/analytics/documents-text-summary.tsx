import React, {useMemo} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {bigNumber, bigNumberTitle} from "./styles/analytics-styles";
import {useSpring, animated, config, SpringValue} from '@react-spring/web';

const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    width: '100%',
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
    ...bigNumberTitle(theme)
  },
  number: {
    ...bigNumber(theme)
  }
}));

const useCountUpAnimation = (totalDocuments: number, earliestDocumentDate: string, latestDocumentDate: string) => {
  const earliestMs = useMemo(() => new Date(earliestDocumentDate).getTime(), [earliestDocumentDate]);
  const latestMs = useMemo(() => new Date(latestDocumentDate).getTime(), [latestDocumentDate]);

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

interface DocumentsTextSummaryProps {
  totalDocuments: number,
  earliestDocumentDate: string,
  latestDocumentDate: string
}

const DocumentsTextSummary = React.forwardRef<HTMLDivElement, DocumentsTextSummaryProps>(({
                                                                                            totalDocuments,
                                                                                            earliestDocumentDate,
                                                                                            latestDocumentDate
                                                                                          }, forwardedRef) => {
  const classes = useStyles();
  const fullHeight = useMemo(() => window.innerHeight - 100, []);
  const {
    total,
    earliest,
    latest
  } = useCountUpAnimation(totalDocuments, earliestDocumentDate, latestDocumentDate);

  const title = (value: string) => (
    <h2 className={classes.title}>{value}</h2>
  );
  const date = (number: SpringValue<number>) => {
    return (
      <animated.p className={classes.number}>{number.to(n => {
        const dateObj = new Date(n);
        return `${dateObj.getUTCDate()} ${monthStrings[dateObj.getUTCMonth()]}, ${dateObj.getUTCFullYear()}`
      })}</animated.p>
    )
  };

  return (
    <>
      <div className={classes.root} style={{minHeight: `${fullHeight}px`}}>
        <div className={classes.section}>
          {title('Total news articles archived')}
          <animated.p className={classes.number}>{total.to(n => Math.round(n))}</animated.p>
        </div>
        <div className={classes.section}>
          {title('First news article archived')}
          {date(earliest)}
        </div>
        <div className={classes.section}>
          {title('Most recent news article archived')}
          {date(latest)}
        </div>
        <div ref={forwardedRef}></div>
      </div>
    </>
  )
});

export default DocumentsTextSummary
