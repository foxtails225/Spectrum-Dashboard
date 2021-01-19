import React, { useState, FC, ChangeEvent } from 'react';
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
import GanttChart from './GanttChart';
import SystemMenus from './SystemMenus';
import BandMenus from './BandMenus';
import Spectrum from './Spectrum';
import Content from './Content';
import Alert from './Alert';

interface Status {
  system: string;
  band: string;
}

const initialStatus = {
  system: 'none',
  band: 'none'
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
  const [content, setContent] = useState('');
  const [scope, setScope] = useState('');
  const classes = useStyles();

  const handleScope = (value: string): void => {
    setScope(value);
  };

  const handleChange = (event: ChangeEvent): void => {
    //@ts-ignore
    const { name, value } = event.target;
    setStatus(prevState => ({ ...prevState, [name]: value }));
  };

  const handleContent = (value: string): void => {
    setContent(value);
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
                <BandMenus status={status} onChange={handleChange} />
              </Grid>
              <Grid item md={12}>
                <Spectrum
                  scope={scope}
                  band={status.band}
                  onScope={handleScope}
                  onContent={handleContent}
                />
              </Grid>
              <Grid item md={12} className={classes.content}>
                {content && content !== '' && <Content content={content} />}
              </Grid>
              <Grid item md={12}>
                <GanttChart scope={scope} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
      <Alert />
    </div>
  );
};

export default HomeView;
