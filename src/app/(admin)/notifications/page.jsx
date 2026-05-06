"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardBody, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { sendMenuUpdateNotification } from "@/helpers/notificationApi";
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

export default function NotificationScreen() {
  const { data: session } = useSession();
  const [menuLoading, setMenuLoading] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedError, setSelectedError] = useState('');

  const handleSendMenuUpdate = async () => {
    if (!session?.accessToken) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      setMenuLoading(true);
      const data = await sendMenuUpdateNotification(session.accessToken);
      toast.success(data?.msg || "Menu notification sent successfully.");
    } catch (error) {
      console.error("Menu update notification error:", error);
      toast.error(error?.response?.data?.msg || "Failed to send menu update notification.");
    } finally {
      setMenuLoading(false);
    }
  };

  const handleSendReminder = async () => {
    if (!session?.accessToken) {
      toast.error('Session expired. Please login again.');
      return;
    }
    try {
      setReminderLoading(true);
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REMINDER_NOTIFICATION}`, {}, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success(res?.data?.msg || 'Reminder sent successfully');
    } catch (err) {
      console.error('Reminder error:', err);
      toast.error(err?.response?.data?.msg || 'Failed to send reminder');
    } finally {
      setReminderLoading(false);
    }
  };

  const handleSendNotification = async e => {
    e?.preventDefault();
    if (!session?.accessToken) {
      toast.error('Session expired. Please login again.');
      return;
    }
    // validate title
    if (!title || title.trim() === '') {
      setTitleError('Please enter a title');
      return;
    }
    setTitleError('');

    // validate selection
    if (selectedIds.size === 0) {
      setSelectedError('Please select at least one user');
      return;
    }
    setSelectedError('');

    try {
      setSending(true);
      const payload = { title, message: description };
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.MENU_NOTIFICATION}`, payload, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success(res?.data?.msg || 'Notification sent');
      setSentSuccess(true);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Send notification error:', err);
      toast.error(err?.response?.data?.msg || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.accessToken) return;
      try {
        setLoadingUsers(true);
        const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USERS}`, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        const data = res?.data?.data ?? res?.data ?? [];
        const mapped = data.map(u => ({
          user_id: u.user_id ?? u.id ?? u._id,
          name: u.name || u.full_name || u.username || `${u.first_name || ''} ${u.last_name || ''}`.trim(),
          mobile_no: u.mobile_no || u.phone || u.mobile || ''
        }));
        setUsers(mapped);
        if (selectedError) setSelectedError('');
      } catch (err) {
        console.error('Fetch users error:', err?.response?.data || err?.message || err);
        toast.error(err?.response?.data?.msg || 'Failed to fetch users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [session?.accessToken]);

  return (
    <div className="p-3">
      <Card className="mb-3">
        <CardBody className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Notifications</h5>
            <p className="mb-0 text-muted">Manage and send notifications to users.</p>
          </div>

          <div className="d-flex gap-2">
            <Button variant="success" onClick={handleSendMenuUpdate} disabled={menuLoading}>
              {menuLoading ? 'Sending...' : '🔔 Send Menu Update'}
            </Button>
            <Button variant="success" onClick={handleSendReminder} disabled={reminderLoading}>
              {reminderLoading ? 'Sending...' : '🔔 Reminder Order Confirmation'}
            </Button>
          </div>
        </CardBody>
      </Card>

      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <CardBody style={{ minHeight: 140 }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">User List</h6>
                  {users.length > 0 && (
                    <div>
                      <input
                        type="checkbox"
                        aria-label="select-all"
                        checked={selectedIds.size === users.length}
                        onChange={() => {
                          if (selectedIds.size === users.length) setSelectedIds(new Set());
                          else setSelectedIds(new Set(users.map(u => u.user_id)));
                          if (selectedError) setSelectedError('');
                        }}
                      />
                    </div>
                  )}
                </div>

                {loadingUsers ? (
                  <p className="text-muted">Loading users...</p>
                ) : users.length === 0 ? (
                  // keep the empty white card look from the screenshot when no users
                  <div style={{height: 80}} />
                ) : (
                  <ul className="list-unstyled mb-0">
                    {users.map(u => (
                      <li key={u.user_id} className="d-flex align-items-center py-2 border-bottom">
                        <input
                          type="checkbox"
                          className="me-2"
                          aria-label={`select-${u.user_id}`}
                          checked={selectedIds.has(u.user_id)}
                          onChange={() => {
                            const next = new Set(selectedIds);
                            if (next.has(u.user_id)) next.delete(u.user_id); else next.add(u.user_id);
                            setSelectedIds(next);
                            if (selectedError) setSelectedError('');
                          }}
                        />
                        <div>
                          <div className="fw-semibold">{u.name || '—'}</div>
                          <div className="text-muted small">{u.mobile_no || '—'}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              {selectedError && (
                <div className="text-danger small mt-2">{selectedError}</div>
              )}
              </CardBody>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card>
            <CardBody>
              <h6 className="mb-3">Send Notification</h6>
              <Form onSubmit={handleSendNotification}>
                <Form.Group className="mb-3" controlId="notifTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    isInvalid={!!titleError}
                    onChange={e => {
                      setTitle(e.target.value);
                      if (titleError) setTitleError('');
                      if (sentSuccess) setSentSuccess(false);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">{titleError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="notifDesc">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={6} placeholder="Enter description" value={description} onChange={e => setDescription(e.target.value)} />
                </Form.Group>

                {sentSuccess ? (
                  <div className="text-center">
                    <Button variant="success" className="w-100" disabled>
                      Notification Sent
                    </Button>
                  </div>
                ) : (
                  <Button variant="warning" type="submit" className="w-100" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Notification'}
                  </Button>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
