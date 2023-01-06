import { useAuth0 } from "@auth0/auth0-react";
import { RouterContainer } from "./routes";
import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
function App() {
  const {
    loginWithRedirect,
    user,
    isAuthenticated,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  React.useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        console.log(token);
        Cookies.set("token", token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  React.useEffect(() => {
    if (Cookies.get("token")) {
      axios.get("http://localhost:3001/api/v1/users", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    }
  }, []);


  return (
    <div className="App" style={{ fontFamily: "CabinetGrotesk" }}>
      <button onClick={() => loginWithRedirect()}>Log In</button>

      <button onClick={() => logout()}>Log Out</button>
      {console.log(isAuthenticated)}
      {isAuthenticated && (
        <div>
          <img src={user.picture} alt={user.name} />
          {JSON.stringify(user, null, 2)}
        </div>
      )}
    </div>
  );
}

export default App;
