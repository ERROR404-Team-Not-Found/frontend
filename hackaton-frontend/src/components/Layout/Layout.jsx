import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../Appbar/Appbar";

const Layout = ({ logout, username }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <ResponsiveAppBar logout={logout} username={username} />
      <Outlet />
    </div>
  );
};

export default Layout;
