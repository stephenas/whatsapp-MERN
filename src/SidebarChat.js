import React from "react";
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";

function SidebarChat() {
  return (
    <div className="sidebarChat">
      <Avatar />
      <div className="sidebarChat__info">
        <h3>here Name</h3>
        <p>here is the last message </p>
      </div>
    </div>
  );
}

export default SidebarChat;
