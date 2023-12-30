import React, { useState } from 'react';
import styles from '@/styles/SignupPage.module.css'; // Add your styles file

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate the form data before submitting (e.g., check password match, email format, etc.)

//     // Assuming you have an API endpoint for user registration
//     try {
//       const response = await fetch('YOUR_API_ENDPOINT/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         console.log('User registered successfully');
//         // Optionally, redirect the user to a login page or handle success in another way
//       } else {
//         console.error('Failed to register user');
//         // Optionally, handle the error and provide feedback to the user
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//       // Optionally, handle the error and provide feedback to the user
//     }
//   };

return (
    <div className={styles.page}>
    <div className={styles.signupContainer}>
      <h1 className={styles.heading}>Sign Up</h1>
      <form onSubmit={() => {}} className={styles.form}>
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
