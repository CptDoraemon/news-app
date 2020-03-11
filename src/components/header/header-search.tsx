import React, {useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

interface HeaderSearchProps {
    search: (keyword: string) => void
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({search}) => {

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

    const handleSubmit = () => {
        if (!input.length) setIsEmpty(true);
        search(input);
        handleClose();
    };

    return (
        <div>
            <IconButton aria-label="search" color={"inherit"} onClick={handleClickOpen}>
                <SearchIcon/>
            </IconButton>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle style={{minWidth: '50vw'}}>Search from archived news</DialogTitle>
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
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Search
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

export default HeaderSearch