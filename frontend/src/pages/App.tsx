import "./styles/index.css";
import TopBar from "../components/Topbar";
import { CSSReset, ChakraProvider, extendTheme } from "@chakra-ui/react";
import ShoppingCart from "../components/ShoppingCart";
import { useEffect, useState } from "react";
import NotSignedInHeader from "../components/NotSignedIn";
import SignedInHeader from "../components/SignedInNavBar";
import Login from "../components/Login";
import React from "react";

function Home() {
  useEffect(() => {
    //check for session cookie, if there then restore session
    //if no session cookie show appbar that has sign in/up, else show users profile component
  }, []);

  const [btn, setBtn] = useState(false);
  const handleBtn = () => {
    setBtn(!btn);
  };

  return (
    <div>
      <button onClick={() => handleBtn()}>clickme</button>
      <div className="app">
        {btn ? <NotSignedInHeader /> : <SignedInHeader />}

        <div className="w-full flex h-1/4 flex-col px-10 py-10 space-y-2 bg-slate-300 overflow-hidden">
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
            reprehenderit debitis eos quibusdam sed tenetur animi itaque
            voluptatem aperiam officia!
          </h2>
          <Login />
        </div>
      </div>
    </div>
  );
}

export default Home;
