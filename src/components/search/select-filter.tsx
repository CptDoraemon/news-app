import React, {useRef, useState} from "react";
import {FormControl, InputLabel, makeStyles, MenuItem, OutlinedInput, Select, useMediaQuery} from "@material-ui/core";
import useSelectFilter from "./use-search/use-select-filter";
import {useTheme} from "@material-ui/core/styles";
import {MOBILE} from "../../theme/theme";
import {useMount} from "react-use";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 150,
    position: 'relative'
  },
  menuItem: {
    textTransform: 'capitalize'
  },
  label: {
    textTransform: 'capitalize'
  },
  select: {
    textTransform: 'capitalize'
  }
}));

interface SelectFilterProps {
  label: string,
  data: ReturnType<typeof useSelectFilter>
}

const SelectFilter = ({label, data}: SelectFilterProps) => {
  const classes = useStyles();
  const anchorRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(MOBILE(theme));

  const [mounted, setMounted] = useState(false);
  useMount(() => setMounted(true))

  return (
    <FormControl variant={'outlined'} className={classes.root} size={'small'} ref={anchorRef}>
      {
        mounted &&
        <>
          <InputLabel id={`${label}-select-label`} className={classes.label}>{label}</InputLabel>
          <Select
            labelId={`${label}-select-label`}
            id={`${label}-select`}
            value={data.value}
            onChange={data.handleChange}
            native={isMobile}
            input={<OutlinedInput notched label={label}/>}
            MenuProps={{
              anchorEl: anchorRef.current,
              getContentAnchorEl: null,
              anchorOrigin: {vertical: "bottom", horizontal: "left"},
              transformOrigin: {vertical: "top", horizontal: "left"},
            }}
            classes={{
              select: classes.select,
            }}
          >
            {
              data.options.map(option => (
                React.createElement(isMobile ? 'option' : MenuItem, {
                  value: option.key,
                  key: option.key,
                  classes: {root: classes.menuItem},
                  children: option.displayName
                })
              ))
            }
          </Select>
        </>
      }
    </FormControl>
  )
};

export default SelectFilter
