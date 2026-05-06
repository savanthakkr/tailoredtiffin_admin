"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardBody, CardTitle, Button, Row, Col, Form, Alert, Spinner } from "react-bootstrap";

export default function NotificationScreen() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success"|"error", msg }

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.accessToken) return;
      const res = await fetch("https://api.tailoredtiffin.com/admin/admin_get_all_Users", {
        headers: { Authorization: session.accessToken },
      });
      const json = await res.json();
      if (json.status === "success") {
        setUsers(Array.isArray(json.data) ? json.data : []);
      }
    };
    fetchUsers();
  }, [session]);

  const toggleUser = (user_id) => {
    setSelectedIds((prev) =>
      prev.includes(user_id) ? prev.filter((id) => id !== user_id) : [...prev, user_id]
    );
  };

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? users.map((u) => u.user_id) : []);
  };

  const handleSendToAllChange = (checked) => {
    setSendToAll(checked);
    if (checked) setSelectedIds([]);
  };

  const handleSend = async () => {
    if (!title.trim() || !description.trim()) {
      setFeedback({ type: "error", msg: "Title and description are required." });
      return;
    }

    if (!sendToAll && selectedIds.length === 0) {
      setFeedback({ type: "error", msg: "Please select at least one user or choose Send to All." });
      return;
    }

    setSending(true);
    setFeedback(null);

    try {
      const body = {
        title,
        description,
        send_to_all: sendToAll ? 1 : 0,
        user_ids: sendToAll ? [] : selectedIds,
      };

      const res = await fetch("https://api.tailoredtiffin.com/admin/admin_send_custom_notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session.accessToken,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (json.status === "success") {
        setFeedback({ type: "success", msg: json.msg || "Notification sent successfully!" });
        setTitle("");
        setDescription("");
        setSelectedIds([]);
        setSendToAll(false);
      } else {
        setFeedback({ type: "error", msg: json.msg || "Failed to send notification." });
      }
    } catch (err) {
      setFeedback({ type: "error", msg: "Server error. Please try again." });
    } finally {
      setSending(false);
    }
  };

  const allSelected = users.length > 0 && selectedIds.length === users.length;

  return (
    <div className="p-3">

      {feedback && (
        <Alert variant={feedback.type === "success" ? "success" : "danger"} dismissible onClose={() => setFeedback(null)}>
          {feedback.msg}
        </Alert>
      )}

      <Row>
        {/* User List */}
        <Col md={6}>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <CardTitle className="mb-0">User List</CardTitle>
                <Form.Check
                  type="checkbox"
                  label="Select All"
                  checked={allSelected}
                  disabled={sendToAll}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </div>

              <Form.Check
                type="checkbox"
                label="Send to All Users"
                checked={sendToAll}
                onChange={(e) => handleSendToAllChange(e.target.checked)}
                className="mb-2 text-success fw-semibold"
              />

              <div className="list-group" style={{ maxHeight: 420, overflowY: "auto" }}>
                {users.length === 0 && (
                  <p className="text-muted">No users found.</p>
                )}
                {users.map((u) => (
                  <label
                    key={u.user_id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${sendToAll ? "opacity-50" : ""}`}
                    style={{ cursor: sendToAll ? "not-allowed" : "pointer" }}
                  >
                    <div>
                      <b>{u.name}</b>
                      <br />
                      <small className="text-muted">{u.mobile_no}</small>
                    </div>
                    <Form.Check
                      type="checkbox"
                      checked={sendToAll || selectedIds.includes(u.user_id)}
                      disabled={sendToAll}
                      onChange={() => toggleUser(u.user_id)}
                    />
                  </label>
                ))}
              </div>

              {!sendToAll && (
                <small className="text-muted mt-2 d-block">
                  {selectedIds.length} user{selectedIds.length !== 1 ? "s" : ""} selected
                </small>
              )}
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
                    rows={5}
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100"
                  disabled={sending}
                  onClick={handleSend}
                >
                  {sending ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Notification"
                  )}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
