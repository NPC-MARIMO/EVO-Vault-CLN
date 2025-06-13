import React, { useState } from "react";
import styles from "./login.module.css";
import { Link } from "react-router-dom";
import CTA from "../../components/CTA";
import { registerUser } from "../../store/authSlice";
import { useDispatch } from "react-redux";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
    setFormData({ name: "", username: "", email: "", password: "" });
  };

  return (
    <div className={styles.login}>
      <h1>Register</h1>
      <form style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <CTA title="Register" />
      </form>
      <span>
        Already have an account? <Link to="/login">Login</Link>
      </span>
    </div>
  );
}
