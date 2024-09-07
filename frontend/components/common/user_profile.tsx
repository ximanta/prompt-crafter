import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-3 p-6 bg-gray-900 rounded-lg border border-gray-700">
      <img src={user.picture} alt={user.name} className="rounded-full w-20 h-20" />
      <h2 className="text-xl font-bold text-blue-400">{user.name}</h2>
      <p className="text-gray-400">{user.email}</p>
      <button
        onClick={() => logout({ returnTo: window.location.origin })}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;