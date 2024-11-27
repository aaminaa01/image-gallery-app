import AuthContext from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import styles from '@/styles/SignupPage.module.css'; // Add your styles file
import React, { useContext, useEffect, useState } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { user, loginUser } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
          router.push("/cloud");
        }
      }, [user, router]);

    const handleLogin = (e) => {
        loginUser(e);
    };

    return (
        <div className={styles.page}>
        <div className={styles.signupContainer}>
          <h1 className={styles.heading}>Login</h1>
          <form onSubmit={handleLogin} className={styles.form}>
            <label className={styles.label}>
              Username: 
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} name="username" required/>
            </label>
            <label className={styles.label}>
              Password: 
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" required/>

            </label>
            <button className={styles.button} type="submit">
              Login
            </button>
          </form>
        </div>
        </div>
      );
};

export default Login;