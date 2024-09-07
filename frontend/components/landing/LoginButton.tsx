import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()} 
   className="bg-blue-500 text-white hover:bg-blue-600 transition-colors w-[100px] h-[30px] rounded-lg flex items-center justify-center pb-1">Log In</button>;
};

export default LoginButton;