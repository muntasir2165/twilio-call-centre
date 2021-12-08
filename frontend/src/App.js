import React from "react";
import Login from "./components/Login";
import { useImmer } from "use-immer";

function App() {
  const [user, setUser] = useImmer({
    username: "",
    mobileNumber: "",
  });

  return (
    <div>
      <Login user={user} setUser={setUser} />
    </div>
  );
}

export default App;
