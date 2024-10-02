import React, { Component } from "react";
import { 
    BrowserRouter as Router,
    Routes, 
    Route
} from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { RoomWrapper } from "./Room";

export default class HomePage extends Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
        <Router>
            <Routes>
                <Route path="/"
                    element={<p>This is the Home Page</p>}
                />
                <Route path="/join" element={<RoomJoinPage/>}/>
                <Route path="/create" element={<CreateRoomPage/>}/>
                <Route path="/room/:roomCode" element={<RoomWrapper/>}/>
            </Routes>
        </Router>);
    }
}