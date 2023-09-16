import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import Chat from "./components/Chat";
import { Container, Card } from "react-bootstrap";

const socket = io.connect("http://localhost:2000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showRoomCredentials, setShowRoomCredentials] = useState(true);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowRoomCredentials(false);
      setShowChat(true);
    }
  };

  const handleLogout = () => {
    setUsername("");
    setRoom("");
    setShowChat(!showChat);
    setShowRoomCredentials(!showRoomCredentials);
  };
  return (
    <Container
      fluid
      className="min-vh-100 px-0 d-flex align-items-center justify-content-center App"
    >
      {showRoomCredentials ? (
        <>
          <Container className="credentialBox p-5 rounded d-flex flex-column justify-content-between align-items-center">
            <Card.Header as="h3" className="mb-5 fw-bold">
              Welcome to Chat App
            </Card.Header>
            <Container className="w-100 text-center">
              <Form.Control
                type="text"
                className="mb-4 w-100 py-2"
                id="inputgroup"
                placeholder="Enter Your Name.."
                value={username}
                name="username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Form.Control
                type="text"
                className="mb-4 w-100 py-2"
                placeholder="Create A Room ID.."
                value={room}
                name="room"
                onChange={(e) => setRoom(e.target.value)}
              />
              <Button variant="success" className="px-3" onClick={joinRoom}>
                Join A Room
              </Button>
            </Container>
          </Container>
        </>
      ) : (
        <></>
      )}
      {showChat ? (
        <>
          <Chat
            socket={socket}
            username={username}
            room={room}
            handleLogout={handleLogout}
          />
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default App;
