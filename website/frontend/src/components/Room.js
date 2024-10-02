import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

export default class Room extends Component{
    constructor(props){
        super(props);
        this.state = {
            votesToSkip:2,
            guestCanPause:false,
            isHost:false,
        };
        this.roomCode = props.roomCode;
        this.getRoomDetails;
    }

    getRoomDetails(){
        fetch('/api/get-room'+'?code='+this.roomCode)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    votesToSkip:data.votes_to_skip,
                    guestCanPause:data.guest_can_pause,
                    isHost:data.is_host
                });
            });

    }

    render(){
        return (
        <div>
            <h3>{this.roomCode}</h3>
            <p> Votes: {this.state.votesToSkip}</p>
            <p> pause: {this.state.guestCanPause.toString()}</p>
            <p> Host: {this.state.isHost.toString()}</p>
        </div>
        );
    }
}

// Functional wrapper to get the roomCode from URL
const RoomWrapper = () => {
    const { roomCode } = useParams();  
    return <Room roomCode={roomCode} />;  // Pass roomCode as a prop to Room component
};

// You can export RoomWrapper as the main export, or directly import RoomWrapper in your router
export { RoomWrapper };