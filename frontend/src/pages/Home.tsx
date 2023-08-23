import React, { useEffect } from "react";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import useUser from "../hooks/useUser";

function App() {
  const { user, isLoading } = useUser();

  const loadingStyles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  };

  const spinnerStyles: React.CSSProperties = {
    border: "8px solid rgba(255, 255, 255, 0.1)",
    borderTop: "8px solid white",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  };

  if (isLoading) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-start p-4">
          <img
            className="mt-12"
            width={240}
            height={240}
            src="/images/logo2.svg"
            alt="Logo"
          />
        </div>
        <div style={loadingStyles}>
          <div style={spinnerStyles}></div>
        </div>
      </>
    );
  }

  return (
    <>
      {user ? <SignedInNav /> : <NotSignedInNav />}
      <div className="pt-16 bg-ca3 w-full h-screen">
        <div className="w-full flex h-1/4 flex-col px-10 py-10 space-y-2 overflow-hidden">
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
            reprehenderit debitis eos quibusdam sed tenetur animi itaque
            voluptatem aperiam officia!
          </h2>
        </div>
      </div>
    </>
  );
}

export default App;
