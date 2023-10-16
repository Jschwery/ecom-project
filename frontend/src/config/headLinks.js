import React from "react";
import { Helmet } from "react-helmet";

const HeadLinks = () => {
  const backendUrl =
    process.env.REACT_APP_ENV_TYPE === "production"
      ? "https://www.orchtin.online"
      : "http://localhost:5000";

  return (
    <Helmet>
      <link rel="preconnect" href={backendUrl} crossOrigin="use-credentials" />
      <link rel="dns-prefetch" href={backendUrl} />
    </Helmet>
  );
};

export default HeadLinks;
