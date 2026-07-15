import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";

import "./Auth.css";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [error, setError] = useState("");
   const navigate = useNavigate();

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const res = await api.post("/user/register", formData);

      setSuccess(res.data.message || "User created successfully");
      navigate("/");
    }  catch (error) {
      if (error.response?.data?.errors) {
      // Joi validation errors
      const allErrors = error.response.data.errors
        .map((item) => item.message)
        .join(", ");

      alert(allErrors);
    } else {
      alert(
        error.response?.data?.message ||
          "Something went wrong."
      );
    }

  }



   


  };

  return (
    <div className="ticket-container">
      <div className="ticket-card">
        <h3 className="ticket-title">Create User</h3>

        {/* Backend Error */}
        {error && <Alert color="danger">{error}</Alert>}

        {/* Success */}
        {success && <Alert color="success">{success}</Alert>}

        <Form className="ticket-form" onSubmit={submitHandler}>
          <FormGroup>
            <Label>Name</Label>

            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </FormGroup>

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

          <FormGroup>
            <Label>Role</Label>

            <Input
              type="select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="customer">Customer</option>

              <option value="agent">Agent</option>

              <option value="admin">Admin</option>
            </Input>
          </FormGroup>

        

          <Button className="submit-btn" type="submit">
            Create User
          </Button>
        </Form>
      </div>
    </div>
  );
}
