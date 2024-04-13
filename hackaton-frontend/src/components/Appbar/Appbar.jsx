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

const pages = ["Dashboard", "Models", "My Models", "Logout"];

function ResponsiveAppBar({ logout, username }) {
  const [anchorElNav, setAnchorElNav] = useState(null);

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
      case "Models":
        console.log("models");
        break;
      case "My Models":
        console.log("my models");
        break;
      case "Logout":
        logout.logout();
        break;
      default:
        break;
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#074173" }}>
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
                      backgroundColor: "var(--mainColor)",
                    },
                  },
                  ".MuiMenu-list": {
                    backgroundColor: "#fff",
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--mainColor)",
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
