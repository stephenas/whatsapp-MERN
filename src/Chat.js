import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import EmojiEmotionsOutlinedIcon from "@material-ui/icons/EmojiEmotionsOutlined";
import MicOutlinedIcon from "@material-ui/icons/MicOutlined";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import { useParams } from "react-router-dom";
import db from "./firebase";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";

function Chat() {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  console.log("Room Id - ", roomId);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [roomId]);

  const sendMessage = (event) => {
    event.preventDefault();
    console.log("You typed - ", input);
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    /*await axios.post("/messages/new", {
      name: "Steve",
      messages: input,
      timestamp: "now",
      received: false,
    });*/
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__messages ${
              message.name === user.displayName && "chat__receiver"
            }`}
          >
            {console.log(message.name + "-" + user.displayName)}
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}

        {/* <p className="chat__messages chat__receiver">
          <span className="chat__name">steve</span>
          here Messages
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p> */}
      </div>
      <div className="chat__footer">
        <IconButton>
          <EmojiEmotionsOutlinedIcon />
        </IconButton>

        <IconButton>
          <AttachFileOutlinedIcon />
        </IconButton>

        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send message
          </button>
        </form>
        {/* <IconButton
          onClick={sendMessage}
          type="submit"
          className="chat__send chat__send__active"
        >
          <SendIcon />
        </IconButton> */}
        <IconButton className="chat__record">
          <MicOutlinedIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
