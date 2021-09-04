import React from "react";
import {alpha, Button, CircularProgress, makeStyles, Select, TextField, useMediaQuery} from "@material-ui/core";
import useSearch from "./use-search/use-search";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {MOBILE} from "../../theme";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
	  width: '100%',
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(-1),
    [MOBILE(theme)]: {
      margin: theme.spacing(-0.5),
    },
    '& > div': {
      margin: theme.spacing(1),
      [MOBILE(theme)]: {
        margin: theme.spacing(0.5),
      }
    },
    '& div:first-child': {
      flex: '1 1 auto'
    },
    '& div:last-child': {
      flex: '0 0 auto'
    }
  },
  inputLabel: {
	  display: 'none'
  },
  filterRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: theme.spacing(-1),
    [MOBILE(theme)]: {
      margin: theme.spacing(-0.5),
    },
    '& > div': {
      margin: theme.spacing(1),
      [MOBILE(theme)]: {
        margin: theme.spacing(0.5),
      }
    },
  },
  submitButton: {
	  width: '12ch',
    fontSize: theme.typography.h6.fontSize,
    height: 56,
    fontWeight: 700,
	  '&:disabled': {
	    backgroundColor: alpha(theme.palette.secondary.main, 0.3)
    },
    [MOBILE(theme)]: {
      width: '10ch',
      height: 40,
      fontSize: theme.typography.body2.fontSize,
    }
  }
}));

interface SearchInputProps {
  search: ReturnType<typeof useSearch>
}

const SearchInput = ({search}: SearchInputProps) => {
  const classes = useStyles();
  const disabled = search.requestState.isLoading;
  const theme = useTheme();
  const isMobile = useMediaQuery(MOBILE(theme));

  return (
    <form className={classes.root} onSubmit={search.submitSearch}>
      <div className={classes.inputRow}>
        <div>
          <TextField
            value={search.keyword}
            onChange={search.handleKeywordChange}
            id={'news-search-text-field'}
            label={'Keyword'}
            variant={'outlined'}
            InputLabelProps={{ shrink: false, classes: {root: classes.inputLabel} }}
            size={isMobile ? 'small' : 'medium'}
            fullWidth={true}
            disabled={disabled}
            type={'search'}
          />
        </div>
        <div>
          <Button
            variant={'contained'}
            disableElevation
            color={'secondary'}
            type={'submit'}
            disabled={disabled}
            className={classes.submitButton}
          >
            {
              disabled ?
                <CircularProgress size={15} /> :
                'Search'
            }
          </Button>
        </div>
      </div>
      <div className={classes.filterRow}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div>
            <KeyboardDatePicker
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-start-date"
              label="Start Date"
              value={search.startDate}
              onChange={search.handleStartDateChange}
              disableFuture
              inputVariant={'outlined'}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              disabled={disabled}
            />
          </div>
          <div>
            <KeyboardDatePicker
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-end-date"
              label="End Date"
              value={search.endDate}
              onChange={search.handleEndDateChange}
              disableFuture
              inputVariant={'outlined'}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              disabled={disabled}
            />
          </div>
          <div>
            <Select />
          </div>
        </MuiPickersUtilsProvider>
      </div>
    </form>
  )
};

export default SearchInput
