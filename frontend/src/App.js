import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import { useImmer } from "use-immer";
import axios from "./utils/Axios";
import socket from "./utils/SocketIo";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [user, setUser] = useImmer({
    username: "",
    mobileNumber: "",
    verificationCode: "",
    verificationSent: false,
  });
  const [storedToken, setStoredToken] = useLocalStorage("token", null);

  useEffect(() => {
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    return () => {};
  }, []);

  async function sendSmsCode() {
    console.log("Sending SMS");
    await axios.post("/login", {
      to: user.mobileNumber,
      username: user.username,
      channel: "sms",
    });
    setUser((draft) => {
      draft.verificationSent = true;
    });
  }

  async function sendVerificationCode() {
    console.log("Sending verification");
    const response = await axios.post("/verify", {
      to: user.mobileNumber,
      code: user.verificationCode,
      username: user.username,
    });
    console.log("received token", response.data.token);
    setStoredToken(response.data.token);
  }

  return (
    <div>
      <Login
        user={user}
        setUser={setUser}
        sendSmsCode={sendSmsCode}
        sendVerificationCode={sendVerificationCode}
      />
    </div>
  );
}

export default App;
