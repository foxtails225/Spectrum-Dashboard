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
import { options } from './options';
import GanttChart from './GanttChart';
import BandMenus from './BandMenus';
import Spectrum from './Spectrum';
import Content from './Content';
import Alert from './Alert';

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
      Spectrum Dashboard <small>(maintenance version)</small>
    </Typography>
  );
};

const MaintenanceView: FC = () => {
  const [menu, setMenu] = useState(options[3].name);
  const [content, setContent] = useState('');
  const [scope, setScope] = useState('');
  const classes = useStyles();

  const handleScope = (value: string): void => setScope(value);

  const handleMenu = (event: ChangeEvent): void => {
    //@ts-ignore
    setMenu(event.target.value);
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
                <BandMenus menu={menu} onMenu={handleMenu} />
              </Grid>
              <Grid item md={12}>
                <Spectrum
                  scope={scope}
                  menu={menu}
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

export default MaintenanceView;
