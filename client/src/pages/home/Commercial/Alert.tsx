import React, { forwardRef, ReactElement, Ref, FC } from 'react';
import {
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Slide,
  useMediaQuery,
  makeStyles,
  Theme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  content: {
    marginBottom: theme.spacing(6)
  }
}));

const Alert: FC = () => {
  const matches = useMediaQuery('(max-width: 1000px)');
  const classes = useStyles();

  return (
    <Dialog open={matches} TransitionComponent={Transition} keepMounted>
      <CssBaseline />
      <DialogTitle>Screen Resolution Alert</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.content}>
          Your screen resolution is under 1024 x 768. We can't confirm your
          resolution of this Spectrum Chart. Please Check your screen mode
          again.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default Alert;
