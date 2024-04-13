import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";

const pages = ["Dashboard", "Model Creator", "My Models", "Logout"];

function ResponsiveAppBar({ logout, username }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = (page) => {
    switch (page) {
      case "Dashboard":
        console.log("dashboard");
        break;
      case "Model Creator":
        setAnchorElNav(null);
        navigate("/creator");
        break;
      case "My Models":
        setAnchorElNav(null);
        navigate("/");
        break;
      case "Logout":
        logout.logout();
        break;
      default:
        break;
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "var(--mainColor)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={require("../../logo.png")}
                  style={{ height: "50px", width: "auto", marginRight: "10px" }}
                  alt="logo"
                />
                <Typography variant="h6" sx={{ color: "var(--textColor)" }}>
                  Team Not Found
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: { xs: "none", md: "flex" },
                    color: "var(--textColor)",
                    marginRight: "10px",
                  }}
                >
                  {username}
                </Typography>
                <IconButton
                  size="large"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleOpenNavMenu}
                  sx={{ marginRight: "10px", color: "var(--textColor)" }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              <Menu
                id="nav-menu"
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  ".MuiMenuItem-root": {
                    color: "var(--textColor)",
                    "&:hover": {
                      backgroundColor: "var(--secondaryColor)",
                    },
                  },
                  ".MuiMenu-list": {
                    backgroundColor: "var(--mainColor)",
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--secondaryColor)",
                    display: { xs: "flex", md: "none" },
                    padding: "10px",
                  }}
                >
                  {username}
                </Typography>

                <Divider
                  sx={{
                    display: { xs: "flex", md: "none" },
                  }}
                />
                {pages.map((page, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleMenuItemClick(page)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#1679AB",
                      },
                    }}
                  >
                    {page}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
