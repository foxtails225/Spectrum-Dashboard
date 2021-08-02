import React, { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, Typography, Box, makeStyles, Theme } from '@material-ui/core';
interface ContentProps {
  className?: string;
  content: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

const Content: FC<ContentProps> = ({ className, content }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={clsx(className, classes.root)}
    >
      <Grid item md={4}>
        <Typography variant="h6" component="strong">
          Regulatory Notes
        </Typography>
      </Grid>
      <Grid item md={8} />
      <Grid item md={12}>
        <Box borderColor="primary.main" border={2} borderRadius={5} padding={2}>
          <Typography variant="body2">{content}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string.isRequired
};

export default Content;
