'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Table, Button, Badge, Row, Col } from 'react-bootstrap';

const DashboardMenuManager = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const getToken = () => session?.accessToken;

  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [lunchTime, setLunchTime] = useState("");
const [dinnerTime, setDinnerTime] = useState("");
const [savingTime, setSavingTime] = useState(false);
const [error, setError] = useState(null);
const [togglingId, setTogglingId] = useState(null);


  const columnOrder = [
  "Sabji Green",
  "Sabji Kathol",
  "Bread",
  "Other",
  "Special Item",
  "Meal"
];

  /* ===========================
     AUTO LOGOUT IF SESSION/TOKEN MISSING
  =========================== */
  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !getToken()) {
      signOut({ callbackUrl: '/auth/sign-in' });
    }
  }, [session, status]);

  /* ===========================
     AUTH FETCH (HANDLE 401/403)
  =========================== */
  const authFetch = async (url, options = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('Missing access token');
  }
  const { headers: customHeaders = {}, ...restOptions } = options;
  const headers = {
    ...customHeaders,
    Authorization: `Bearer ${token}`
  };
  if (!(restOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...restOptions,
    headers
  });

  const data = await res.json();

  if (!res.ok || data.status === 0 || data.status === false) {
    await signOut({ callbackUrl: '/auth/sign-in' });
    throw new Error('Invalid or expired token');
  }

  return data;
};
  /* ===========================
     FETCH ALL MENU ITEMS
  =========================== */
  const fetchAll = async () => {
  setLoading(true);
  setError(null);

  try {
    const [
      meals,
      breads,
      subjis,
      others,
      specials
    ] = await Promise.all([
      authFetch(`http://localhost:3002/admin/get_meals`),
      authFetch(`http://localhost:3002/admin/get_bread`),
      authFetch(`http://localhost:3002/admin/get_subji`),
      authFetch(`http://localhost:3002/admin/get_other_item`),
      authFetch(`http://localhost:3002/admin/get_special_items`)
    ]);

    const grouped = {};

    // ✅ Subji type wise
    // ✅ Sabji Green
// ✅ Sabji Green
const greenSabji = subjis?.data?.green || [];

if (greenSabji?.length) {
  grouped["Sabji Green"] = greenSabji.map(s => ({
    id: s.subji_id,
    name: s.name,
    type: "Subji",
    is_active: Number(s.is_active)
  }));
}

// ✅ Sabji Kathol
const katholSabji = subjis?.data?.kathol || [];

if (katholSabji?.length) {
  grouped["Sabji Kathol"] = katholSabji.map(s => ({
    id: s.subji_id,
    name: s.name,
    type: "Subji",
    is_active: Number(s.is_active)
  }));
}



    // ✅ Bread
    if (breads?.data?.length) {
      grouped['Bread'] = breads.data.map(b => ({
        id: b.bread_id,
        name: b.name,
        type: 'Bread',
        is_active: Number(b.is_active)
      }));
    }

    // ✅ Other
    if (others?.data?.length) {
      grouped['Other'] = others.data.map(o => ({
        id: o.other_item_id,
        name: o.name,
        type: 'Other',
        is_active: Number(o.is_active)
      }));
    }

    // ✅ Special
    if (specials?.data?.length) {
      grouped['Special Item'] = specials.data.map(s => ({
        id: s.special_item_id,
        name: s.name,
        type: 'Special',
        is_active: Number(s.is_active)
      }));
    }

    // ✅ Meal
    if (meals?.data?.length) {
      grouped['Meal'] = meals.data.map(m => ({
        id: m.meals_id,
        name: m.meals_name,
        type: 'Meal',
        is_active: Number(m.is_active)
      }));
    }

    setGroups(grouped);
  } catch (err) {
    console.error(err);
    setError("Failed to load menu");
  } finally {
    setLoading(false);
  }
};

const fetchOrderTimes = async () => {
  try {
    const res = await authFetch("http://localhost:3002/admin/get_order_setting");
    if (res.status === "success") {
      setLunchTime(res.data.lunch_cutoff);
      setDinnerTime(res.data.dinner_cutoff);
    }
  } catch (err) {
    console.error(err);
    setError("Failed to load order settings");
  }
};

const saveOrderTimes = async () => {
  if (!lunchTime || !dinnerTime) {
    alert("Please select both times");
    return;
  }

  setSavingTime(true);

  try {
    const res = await authFetch(
      "http://localhost:3002/admin/update_order_setting",
      {
        method: "POST",
        body: JSON.stringify({
          inputdata: {
            lunch_cutoff: lunchTime,
            dinner_cutoff: dinnerTime
          }
        })
      }
    );

    if (res.status === "success") {
      alert("Order times updated");
    } else {
      alert(res.msg);
    }
  } catch (err) {
    console.error(err);
  }

  setSavingTime(false);
};

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const init = async () => {
      const results = await Promise.allSettled([fetchAll(), fetchOrderTimes()]);
      const hasRejected = results.some((result) => result.status === 'rejected');
      if (hasRejected) {
        setError((prev) => prev || "Failed to load dashboard data");
      }
    };

    init();
  }, [session?.accessToken]);

  /* ===========================
     TOGGLE STATUS
  =========================== */
  const toggleStatus = async (item) => {
    let url = '';
    let payload = {};

    if (item.type === 'Meal') {
      url = 'http://localhost:3002/admin/toggle_meal_status';
      payload = { meals_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    if (item.type === 'Bread') {
      url = 'http://localhost:3002/admin/toggle_bread_status';
      payload = { bread_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    if (item.type === 'Subji') {
      url = 'http://localhost:3002/admin/toggle_subji_status';
      payload = { subji_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    if (item.type === 'Other') {
      url = 'http://localhost:3002/admin/toggle_other_item_status';
      payload = { other_item_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    if (item.type === 'Special') {
      url = 'http://localhost:3002/admin/toggle_special_item_status';
      payload = { special_item_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    try {
      setTogglingId(item.id);
      await authFetch(url, {
        method: 'POST',
        body: JSON.stringify({ inputdata: payload })
      });
      setGroups((prev) => {
        const updated = { ...prev };
        const col = Object.keys(updated).find((key) =>
          updated[key].some((entry) => entry.id === item.id)
        );
        if (!col) return prev;

        updated[col] = updated[col].map((entry) =>
          entry.id === item.id
            ? { ...entry, is_active: entry.is_active ? 0 : 1 }
            : entry
        );

        return updated;
      });
    } catch (err) {
      console.error(err);
      setError("Failed to update item status");
    } finally {
      setTogglingId(null);
    }
  };

  /* ===========================
     UI
  =========================== */
  return (
    <Card className="mt-4">
      <CardBody>
        <h4 className="mb-3">Menu Manager</h4>

        <Card className="mb-4">
  <CardBody>
    <h5 className="mb-3">Order Closing Time</h5>

    <Row className="g-3 align-items-end">
      <Col lg={3}>
        <label className="form-label">Lunch Closing Time</label>
        <input
          type="time"
          className="form-control"
          value={lunchTime}
          onChange={(e) => setLunchTime(e.target.value)}
        />
      </Col>

      <Col lg={3}>
        <label className="form-label">Dinner Closing Time</label>
        <input
          type="time"
          className="form-control"
          value={dinnerTime}
          onChange={(e) => setDinnerTime(e.target.value)}
        />
      </Col>

      <Col lg={2}>
        <Button onClick={saveOrderTimes} disabled={savingTime}>
          {savingTime ? "Saving..." : "Update"}
        </Button>
      </Col>
    </Row>
  </CardBody>
</Card>
        {error && <div className="mb-3 text-danger">{error}</div>}
        {loading ? (
          <div className="mb-3 text-muted">Loading menu...</div>
        ) : (
        <Table bordered responsive>
  <thead className="table-light">
    <tr>
      {columnOrder
        .filter(col => groups[col]?.length)
        .map((col, idx) => (
          <th key={idx} className="text-center">{col}</th>
        ))}
    </tr>
  </thead>

  <tbody>
    <tr>
      {columnOrder
        .filter(col => groups[col]?.length)
        .map((col, idx) => (
          <td key={idx} style={{ verticalAlign: "top" }}>
            {(groups[col] || []).map((item, i) => (
              <div
                key={i}
                onClick={() => toggleStatus(item)}
                style={{
                  cursor: togglingId === item.id ? "not-allowed" : "pointer",
                  padding: "6px 10px",
                  marginBottom: "6px",
                  borderRadius: "6px",
                  background: item.is_active ? "#d1fae5" : "#f8f9fa",
                  border: "1px solid #ddd",
                  transition: "0.2s",
                  pointerEvents: togglingId === item.id ? "none" : "auto",
                  opacity: togglingId === item.id ? 0.6 : 1
                }}
              >
                {item.name}
              </div>
            ))}
          </td>
        ))}
    </tr>

    {!Object.keys(groups).length && !loading && (
      <tr>
        <td colSpan={6} className="text-center text-muted">
          No items found
        </td>
      </tr>
    )}
  </tbody>
</Table>
        )}


      </CardBody>
    </Card>
  );
};

export default DashboardMenuManager;
