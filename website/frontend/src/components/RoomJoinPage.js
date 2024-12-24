import React, { useState } from "react";
import { Button, Grid, Typography, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleRoomCodeChange = (e) => {
    if (e.target.value.length > 0) {
      setRoomCode(e.target.value);
    } else {
      setRoomCode(null);
    }
  };

  const joinButtonPressed = (e) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: roomCode,
      }),
    };
    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          navigate(`/room/${roomCode}`);
        } else if (response.status === 400) {
          setError("Enter Room Code");
        } else {
          setError("Room Not Found!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={error}
          label="Code"
          placeholder="Enter Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={handleRoomCodeChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={joinButtonPressed}
        >
          Join
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="outlined"
          color="Secondary"
          size="small"
          to="/"
          component={Link}
        >
          Back
        </Button>
      </Grid>
    </Grid>
  );
}

export default RoomJoinPage;
