import React, {useMemo} from "react";
import {makeStyles, useMediaQuery, useTheme} from "@material-ui/core";
import {MOBILE} from "../../../theme/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));

interface AnalyticsSectionProps {
  children: JSX.Element,
  fullHeightOffset?: number
}

const FullscreenSection = ({fullHeightOffset, children}: AnalyticsSectionProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(MOBILE(theme));
  const height = useMemo(() => {
    const max = 1440;
    const min = 900;
    const headerHeight = fullHeightOffset || 50;
    return Math.min(max, Math.max(min, window.innerHeight)) - headerHeight;
  }, [fullHeightOffset]);

  return (
    <div className={classes.root} style={{height}}>
      {children}
    </div>
  )
};

export default FullscreenSection
