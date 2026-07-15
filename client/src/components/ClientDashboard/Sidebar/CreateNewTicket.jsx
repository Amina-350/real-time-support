import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, FormText } from "reactstrap";

import "./Sidebar.css";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";

export default function CreateNewTicket() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: "",
    agentId: "",
    subject: "",
    category: "",
    priority: "",
    status: "",
    description: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const createTicket = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("customerId", formData.customerId);
      data.append("agentId", formData.agentId);
      data.append("subject", formData.subject);
      data.append("category", formData.category);
      data.append("priority", formData.priority);
      data.append("status", formData.status);
      data.append("description", formData.description);
      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }
      const token = localStorage.getItem("token");
      const res = await api.post("/ticket/createticket", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/clientdashboard')
      console.log(res.data);
    } catch (error) {
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
        <h3 className="ticket-title">Create New Ticket</h3>

        <Form className="ticket-form" onSubmit={createTicket}>
          <FormGroup>
            <Label>Customer ID</Label>

            <Input
              name="customerId"
              onChange={handleChange}
              placeholder="Enter customer id"
            />
          </FormGroup>

          <FormGroup>
            <Label>Agent ID</Label>

            <Input
              name="agentId"
              onChange={handleChange}
              placeholder="Enter agent id"
            />
          </FormGroup>

          <FormGroup>
            <Label>Subject</Label>

            <Input
              name="subject"
              onChange={handleChange}
              placeholder="Enter ticket subject"
            />
          </FormGroup>

          <FormGroup>
            <Label>Priority</Label>

            <Input type="select" name="priority" onChange={handleChange}>
              <option>Select priority</option>

              <option value="low">Low</option>

              <option value="medium">Medium</option>

              <option value="high">High</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Category</Label>

            <Input type="select" name="category" onChange={handleChange}>
              <option>Select category</option>

              <option value="technical">Technical Issue</option>

              <option value="billing">billing Issue</option>

              <option value="account">Account Issue</option>
              <option value="payment">payment Issue</option>
              <option value="bug">bug Issue</option>
              <option value="feature-request">feature-request</option>
              <option value="other">Other</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Status</Label>

            <Input type="select" name="status" onChange={handleChange}>
              <option>Select status</option>

              <option value="open">Open</option>
   <option value="in-progress">in-progress</option>
              <option value="pending">pending</option>

              <option value="resolved">Resolved</option>

              <option value="closed">Closed</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>

            <Input
              type="textarea"
              name="description"
              onChange={handleChange}
              rows="5"
              placeholder="Describe your issue..."
            />
          </FormGroup>

          <FormGroup>
            <Label>Attachment</Label>

            <Input type="file" name="attachment" onChange={handleChange} />

            <FormText>Upload screenshot or document</FormText>
          </FormGroup>

          <Button className="submit-btn">Submit Ticket</Button>
        </Form>
      </div>
    </div>
  );
}
