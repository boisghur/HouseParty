import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Collapse } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";

function CreateRoomPage(props) {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  console.log(props.update);
  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value);
  };

  function renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  }

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch("/api/create", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate(`/room/${data.code}`));
  };

  const handleUpdateButtonPressed = () => {
    console.log("roomCode: " + props.roomCode);
    const roomCode = props.roomCode || "";
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        setSuccessMsg("Room Updated Successfully");
        if (props.onRoomUpdated) {
          props.onRoomUpdated(guestCanPause, votesToSkip);
        }
      } else {
        setErrorMsg("Error: Room Update Unsuccessful");
      }
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg != "" || successMsg != ""}>
          {successMsg != "" ? (
            <Alert severity="success">{successMsg}</Alert>
          ) : (
            <Alert severity="error">{errorMsg}</Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {props.update ? "Update Room" : "Create Room"}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={
              props.guestCanPause
                ? props.guestCanPause.toString()
                : guestCanPause.toString()
            }
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={props.votesToSkip ? props.votesToSkip : votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}

export default CreateRoomPage;
