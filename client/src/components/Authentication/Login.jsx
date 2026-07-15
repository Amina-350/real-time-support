import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import "./Auth.css";
import api from "../../config/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const res = await api.post("/user/login", formData);

      // save token
      localStorage.setItem("token", res.data.token);

      // save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess(res.data.message);

      const role = res.data.user.role;

      // Redirect according to role
      if (role === "admin") {
        navigate("/admindashboard");
      } else if (role === "agent") {
        navigate("/agentdashboard");
      } else if (role === "customer") {
        navigate("/clientdashboard");
      } else {
        navigate("/");
      }

      console.log(res.data);

      // redirect example
      // window.location.href="/dashboard";
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="ticket-container">
      <div className="ticket-card">
        <h3 className="ticket-title">Login</h3>

        {error && <Alert color="danger">{error}</Alert>}

        {success && <Alert color="success">{success}</Alert>}

        <Form className="ticket-form" onSubmit={submitHandler}>
          <FormGroup>
            <Label>Email</Label>

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </FormGroup>

          <Button className="submit-btn" type="submit">
            Login
          </Button>
          <br></br>
             <br></br>
          <span>Register Here: </span>
           <Link to="/register">Register </Link>
        </Form>
      </div>
    </div>
  );
}
