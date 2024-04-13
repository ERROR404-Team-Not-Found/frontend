import "./App.css";
import useAuth from "./hooks/AuthHook";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";

function App() {
  const { isLogin, token, userID, username, keycloakInstance } = useAuth();

  return (
    <Routes>
      {isLogin ? (
        <Route
          path="/"
          element={<Layout logout={keycloakInstance} username={username} />}
        >
          <Route path="main" element={<div>pula</div>} />
        </Route>
      ) : (
        ""
      )}
    </Routes>
  );
}

export default App;
