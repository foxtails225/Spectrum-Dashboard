import React, { useState, FC } from 'react';
import { Grid, makeStyles, Theme, colors } from '@material-ui/core';
import SystemGantt from './SystemGantt';
import UserGantt from './UserGantt';
import SystemMenus from './SystemMenus';
import BandMenus from './BandMenus';
import Spectrum from './Spectrum';
import Content from './Content';
import Alert from './Alert';

interface Status {
  system: string;
  band: string;
  scope: number | null;
}

const initialStatus = {
  system: 'none',
  band: 'none',
  scope: null
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  content: {
    backgroundColor: colors.grey[50]
  }
}));

const Commercial: FC = () => {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [uids, setUids] = useState<number[]>([]);
  const [content, setContent] = useState('');
  const classes = useStyles();

  const handleChange = (name: string, value: string): void => {
    setStatus(prevState => ({ ...prevState, [name]: value }));
  };

  const handleContent = (value: string): void => {
    setContent(value);
  };

  const handleUids = (value: number[]) => {
    setUids(value);
  };

  return (
    <div className={classes.root}>
      <Grid container alignItems="center" spacing={3}>
        <Grid item md={3}>
          <SystemMenus system={status.system} onChange={handleChange} />
        </Grid>
        <Grid item md={3}>
          <BandMenus
            status={status}
            onChange={handleChange}
            onUids={handleUids}
          />
        </Grid>
        <Grid item md={12}>
          <Spectrum
            uids={uids}
            status={status}
            onChange={handleChange}
            onContent={handleContent}
          />
        </Grid>
        {content && content !== '' && (
          <Grid item md={12} className={classes.content}>
            <Content content={content} />
          </Grid>
        )}
        <Grid item md={12}>
          <SystemGantt status={status} />
        </Grid>
        <Grid item md={12}>
          <UserGantt scope={status.scope} system={status.system} />
        </Grid>
      </Grid>
      <Alert />
    </div>
  );
};

export default Commercial;
