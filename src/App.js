import React, { useState, useRef } from "react";
import {
  Button,
  Typography,
  Toolbar,
  Container,
  makeStyles,
  withStyles,
  Grid,
  IconButton,
  Slider,
  Tooltip,
} from "@material-ui/core";
import ReactPlayer from "react-player";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import FastForwardIcon from "@material-ui/icons/FastForward";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import screenfull from "screenfull";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SettingsIcon from "@material-ui/icons/Settings";
import MessageIcon from "@material-ui/icons/Message";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles({
  playerWrapper: {
    width: "auto",
    height: "auto",
    paddingTop: "56.25%",
    position: "relative",
  },
  controlsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1,
  },
  controlIcons: {
    color: "#777",
    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },
  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },
  volumeIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },

  volumeSlider: {
    width: 100,
  },
});

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const PrettoSlider = withStyles({
  root: {
    // color: "#52af77",
    height: 6,
  },
  thumb: {
    height: 18,
    width: 18,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 5,
    borderRadius: 4,
  },
  rail: {
    backgroundColor: "#fff",
    height: 5,
    borderRadius: 4,
  },
})(Slider);

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }

  return `${mm}:${ss}`;
};

let count = 0;

function App() {
  const classes = useStyles();
  const [state, setState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
    fullScreen: true,
  });
  const { playing, muted, volume, playbackRate, played, seeking, fullScreen } =
    state;

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };
  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleMuted = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleVolumeChange = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };
  const handleVolumeSeekUp = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const onToggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current);
    screenfull.isFullscreen
      ? setState({ ...state, fullScreen: true })
      : setState({ ...state, fullScreen: false });
  };

  const handleProgress = (changeState) => {
    // console.log(changeState);
    if (count > 3) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility == "visible") {
      count += 1;
    }
    if (!seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  };

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";
  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";
  const elapsedTime = format(currentTime);
  // const totalDuration = format(duration);

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("lg"));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));
  const mobile = useMediaQuery(theme.breakpoints.up("xs"));
  const mediaQuery = useMediaQuery("(max-width:678px)");

  const sizes = () => {
    if (desktop) return "large";
    if (tablet) return "medium";
    if (mobile) return "small";
  };

  const displayBottom = () => {
    if (desktop) return "block";
    if (tablet) return "block";
    if (mobile) return "none";
  };
  const displayMiddle = () => {
    if (desktop) return "none";
    if (tablet) return "none";
    if (mobile) return "flex";
  };
  const displayVolumeSlider = () => {
    if (mediaQuery) return "none";
  };

  return (
    <>
      <Toolbar />
      <Container maxWidth="md">
        <div
          ref={playerContainerRef}
          className={classes.playerWrapper}
          onMouseMove={handleMouseMove}
        >
          <ReactPlayer
            ref={playerRef}
            width={"100%"}
            height={"100%"}
            url="https://www.youtube.com/watch?v=GLGuLXKT9Ng"
            muted={muted}
            playing={playing}
            volume={volume}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          <div className={classes.controlsWrapper} ref={controlsRef}>
            {/* Top Controls */}
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="space-between"
              style={{ padding: 16 }}
            >
              <Grid item>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    marginBottom: -5,
                  }}
                  fontSize={sizes()}
                >
                  Human
                </Typography>
                <Typography
                  variant="p"
                  style={{ color: "#fff" }}
                  fontSize={sizes()}
                >
                  S1 E1 <span>&#183;</span> The Saviour
                </Typography>
              </Grid>
            </Grid>

            {/* middle controls */}

            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
              style={{ display: displayMiddle() }}
            >
              <IconButton
                className={classes.controlIcons}
                aria-label="required"
                onClick={handleRewind}
              >
                <FastRewindIcon fontSize={sizes()} />
              </IconButton>
              <IconButton
                className={classes.controlIcons}
                aria-label="required"
                onClick={handlePlayPause}
              >
                {playing ? (
                  <PauseIcon fontSize={sizes()} />
                ) : (
                  <PlayArrowIcon fontSize={sizes()} />
                )}
              </IconButton>
              <IconButton
                className={classes.controlIcons}
                aria-label="required"
                onClick={handleFastForward}
              >
                <FastForwardIcon fontSize={sizes()} />
              </IconButton>
            </Grid>

            {/* bottom controls */}

            <Grid
              container
              direction="row"
              alignItems="center"
              justify="space-between"
              style={{ padding: 16 }}
            >
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PrettoSlider
                  min={0}
                  max={100}
                  value={played * 100}
                  ValueLabelComponent={(props) => (
                    <ValueLabelComponent {...props} value={elapsedTime} />
                  )}
                  onChange={handleSeekChange}
                  onMouseDown={handleSeekMouseDown}
                  onChangeCommitted={handleSeekMouseUp}
                />
                <Button variant="text" style={{ color: "#fff" }}>
                  <Typography>{elapsedTime}</Typography>
                </Button>
              </Grid>

              <Grid item style={{ display: displayBottom() }}>
                <Grid container alignItems="center" direction="row">
                  <IconButton
                    className={classes.bottomIcons}
                    onClick={handlePlayPause}
                  >
                    {playing ? (
                      <PauseIcon fontSize={sizes()} />
                    ) : (
                      <PlayArrowIcon fontSize={sizes()} />
                    )}
                  </IconButton>

                  <Grid
                    item
                    direction="row"
                    alignItems="center"
                    justify="center"
                  >
                    <IconButton
                      className={classes.controlIcons}
                      aria-label="required"
                      onClick={handleRewind}
                    >
                      <FastRewindIcon fontSize={sizes()} />
                    </IconButton>

                    <IconButton
                      className={classes.controlIcons}
                      aria-label="required"
                      onClick={handleFastForward}
                    >
                      <FastForwardIcon fontSize={sizes()} />
                    </IconButton>
                  </Grid>

                  <IconButton
                    onClick={handleMuted}
                    className={classes.volumeIcons}
                  >
                    {muted ? (
                      <VolumeOffIcon fontSize={sizes()} />
                    ) : (
                      <VolumeUpIcon fontSize={sizes()} />
                    )}
                  </IconButton>
                  <Slider
                    min={0}
                    max={100}
                    value={volume * 100}
                    className={classes.volumeSlider}
                    style={{ display: displayVolumeSlider() }}
                    onChange={handleVolumeChange}
                    onChangeCommitted={handleVolumeSeekUp}
                  />
                </Grid>
              </Grid>
              <Grid item style={{ display: displayBottom() }}>
                <IconButton
                  // onClick={onToggleFullScreen}
                  className={classes.bottomIcons}
                >
                  <SkipNextIcon fontSize={sizes()} />
                  <Typography>Next Episode</Typography>
                </IconButton>
                <IconButton
                  // onClick={onToggleFullScreen}
                  className={classes.bottomIcons}
                >
                  <SettingsIcon fontSize={sizes()} />
                </IconButton>
                <IconButton
                  // onClick={onToggleFullScreen}
                  className={classes.bottomIcons}
                >
                  <MessageIcon fontSize={sizes()} />
                </IconButton>
                <IconButton
                  onClick={onToggleFullScreen}
                  className={classes.bottomIcons}
                >
                  {fullScreen ? (
                    <FullscreenIcon fontSize={sizes()} />
                  ) : (
                    <FullscreenExitIcon fontSize={sizes()} />
                  )}
                </IconButton>
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    </>
  );
}

export default App;
