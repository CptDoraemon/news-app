import React, {useEffect} from "react";
import './header.css'
import {Categories, setCategoryIfNeeded} from "../../redux/actions";
import {Box, Grid} from "@material-ui/core";

interface HeaderProps {
    headers: Array<keyof typeof Categories>,
    dispatch: any
}

// function Header(props: HeaderProps) {
//     return (
//         <div className={'header-wrapper'}>
//             <ul className={'header-list'}>
//                 { props.headers.map((_, i) => <li key={i} onClick={props.dispatch(setCategoryIfNeeded(Categories[_]))}>{ _ }</li>)}
//             </ul>
//         </div>
//     )
// }

function Header(props: HeaderProps) {
    return (
        <Box width={1} height={'50px'}>
            <Grid container direction={"row"} wrap={"nowrap"} alignContent={"center"} justify={"center"} spacing={2}>
                { props.headers.map((_, i) => {
                    return (
                        <Grid item key={i} onClick={props.dispatch(() => setCategoryIfNeeded(Categories[_]))}>
                            <Box fontWeight={700} fontSize={'h5.fontSize'} padding={2}>
                                { _ }
                            </Box>
                        </Grid>
                        )
                })}
            </Grid>
        </Box>
    )
}

export default Header;