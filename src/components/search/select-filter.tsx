import React, {useRef} from "react";
import {FormControl, InputLabel, makeStyles, MenuItem, OutlinedInput, Select, useMediaQuery} from "@material-ui/core";
import useSelectFilter from "./use-search/use-select-filter";
import {useTheme} from "@material-ui/core/styles";
import {MOBILE} from "../../theme";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: 150
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
	const theme = useTheme();
	const isMobile = useMediaQuery(MOBILE(theme));
	const anchorEl = useRef<HTMLDivElement>(null);

  return (
		<FormControl variant={'outlined'} ref={anchorEl} className={classes.root} size={'small'}>
			<InputLabel id={`${label}-select-label`} className={classes.label}>{label}</InputLabel>
			<Select
				labelId={`${label}-select-label`}
				id={`${label}-select`}
				value={data.value}
				onChange={data.handleChange}
				native={isMobile}
				input={<OutlinedInput notched label={label}/>}
				MenuProps={{
					anchorEl: anchorEl.current,
					getContentAnchorEl: null,
					anchorOrigin: { vertical: "bottom", horizontal: "left" },
					transformOrigin: { vertical: "top", horizontal: "left" },
				}}
				inputProps={{
					shrink: true
				}}
				classes={{
					select: classes.select,
				}}
			>
				{
					data.options.map(option => (
						<MenuItem value={option.key} key={option.key} classes={{root: classes.menuItem}}>{option.displayName}</MenuItem>
					))
				}
			</Select>
		</FormControl>
  )
};

export default SelectFilter
