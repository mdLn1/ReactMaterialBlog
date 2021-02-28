import React from "react";
import socketio from "socket.io-client";
import { API_URL } from "../../AppSettings";

export const socket = socketio.connect(API_URL);
export const SocketContext = React.createContext();
