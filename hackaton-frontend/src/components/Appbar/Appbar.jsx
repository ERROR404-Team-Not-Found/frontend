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
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";
import Divider from "@mui/material/Divider";

const pages = ["Dashboard", "Models", "My Models", "Logout"];

const StyledMenuItem = styled(MenuItem)({
  "&:hover": {
    backgroundColor: "#1679AB",
  },
});

function ResponsiveAppBar({ logout, username }) {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = (page) => {
    console.log(`Hello from ${page}`);
    // TO IMPLEMENT FUNCTIONALITY
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
                <StyledMenuItem
                  disabled
                  sx={{
                    color: "var(--textColor)",
                    display: { xs: "flex", md: "none" },
                  }}
                >
                  {username}
                </StyledMenuItem>
                <Divider
                  sx={{
                    display: { xs: "flex", md: "none" },
                  }}
                />
                {pages.map((page, index) => (
                  <StyledMenuItem
                    key={index}
                    onClick={() => handleMenuItemClick(page)}
                  >
                    {page}
                  </StyledMenuItem>
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
