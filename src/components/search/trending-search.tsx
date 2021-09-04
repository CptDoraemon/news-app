import React from "react";
import {Button, makeStyles, Typography, Link as MuiLink} from "@material-ui/core";
import WhatshotIcon from '@material-ui/icons/Whatshot';
import {MOBILE} from "../../theme";
import {Link} from "react-router-dom";
import routers from "../../routers";
import PaperWrapper from "./paper-wrapper";

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexWrap: 'wrap'
	},
	title: {
		fontWeight: 700,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingRight: '1ch',
		[MOBILE(theme)]: {
			flex: '1 0 100%',
			marginBottom: theme.spacing(1)
		}
	},
	buttonWrapper: {
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexWrap: 'wrap',
		margin: theme.spacing(-1),
		[MOBILE(theme)]: {
			justifyContent: 'center',
		}
	},
	button: {
		margin: theme.spacing(1),
		textTransform: 'none',
		backgroundColor: '#ddd',
		'&:hover, &:focus': {
			backgroundColor: '#f57c00',
			color: '#fff'
		}
	}
}));

interface TrendingSearchProps {}

const TrendingSearch = () => {
  const classes = useStyles();

  return (
  	<PaperWrapper>
			<div className={classes.root}>
				<Typography variant={'body1'} component={'div'} className={classes.title}>
					<WhatshotIcon style={{color: '#f57c00'}}/>
					<span>Trending Searches: </span>
				</Typography>

				<div className={classes.buttonWrapper}>
					{
						['hot1', 'hot2', 'hot3'].map(_ => (
							// <Button className={classes.button} component={<MuiLink component={Link} to={`${routers.search.path}?keyword=${_}`} />}>
							// 	{_}
							// </Button>
							<MuiLink className={classes.button} component={Link} to={`${routers.search.path}?keyword=${_}`}>
								{_}
							</MuiLink>
						))
					}
				</div>
			</div>
		</PaperWrapper>
  )
};

export default TrendingSearch
