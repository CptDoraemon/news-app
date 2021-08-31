import React, {useMemo} from "react";
import {AppBar, makeStyles, Tab, Tabs, Link as MuiLink} from "@material-ui/core";
import {Link, useLocation, Redirect} from 'react-router-dom';
import {newsCategories} from "./news-categories";
import * as queryString from "query-string";

const useStyles = makeStyles((theme) => ({
	tab: {
		flexShrink: 0,
		flexGrow: 1,
		color: theme.palette.primary.contrastText
	},
	appBarBottomBoxShadow: {
		boxShadow: '0px 4px 4px -1px rgba(0,0,0,0.2), 0px 5px 5px 0px rgba(0,0,0,0.14), 0px 10px 10px 0px rgba(0,0,0,0.12)'
	},
}));

interface HeaderTabsProps {}

const HeaderTabs = () => {
  const classes = useStyles();
	const location = useLocation();
	const category = useMemo(() => {
		const qs = queryString.parse(location.search);
		return !qs.category ? '' : Array.isArray(qs.category) ? qs.category[0] : qs.category;
	}, [location.search])

  // if (!category || !(newsCategories as string[]).includes(category)) {
	// 	return <Redirect to={`/?category=${newsCategories[0]}`} />
	// }

  return (
		<AppBar color="primary" position={'static'} className={classes.appBarBottomBoxShadow}>
			<Tabs
				value={(newsCategories as string[]).indexOf(category)}
				indicatorColor="secondary"
				textColor="secondary"
				variant="scrollable"
				scrollButtons="auto"
			>
				{
					newsCategories.map((category, i) =>
						<Tab
							label={category}
							key={category}
							className={classes.tab}
							component={Link}
							to={`/?category=${category}`}
						/>)
				}
			</Tabs>
		</AppBar>
  )
};

export default HeaderTabs
