import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import Register from "./pages/Register";
import { CSSReset, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { VerifyEmail } from "./components/util/VerifyEmail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserProfileEdit from "./pages/users/EditProfile";
import YourItems from "./pages/users/YourItems";
import AddItem from "./pages/AddItem";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const themeColors = {
  co1: "hsl(90, 40%, 92%)",
  ca1: "hsl(90, 40%, 92%)",
  co2: "hsl(90, 31%, 79%)",
  ca2: "hsl(90, 40%, 82%)",
  co3: "hsl(90, 27%, 69%)",
  ca3: "hsl(90, 40%, 72%)",
  co4: "hsl(90, 19%, 56%)",
  ca4: "hsl(90, 40%, 62%)",
  co5: "hsl(90, 20%, 47%)",
  ca5: "hsl(90, 40%, 52%)",
  co6: "hsl(90, 29%, 34%)",
  ca6: "hsl(90, 40%, 42%)",
  ca7: "hsl(90, 40%, 30%)",
  ca8: "hsl(90, 40%, 20%)",
  ca9: "hsl(90, 40%, 9%)",
  success: "#28A745",
  error: "#DC3545",
  warning: "#FFC107",
};

const theme = extendTheme({
  colors: themeColors,
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/*
            finish the your items setup
            

            */}
          <Route path="/your-items" element={<YourItems />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit-profile" element={<UserProfileEdit />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* <Route path="/login" element={<LoginPage />} /> */}
        </Routes>
      </Router>
    </ChakraProvider>
  </React.StrictMode>,
  root
);
