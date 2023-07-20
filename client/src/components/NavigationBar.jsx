import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuList from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import notify from "../features/notify";
import { remove } from "../features/signInSlice";

function NavigationBar({ setSignInModalOpen, setAddProductModalOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const user = useSelector((state) => state.user.user);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const openSignInModal = () => {
    setAnchorElUser(null);
    setSignInModalOpen(true);
  };

  const logOut = () => {
    const removeToken = async () => {
      const sendLogout = await fetch("/api/logout", {
        method: "GET",
      });
      if (sendLogout.status === 200) {
        const result = await sendLogout.json();
        console.log(result);
        notify(result[0].message, "success");
      } else {
        // const error = await sendLogout.json();
        // notify(error[0].error, "error"); // TODO
      }
    };
    removeToken();
    navigate("/");
    dispatch(remove());
    handleCloseNavMenu();
    handleCloseUserMenu();
  };
  const openAddProductModal = () => {
    setAddProductModalOpen(true);
    console.log('open product modal')};

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            // href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              // letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LeBonCoin
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <MenuList
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem key={"home"} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">HOME</Typography>
              </MenuItem>
              <MenuItem key={"dashboard"} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">DASHBOARD</Typography>
              </MenuItem>
            </MenuList>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LeBonCoin
          </Typography>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Box style={{ display: "flex", flexDirection: "row" }}>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button
                  key="home"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  <Link
                    to="/"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    HOME
                  </Link>
                </Button>
              </Box>
              {user && user.is_admin ? (
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  <Button
                    key="home"
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    <Link
                      to="/dashboard"
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      DASHBOARD
                    </Link>
                  </Button>
                </Box>
              ) : (
                ""
              )}
            </Box>

            <Box
              sx={{ flexGrow: 0 }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {user && (
                <AddCircleIcon
                  onClick={() => {
                    openAddProductModal();
                  }}
                  style={{
                    margin: "1rem",
                    fontSize: "45px",
                    cursor: "pointer",
                  }}
                />
              )}
              <div>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {user ? (
                      <Avatar alt="user avatar" src={user.avatar} />
                    ) : (
                      <Avatar alt="user avatar" src="" />
                    )}
                  </IconButton>
                </Tooltip>
                {/* {user && (
                  <div style={{ fontSize: "14px", marginTop: "5px" }}>
                    {user.first_name}
                  </div>
                )} */}
              </div>
              <MenuList
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {user ? (
                  <MenuItem
                    key="Sign Out"
                    onClick={() => {
                      // openSignInModal();
                    }}
                  >
                    <Typography
                      textAlign="center"
                      onClick={() => {
                        logOut();
                      }}
                    >
                      Sign Out
                    </Typography>
                  </MenuItem>
                ) : (
                  <MenuItem
                    key="Sign In"
                    onClick={() => {
                      openSignInModal();
                    }}
                  >
                    <Typography
                      textAlign="center"
                      onClick={() => {
                        setSignInModalOpen(true);
                      }}
                    >
                      Sign In
                    </Typography>
                  </MenuItem>
                )}
              </MenuList>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavigationBar;
