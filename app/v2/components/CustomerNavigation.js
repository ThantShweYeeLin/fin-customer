"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function CustomerNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { label: "Dashboard", path: "/v2", icon: <MenuIcon /> },
    { label: "Categories", path: "/v2/category", icon: <CategoryIcon /> },
    { label: "Products", path: "/v2/product", icon: <InventoryIcon /> },
    { label: "Customers (Single Page)", path: "/v2/customer", icon: <PeopleIcon /> },
    { label: "Customers (Multi Page)", path: "/v2/customer/list", icon: <PeopleIcon /> },
  ];

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Next.js + MongoDB CRUD
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => router.push(item.path)}
              startIcon={item.icon}
              variant={pathname === item.path ? "outlined" : "text"}
              size="small"
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}