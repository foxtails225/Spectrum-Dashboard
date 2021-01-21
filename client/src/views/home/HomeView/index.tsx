import React, { useState, FC } from 'react';
import {
  Grid,
  Container,
  CssBaseline,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Link,
  Typography,
  makeStyles,
  Theme,
  colors
} from '@material-ui/core';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
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
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: colors.grey[100],
    boxShadow: theme.shadows[10]
  },
  header: {
    color: colors.grey[50],
    backgroundColor: colors.blue[700]
  },
  cardContent: {
    paddingTop: theme.spacing(3),
    padding: theme.spacing(6)
  },
  content: {
    backgroundColor: colors.grey[50]
  },
  footer: {
    padding: theme.spacing(3),
    backgroundColor: colors.grey[300]
  }
}));

const Header: FC = () => {
  return (
    <Typography component="header" variant="h5">
      Commercial Operational Spectrum Snapshot
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
          <CardHeader className={classes.header} title={<Header />} />
          <CardContent className={classes.cardContent}>
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
          </CardContent>
          <CardActions className={classes.footer}>
            <ImportantDevicesIcon color="primary" />
            <Typography component="footer" variant="body2">
              For more information of spectrum licensing requirements for using
              a commercial system, go to{' '}
              <Link href="http://spectrum.gov" target="_blank">
                http://spectrum.gov
              </Link>
            </Typography>
          </CardActions>
        </Card>
      </Container>
      <Alert />
    </div>
  );
};

export default HomeView;
