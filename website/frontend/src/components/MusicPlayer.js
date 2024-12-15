import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import PauseIcon from "@material-ui/icons/Pause";

function MusicPlayer(props) {
  const songProgress = (props.song.time / props.song.duration) * 100;

  function pauseSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/pause", requestOptions);
  }

  function playSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/play", requestOptions);
  }

  function skipSong() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/skip", requestOptions);
  }

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={props.song.image_url} height="100%" width="100%" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {props.song.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props.song.artist}
          </Typography>
          <div>
            <IconButton
              onClick={() => {
                props.song.is_playing ? pauseSong() : playSong();
              }}
            >
              {props.song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={() => skipSong()}>
              <SkipNextIcon />
              {props.song.votes} / {props.song.votes_required}
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
}

export default MusicPlayer;
