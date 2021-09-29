import React from "react";
import {Avatar, Box, Chip, Grid, Link} from "@material-ui/core";

function Attribution() {
  return (
    <Box m={2}>
      <Grid container direction={'row'} spacing={2}>
        <Grid item>
          <Link href={'https://www.xiaoxihome.com/'} target={'_blank'} rel="noopener" underline={"none"}>
            <Chip
              avatar={<Avatar>X</Avatar>}
              label="🔧 with ❤️ by XiaoxiHome"
              color="primary"
              clickable
            />
          </Link>
        </Grid>
        <Grid item>
          <Link href={'https://newsapi.org/'} target={'_blank'} rel="noopener" underline={"none"}>
            <Chip
              avatar={<Avatar>N</Avatar>}
              label="News data courtesy of NewsAPI.org"
              color="secondary"
              clickable
            />
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Attribution;
