import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import { useImmer } from "use-immer";
import axios from "./utils/Axios";
import socket from "./utils/SocketIo";
import CallCenter from "./components/CallCenter";
import useTokenFromLocalStorage from "./hooks/useTokenFromLocalStorage";
import * as Twilio from "twilio-client";

function App() {
  const [calls, setCalls] = useImmer({ calls: [] });
  const [user, setUser] = useImmer({
    username: "",
    mobileNumber: "",
    verificationCode: "",
    verificationSent: false,
  });
  const [twilioToken, setTwilioToken] = useState();
  const [storedToken, setStoredToken, isValidToken] =
    useTokenFromLocalStorage(null);

  useEffect(() => {
    console.log("Twilio token changed");
  }, [twilioToken]);

  useEffect(() => {
    if (isValidToken) {
      console.log("Valid token");
      return socket.addToken(storedToken);
    }

    console.log("Invalid token");
    socket.removeToken();
  }, [isValidToken, storedToken]);

  useEffect(() => {
    socket.client.on("connect", () => {
      console.log("Connected");
    });

    socket.client.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.client.on("twilioToken", (data) => {
      setTwilioToken(data.token);
    });

    socket.client.on("call-new", ({ data: { CallSid, CallStatus } }) => {
      setCalls((draft) => {
        draft.calls.push({ CallSid, CallStatus });
      });
    });

    socket.client.on("enqueue", ({ data: { CallSid: CallSidInput } }) => {
      setCalls((draft) => {
        const index = draft.calls.findIndex(
          ({ CallSid }) => CallSid === CallSidInput
        );
        draft.calls[index].CallStatus = "enqueue";
      });
    });

    return () => {};
  }, [socket.client]);

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

  function connectTwilioVoiceClient(twilioToken) {
    const device = new Twilio.Device(twilioToken, { debug: true });
    device.on("error", (error) => {
      console.error(error);
    });

    device.on("incoming", (connection) => {
      console.log("Incoming from Twilio");
      connection.accept();
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
      {isValidToken ? (
        <CallCenter calls={calls} />
      ) : (
        <>
          <CallCenter calls={calls} />
          <Login
            user={user}
            setUser={setUser}
            sendSmsCode={sendSmsCode}
            sendVerificationCode={sendVerificationCode}
          />
        </>
      )}
    </div>
  );
}

export default App;
