import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CssBaseline,
  makeStyles,
  Theme
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  card: {
    marginTop: '10vh',
    minWidth: '30vw',
    padding: theme.spacing(3)
  },
  link: {
    paddingRight: theme.spacing(2),
    color: '#3385ff',
    textDecoration: 'none'
  }
}));

const Header: FC = () => {
  return (
    <Typography component="h1" variant="h5">
      404 | Page not found :(
    </Typography>
  );
};

const NoMatch: FC = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Card className={classes.card}>
        <CardHeader title={<Header />} />
        <CardContent>
          Maybe the page you are looking for has been removed, or you typed in
          the wrong URL
        </CardContent>
        <Link to="/" className={classes.link}>{`Back To Home`}</Link>
      </Card>
    </Container>
  );
};

export default NoMatch;
