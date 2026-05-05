"use client";

import { useState } from "react";
import { Card, CardBody, CardTitle, Button, Row, Col, Form } from "react-bootstrap";

export default function NotificationScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // dummy users (replace with API later)
  const users = [
    { id: 1, name: "Amit Sharma", phone: "9876543210" },
    { id: 2, name: "Neha Patel", phone: "9123456780" },
    { id: 3, name: "Rahul Mehta", phone: "9988776655" },
  ];

  return (
    <div className="p-3">
      {/* Top Buttons */}
      <Card className="mb-3">
        <CardBody className="d-flex justify-content-between align-items-center">
          <Button variant="success">
            🔔 Send Menu Update
          </Button>

          <Button variant="success">
            🔔 Reminder Order Confirmation
          </Button>
        </CardBody>
      </Card>

      <Row>
        {/* User List */}
        <Col md={6}>
          <Card>
            <CardBody>
              <CardTitle>User List</CardTitle>

              <div className="list-group">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <div>
                      <b>{u.name}</b>
                      <br />
                      <small>{u.phone}</small>
                    </div>
                    <input type="checkbox" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Form */}
        <Col md={6}>
          <Card>
            <CardBody>
              <CardTitle>Send Notification</CardTitle>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" className="w-100">
                  Send Notification
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
