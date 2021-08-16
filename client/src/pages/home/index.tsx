import React, { FC, useState, ChangeEvent } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  Link,
  Typography,
  makeStyles,
  Theme,
  colors
} from '@material-ui/core';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import Commercial from './Commercial';
import Lunar from './Lunar';

const tabs = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'lunar', label: 'Lunar' },
];

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

const HomeView: FC = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState<string>('lunar');

  const handleTabsChange = (event: ChangeEvent, value: string): void => {
    setCurrentTab(value);
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
                {currentTab === 'commercial'
                  ? 'Commercial Operational Spectrum Snapshot'
                  : 'Spectrum Viewer'}
              </Typography>
            }
          />
          <CardContent className={classes.cardContent}>
            <Box>
              <Tabs
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabsChange}
                value={currentTab}
              >
                {tabs.map(tab => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
            </Box>
            <Box py={3}>
              {currentTab === 'lunar' && <Lunar />}
              {currentTab === 'commercial' && <Commercial />}
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
