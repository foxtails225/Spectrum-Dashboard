import React, { FC, useState } from 'react';
import {
  Box,
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
    padding: theme.spacing(6),
    backgroundColor: '#444'
  },
  content: {
    backgroundColor: colors.grey[50]
  },
  footer: {
    padding: theme.spacing(3),
    backgroundColor: colors.grey[300]
  }
}));

const HomeView: FC = () => {
  const classes = useStyles();
  const [status, setStatus] = useState<Status>(initialStatus);

  const handleChange = (name: string, value: string): void => {
    setStatus(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Card className={classes.card}>
          <CardHeader
            className={classes.header}
            title={
              <Typography component="header" variant="h5">
                Spectrum Viewer
              </Typography>
            }
          />
          <CardContent className={classes.cardContent}>
            <Box py={3}>
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
            </Box>
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
    </div>
  );
};

export default HomeView;
