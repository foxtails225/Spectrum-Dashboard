import React, { useState, FC } from 'react';
import {
  Grid,
  Container,
  CssBaseline,
  Card,
  CardHeader,
  Typography,
  CardContent,
  makeStyles,
  Theme,
  colors
} from '@material-ui/core';
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
  root: {
    margin: theme.spacing(5)
  },
  card: {
    padding: theme.spacing(2)
  },
  content: {
    backgroundColor: colors.grey[50]
  }
}));

const Header: FC = () => {
  return (
    <Typography component="h1" variant="h5" color="textSecondary">
      Spectrum Dashboard
    </Typography>
  );
};

const HomeView: FC = () => {
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
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Card className={classes.card}>
          <CardHeader title={<Header />} />
          <CardContent>
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
              <Grid item md={12} className={classes.content}>
                {content && content !== '' && <Content content={content} />}
              </Grid>
              <Grid item md={12}>
                <SystemGantt scope={status.scope} band={status.band} />
              </Grid>
              {/* <Grid item md={12}>
                <UserGantt scope={status.scope} band={status.band} />
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>
      </Container>
      <Alert />
    </div>
  );
};

export default HomeView;
