'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Table, Button, Badge, Row, Col } from 'react-bootstrap';

const DashboardMenuManager = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [lunchTime, setLunchTime] = useState("");
const [dinnerTime, setDinnerTime] = useState("");
const [savingTime, setSavingTime] = useState(false);


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

    if (!session || !session?.accessToken) {
      signOut({ callbackUrl: '/login' });
    }
  }, [session, status]);

  /* ===========================
     AUTH FETCH (HANDLE 401/403)
  =========================== */
  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, options);

    if (res.status === 401 || res.status === 403) {
      await signOut({ callbackUrl: '/login' });
      throw new Error('Session expired');
    }

    return res.json();
  };

  /* ===========================
     FETCH ALL MENU ITEMS
  =========================== */
  const fetchAll = async () => {
  if (!session?.accessToken) return;

  setLoading(true);

  const headers = { Authorization: session.accessToken };

  try {
    const [
      meals,
      breads,
      subjis,
      others,
      specials
    ] = await Promise.all([
      authFetch(`https://api.tailoredtiffin.com//admin/get_meals`, { headers }),
      authFetch(`https://api.tailoredtiffin.com//admin/get_bread`, { headers }),
      authFetch(`https://api.tailoredtiffin.com//admin/get_subji`, { headers }),
      authFetch(`https://api.tailoredtiffin.com//admin/get_other_item`, { headers }),
      authFetch(`https://api.tailoredtiffin.com//admin/get_special_items`, { headers })
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
  } finally {
    setLoading(false);
  }
};

const fetchOrderTimes = async () => {
  try {
    const res = await authFetch(
      "https://api.tailoredtiffin.com//admin/get_order_setting",
      {
        headers: { Authorization: session.accessToken }
      }
    );
    console.log(res);
    

    if (res.status === "success") {
      setLunchTime(res.data.lunch_cutoff);
      setDinnerTime(res.data.dinner_cutoff);
    }
  } catch (err) {
    console.error(err);
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
      "https://api.tailoredtiffin.com//admin/update_order_setting",
      {
        method: "POST",
        headers: {
          Authorization: session.accessToken,
          "Content-Type": "application/json"
        },
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
    if (session?.accessToken) {
      fetchAll();
      fetchOrderTimes();
    }
  }, [session]);

  /* ===========================
     TOGGLE STATUS
  =========================== */
  const toggleStatus = async (item) => {
    let url = '';
    let payload = {};

    if (item.type === 'Meal') {
      url = 'https://api.tailoredtiffin.com//admin/toggle_meal_status';
      payload = { meals_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    if (item.type === 'Bread') {
      url = 'https://api.tailoredtiffin.com//admin/toggle_bread_status';
      payload = { bread_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    if (item.type === 'Subji') {
      url = 'https://api.tailoredtiffin.com//admin/toggle_subji_status';
      payload = { subji_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    if (item.type === 'Other') {
      url = 'https://api.tailoredtiffin.com//admin/toggle_other_item_status';
      payload = { other_item_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    if (item.type === 'Special') {
      url = 'https://api.tailoredtiffin.com//admin/toggle_special_item_status';
      payload = { special_item_id: item.id, is_active: item.is_active ? 0 : 1 };
    }

    try {
      await authFetch(url, {
        method: 'POST',
        headers: {
          Authorization: session.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputdata: payload })
      });

      fetchAll();
    } catch (err) {
      console.error(err);
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
                  cursor: "pointer",
                  padding: "6px 10px",
                  marginBottom: "6px",
                  borderRadius: "6px",
                  background: item.is_active ? "#d1fae5" : "#f8f9fa",
                  border: "1px solid #ddd",
                  transition: "0.2s"
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


      </CardBody>
    </Card>
  );
};

export default DashboardMenuManager;