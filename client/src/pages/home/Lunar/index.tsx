import React, { useState, FC } from 'react';
import { Grid, makeStyles, Theme, colors } from '@material-ui/core';
import SystemGantt from './SystemGantt';
import LinkMenus from './LinkMenus';
import BandMenus from './BandMenus';
import Alert from './Alert';

interface Status {
  band: string;
  link: string;
}

const initialStatus = {
  band: 'none',
  link: 'none'
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  content: {
    backgroundColor: colors.grey[50]
  }
}));

const Lunar: FC = () => {
  const classes = useStyles();
  const [status, setStatus] = useState<Status>(initialStatus);

  const handleChange = (name: string, value: string): void => {
    setStatus(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className={classes.root}>
      <Grid container alignItems="center" spacing={3}>
        <Grid item md={3}>
          <BandMenus status={status} onChange={handleChange} />
        </Grid>
        <Grid item md={3}>
          <LinkMenus status={status} onChange={handleChange} />
        </Grid>
        <Grid item md={12}>
          <SystemGantt status={status} />
        </Grid>
      </Grid>
      <Alert />
    </div>
  );
};

export default Lunar;
