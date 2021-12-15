import React, { useEffect } from "react";
import Login from "./components/Login";
import { useImmer } from "use-immer";
import axios from "./utils/Axios";
import socket from "./utils/SocketIo";
import useLocalStorage from "./hooks/useLocalStorage";
import CallCenter from "./components/CallCenter";

function App() {
  const [calls, setCalls] = useImmer({ calls: [] });
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

    socket.on("call-new", ({ data: { CallSid, CallStatus } }) => {
      setCalls((draft) => {
        draft.calls.push({ CallSid, CallStatus });
      });
    });

    socket.on("enqueue", ({ data: { CallSid: CallSidInput } }) => {
      setCalls((draft) => {
        const index = draft.calls.findIndex(
          ({ CallSid }) => CallSid === CallSidInput
        );
        draft.calls[index].CallStatus = "enqueue";
      });
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
      {storedToken ? (
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
