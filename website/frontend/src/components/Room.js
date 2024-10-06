import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";

function Room() {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => response.json())
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      });
  }, [roomCode]);

  const LeaveRoomButton = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions)
      .then((response) => response.json())
      .then(() => navigate("/join"))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <h3>{roomCode}</h3>
      <p> Votes: {votesToSkip}</p>
      <p> Pause: {guestCanPause.toString()}</p>
      <p> Host: {isHost.toString()}</p>
      <Button color="secondary" variant="outlined" onClick={LeaveRoomButton}>
        Exit Room
      </Button>
    </div>
  );
}

export default Room;
