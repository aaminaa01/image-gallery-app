import AuthContext from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <div className="navbar">
      <div className="links">
        <div>
          <Link href={"/cloud"}>
            <h1>Google Drive Lite</h1>
          </Link>
        </div>
        <div className="items">
          <div className="item">Home</div>
        </div>
        {user && (
          <div className="actions">
            <div className="action">{user.username}</div>
            <div className="action red" onClick={logoutUser}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
