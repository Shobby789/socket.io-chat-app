import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container, Card } from "react-bootstrap";

export default function Chat({ socket, username, room, handleLogout }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messageRef = useRef(null);

  useEffect(() => {
    messageList?.msg?.scrollIntoView({ behavior: "smooth" });
  }, [messageList.msg]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <Container className="container-fluid px-0 vh-100 d-flex align-items-center justify-content-center">
      <Container className="chat-Box h-100 rounded px-0">
        <Container className="chat-header rounded-top pt-0 px-3 d-flex align-items-center justify-content-between">
          <Card.Header as={"h6"} className="fw-bold ">
            {username}
          </Card.Header>
          <Button size="sm" variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Container>
        <Container className="chat-body px-0 d-flex flex-column justify-content-start align-items-center">
          {messageList.map((msg) => {
            return (
              <div
                ref={messageRef}
                className={
                  username === msg.author
                    ? "myMsg align-self-end me-2 text-dark my-2"
                    : "msgBox align-self-start ms-2 text-dark my-2"
                }
              >
                <div>
                  <p className="my-0 fw-lighter" style={{ fontSize: "0.8rem" }}>
                    {msg.author}
                  </p>
                  <p className="my-1 fs-6">{msg.message}</p>
                  <p className="my-0 fw-lighter" style={{ fontSize: "0.8rem" }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}
        </Container>
        <Container className="chat-footer border-top px-1">
          <Form.Control
            type="text"
            className="border px-3 py-2 me-1 rounded-pill outline-none"
            placeholder="Type a message here..."
            value={currentMessage}
            autoComplete="off"
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <Button
            variant=""
            className="px-3 rounded-pill py-2 px-2"
            onClick={() => sendMessage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-send-fill"
              viewBox="0 0 16 16"
            >
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
            </svg>
          </Button>
        </Container>
      </Container>
    </Container>
  );
}
