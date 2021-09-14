import React, {useMemo} from "react";
import {makeStyles, useMediaQuery, useTheme} from "@material-ui/core";
import {MOBILE} from "../../../theme/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    [MOBILE(theme)]: {
      padding: theme.spacing(4, 0)
    }
  }
}));

interface AnalyticsSectionProps {
  children: JSX.Element,
  fullHeightOffset?: number
}

const FullscreenSection = React.forwardRef<HTMLDivElement, AnalyticsSectionProps>(({fullHeightOffset, children}, ref) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(MOBILE(theme));
  const height = useMemo(() => {
    if (isMobile) {
      return 'auto'
    }

    const max = 1440;
    const min = 900;
    const headerHeight = fullHeightOffset || 50;
    return Math.min(max, Math.max(min, window.innerHeight)) - headerHeight;
  }, [fullHeightOffset, isMobile]);

  return (
    <div className={classes.root} style={{height}} ref={ref}>
      {children}
    </div>
  )
})

export default FullscreenSection
