import axios from "axios";
import { GoogleLogout } from "react-google-login";

const clientID =
  "843159100565-q92pmj816jh17g0arofo3jaocq7co3mv.apps.googleusercontent.com";

export async function handleSignOut() {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/signout`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      document.cookie =
        "googleToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "emailToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("cookies cleared on frontend!");
    }

    window.location.href = "/";
  } catch (err) {
    console.error("Error signing out:", err);
  }
}

export default function Logout() {
  function onSuccess(): void {
    console.log("Logout success");
  }

  return (
    <div>
      <GoogleLogout
        clientId={clientID}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}
