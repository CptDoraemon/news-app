import React from "react";
import {alpha, Button, CircularProgress, makeStyles, TextField} from "@material-ui/core";
import useSearch from "./useSearch";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {MOBILE} from "../../theme";

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
	  width: '10ch',
    height: 40,
	  '&:disabled': {
	    backgroundColor: alpha(theme.palette.secondary.main, 0.3)
    }
  }
}));

interface SearchInputProps {
  search: ReturnType<typeof useSearch>
}

const SearchInput = ({search}: SearchInputProps) => {
  const classes = useStyles();
  const disabled = search.requestState.isLoading;

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
            size={'small'}
            fullWidth={true}
            disabled={disabled}
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
        </MuiPickersUtilsProvider>
      </div>
    </form>
  )
};

export default SearchInput
