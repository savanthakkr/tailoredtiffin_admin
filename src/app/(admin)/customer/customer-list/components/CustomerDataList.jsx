'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useMemo } from 'react';
import { Card, Col, Row, Button, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Link from 'next/link';

const CustomerDataList = () => {
  const { data: session } = useSession();

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState('');

  /* ===============================
     FETCH USERS
  =============================== */
  const fetchUsers = async () => {
    if (!session?.accessToken) return;

    let url =
      'https://api.tailoredtiffin.com/admin/admin_get_all_Users';

    if (filter !== '') {
      url += `?pay_later=${filter}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: session.accessToken }
    });

    const json = await res.json();
    if (json.status === 'success') {
      setUsers(Array.isArray(json.data) ? json.data : []);
      setSelected([]);
    }
  };

  /* ===============================
   DELETE USER
=============================== */
const deleteUser = async (user_id) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  if (!session?.accessToken) return;

  const res = await fetch(
    "https://api.tailoredtiffin.com/admin/admin_delete_user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session.accessToken
      },
      body: JSON.stringify({ user_id })
    }
  );

  const json = await res.json();
  alert(json.msg);

  if (json.status === "success") {
    fetchUsers(); // refresh table
  }
};


  useEffect(() => {
    fetchUsers();
  }, [session, filter]);

  /* ===============================
     SELECTION
  =============================== */
  const toggleSelect = user_id => {
    setSelected(prev =>
      prev.includes(user_id)
        ? prev.filter(id => id !== user_id)
        : [...prev, user_id]
    );
  };

  const toggleSelectAll = checked => {
    setSelected(checked ? users.map(u => u.user_id) : []);
  };

  const selectedUsers = useMemo(
    () => (Array.isArray(users) ? users : []).filter(u => selected.includes(u.user_id)),
    [users, selected]
  );


  const allEnabled =
    selectedUsers.length > 0 &&
    selectedUsers.every(u => Number(u.allow_pay_later) === 1);

  const allDisabled =
    selectedUsers.length > 0 &&
    selectedUsers.every(u => Number(u.allow_pay_later) === 0);

  /* ===============================
     PAY LATER UPDATE
  =============================== */
  const updatePayLater = async allow => {
    if (!session?.accessToken) return;

    let payload = { allow_pay_later: allow };

    if (selected.length === 1) {
      payload.apply_for = 'single';
      payload.user_id = selected[0];
    } else if (selected.length > 1) {
      payload.apply_for = 'multiple';
      payload.user_ids = selected;
    } else {
      payload.apply_for = 'all';
    }

    await fetch(
      'https://api.tailoredtiffin.com/admin/set_pay_later_access',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.accessToken
        },
        body: JSON.stringify({ inputdata: payload })
      }
    );

    fetchUsers();
  };

  /* ===============================
     UI
  =============================== */
  return (
    <Row>
      <Col xl={12}>
        <Card className="p-3">

          {/* ACTION BAR */}
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <Button
              size="sm"
              disabled={!selected.length || allEnabled}
              onClick={() => updatePayLater(1)}
            >
              Enable Pay Later (Selected)
            </Button>

            <Button
              size="sm"
              variant="danger"
              disabled={!selected.length || allDisabled}
              onClick={() => updatePayLater(0)}
            >
              Disable Pay Later (Selected)
            </Button>

            <Button
              size="sm"
              variant="success"
              onClick={() => {
                setSelected([]);
                updatePayLater(1);
              }}
            >
              Enable for ALL
            </Button>

            <Form.Select
              size="sm"
              style={{ width: 220 }}
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="">All Users</option>
              <option value="1">Pay Later Enabled</option>
              <option value="0">Pay Later Disabled</option>
            </Form.Select>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>
                    <Form.Check
                      checked={
                        users.length > 0 &&
                        selected.length === users.length
                      }
                      onChange={e => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Pending ₹</th>
                  <th>Pay Later</th>
                  <th>Limit ₹</th>
                  <th>Action</th> {/* ✅ RESTORED */}
                </tr>
              </thead>

              <tbody>
                {users.map(u => (
                  <tr key={u.user_id}>
                    <td>
                      <Form.Check
                        checked={selected.includes(u.user_id)}
                        onChange={() => toggleSelect(u.user_id)}
                      />
                    </td>
                    <td>{u.name}</td>
                    <td>{u.mobile_no}</td>
                    <td>₹ {Number(u.pending_wallet_amount).toFixed(2)}</td>
                    <td>
                      {Number(u.allow_pay_later) === 1 ? (
                        <span className="badge bg-success">Enabled</span>
                      ) : (
                        <span className="badge bg-danger">Disabled</span>
                      )}
                    </td>
                    <td>₹ {u.pay_later_limit || 0}</td>
                    <td className="d-flex gap-2">

                      {/* VIEW */}
                      <Link
                        href={`customer-detail?user_id=${u.user_id}`}
                        className="btn btn-sm btn-light"
                      >
                        <IconifyIcon icon="solar:eye-broken" />
                      </Link>

                      {/* DELETE */}
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={Number(u.pending_wallet_amount) > 0}
                        onClick={() => deleteUser(u.user_id)}
                      >
                        <IconifyIcon icon="solar:trash-bin-trash-bold" />
                      </button>


                    </td>


                  </tr>
                ))}

                {!users.length && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </Card>
      </Col>
    </Row>
  );
};

export default CustomerDataList;
