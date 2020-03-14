import React, {FormEvent, useEffect, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Tooltip} from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles(theme => ({
    dialog: {
        minWidth: '50vw'
    }
}));

interface HeaderSearchProps {
    search: (keyword: string) => void
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({search}) => {

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setInput('');
        setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isEmpty) setIsEmpty(false);
        setInput(e.target.value)
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.length) {
            setIsEmpty(true);
        } else {
            search(input);
            handleClose();
        }
    };

    return (
        <div>
            <Tooltip title="Search" TransitionComponent={Zoom}>
                <IconButton aria-label="search" color={"inherit"} onClick={handleClickOpen}>
                    <SearchIcon/>
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
                <form action='/' onSubmit={handleSubmit}>
                    <DialogTitle>Search from archived news</DialogTitle>
                    <DialogContent>
                        <TextField
                            error={isEmpty}
                            autoFocus
                            margin="dense"
                            label="Keywords"
                            type="news keyword"
                            fullWidth
                            value={input}
                            onChange={handleInputChange}
                            helperText={isEmpty ? 'Keyword cannot be empty.' : ' '}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" aria-label='cancel'>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" aria-label='submit search'>
                            Search
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
};

export default HeaderSearch