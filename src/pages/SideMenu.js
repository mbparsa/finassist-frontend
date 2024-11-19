import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";

const SideMenu = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#2c3e50",
          color: "white",
        },
      }}
    >
      <List>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <StoreIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Merchant" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <CategoryIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Category" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideMenu;
