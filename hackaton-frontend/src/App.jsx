import "./App.css";
import useAuth from "./hooks/AuthHook";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ModelCreationFlow from "./components/ModelCreationFlow/ModelCreationFlow";
import BasicTable from "./components/ModelCard/ModelCard";


function App() {
  const { isLogin, token, userID, username, keycloakInstance } = useAuth();

  return (
    <Routes>
      {isLogin ? (
        <Route
          path="/"
          element={<Layout logout={keycloakInstance} username={username} />}
        >
          <Route path="main" element={<BasicTable />} />
        </Route>
      ) : (
        ""
      )}
    </Routes>
  );
}

export default App;
