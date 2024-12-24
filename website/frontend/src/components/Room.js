import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room() {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => response.json())
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
        if (data.is_host) {
          console.log("here");
          authenticateSpotify();
        }
        getCurrentSong();
      });
  }, [roomCode]);

  useEffect(() => {
    let interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, []);

  function authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  const updateRoomDetails = (newGuestCanPause, newVotesToSkip) => {
    setGuestCanPause(newGuestCanPause);
    setVotesToSkip(newVotesToSkip);
  };

  const LeaveRoomButton = () => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions)
      .then((response) => response.json())
      .then(() => navigate("/join"))
      .catch((error) => console.error("Error:", error));
  };

  function getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => setSong(data));
  }

  function renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            roomCode={roomCode}
            guestCanPause={guestCanPause}
            votesToSkip={votesToSkip}
            onRoomUpdated={updateRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setShowSettings(false);
            }}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  if (showSettings) {
    return renderSettings();
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h2" variant="h2">
          {roomCode}
        </Typography>
      </Grid>
      <MusicPlayer song={song} />
      <Grid item xs={12} align="center">
        <Typography component="h6" variant="h6">
          {" "}
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h6" variant="h6">
          {" "}
          Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h6" variant="h6">
          {" "}
          Host: {isHost.toString()}
        </Typography>
      </Grid>
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="outlined" onClick={LeaveRoomButton}>
          Exit Room
        </Button>
      </Grid>
    </Grid>
  );
}

export default Room;
