import AuthContext from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import styles from "@/styles/NavbarStyles.module.css";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [usage, setUsage] = useState(null);
  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(" http://localhost:3400/api/getBandwidthUsed", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsage(data);
        } else {
          console.error("Failed to fetch data from API");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/cloud">
          <h1>Google Drive Lite</h1>
        </Link>
      </div>
      <div className={styles.links}>
        <Link href="/cloud">
          <h1 className={styles.navLink}>Home</h1>
        </Link>
      </div>
      <div className={styles.actions}>
        {user ? (
          <div className={styles.userActions}>
            <div className={styles.action}>{usage.currentBandwidthUsage/(1024*1024)}/{usage.maxBandwidth/(1024*1024)} MBs</div>
            <div className={styles.action}>{user.username}</div>
            <div className={`${styles.action} ${styles.red}`} onClick={logoutUser}>
              Logout
            </div>
          </div>
        ) : (
          <Link href="/cloud/login">
            <h1 className={styles.navLink}>Login</h1>
          </Link>
        )}
      </div>
    </nav>
  );
}
