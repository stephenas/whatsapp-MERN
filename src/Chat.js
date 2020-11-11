import React from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";

function Chat() {
  return (
    <div className="chat">
      <dic className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>Name</h3>
          <p>last seen at ...</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileOutlinedIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </dic>
    </div>
  );
}

export default Chat;
