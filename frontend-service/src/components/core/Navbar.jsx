import AuthContext from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import styles from "@/styles/NavbarStyles.module.css";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const router = useRouter();

  // Function to determine the correct text for the button based on the current route
  const getButtonLabel = () => {
    const { pathname } = router;

    if (pathname === "/cloud/login") {
      return "Sign Up";
    } else if (pathname === "/cloud/signup") {
      return "Login";
    }

    return user ? "Dashboard" : "Login";
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/cloud">
          <h1>Google Drive Lite</h1>
        </Link>
      </div>
      <div className={styles.links}>
        {user && (
          <Link href="/cloud">
            <h1 className={styles.navLink}>Dashboard</h1>
          </Link>
        )}
      </div>
      <div className={styles.actions}>
        {user ? (
          <div className={styles.userActions}>
            <div className={styles.action}>{user.username}</div>
            <div className={`${styles.action} ${styles.red}`} onClick={logoutUser}>
              Logout
            </div>
          </div>
        ) : (
          <Link href={`/cloud/${getButtonLabel().toLowerCase().replace(/\s/g, '')}`}>
            <h1 className={styles.navLink}>{getButtonLabel()}</h1>
          </Link>
        )}
      </div>
    </nav>
  );
}
