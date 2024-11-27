import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '@/contexts/AuthContext';
import styles from '@/styles/SignupPage.module.css';
import { useRouter } from 'next/router';

const Signup = () => {
    const router = useRouter();
    const { user, registerUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        if (user) {
            console.log("hello");
            router.push("/cloud");
        }
    }, [user, router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = (e) => {
        registerUser(e);
    };

    return (
        <div className={styles.page}>
            <div className={styles.signupContainer}>
                <h1 className={styles.heading}>Sign Up</h1>
                <form onSubmit={handleSignup} className={styles.form}>
                    <label className={styles.label}>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className={styles.label}>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button className={styles.button} type="submit">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
