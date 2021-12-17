import React, { useEffect } from "react";
import Login from "./components/Login";
import { useImmer } from "use-immer";
import axios from "./utils/Axios";
import socket from "./utils/SocketIo";
// import useLocalStorage from "./hooks/useLocalStorage";
import CallCenter from "./components/CallCenter";
import useTokenFromLocalStorage from "./hooks/useTokenFromLocalStorage";

function App() {
  const [calls, setCalls] = useImmer({ calls: [] });
  const [user, setUser] = useImmer({
    username: "",
    mobileNumber: "",
    verificationCode: "",
    verificationSent: false,
  });
  // const [storedToken, setStoredToken] = useLocalStorage("token", null);
  const [storedToken, setStoredToken, isValidToken] =
    useTokenFromLocalStorage(null);

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
