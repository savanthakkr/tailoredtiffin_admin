'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useRouter } from 'next/navigation';

import { Card, CardBody, Col, Row, Button, Form } from 'react-bootstrap';

const StatsCard = ({ icon, name, amount, onClick }) => {
  return (
    <Col md={6}>
      <Card
        className="overflow-hidden cursor-pointer"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <CardBody>
          <Row>
            <Col xs={6}>
              <div className="avatar-md bg-soft-primary rounded flex-centered">
                <IconifyIcon icon={icon} className="fs-24 text-primary" />
              </div>
            </Col>
            <Col xs={6} className="text-end">
              <p className="text-muted mb-0">{name}</p>
              <h3 className="text-dark mt-1 mb-0">{amount}</h3>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};


const Stats = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const today = new Date().toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = () => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetch(
      `https://api.tailoredtiffin.com//admin/get_admin_dashboard_stats?from_date=${fromDate}&to_date=${toDate}`,
      {
        headers: {
          Authorization: session.accessToken
        }
      }
    )
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setStats(res.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, [session]);

  
  const sendMenuNotification = () => {
    fetch(`https://api.tailoredtiffin.com//admin/admin_send_menu_update_notification`, {
      method: 'POST',
      headers: {
        Authorization: session.accessToken,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        alert(res.msg);
      });
  };

  const sendReminderOrderNotification = () => {
    fetch(`https://api.tailoredtiffin.com//admin/admin_send_reminder_order_notification`, {
      method: 'POST',
      headers: {
        Authorization: session.accessToken,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        alert(res.msg);
      });
  };

  return (
    <>
      {/* DATE FILTER */}
      <Col xxl={12}>
        <Card>
          <CardBody className="d-flex align-items-center gap-3 flex-wrap">
            <Form.Group>
              <Form.Label className="mb-1">From Date</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mb-1">To Date</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="primary"
              className="mt-4"
              onClick={fetchStats}
            >
              Apply
            </Button>

            <Button
              variant="soft-success"
              className="mt-4 ms-auto"
              onClick={sendMenuNotification}
            >
              <IconifyIcon icon="mdi:bell-ring" className="me-1" />
              Send Menu Update
            </Button>
            <Button
              variant="soft-success"
              className="mt-4 ms-auto"
              onClick={sendReminderOrderNotification}
            >
              <IconifyIcon icon="mdi:bell-ring" className="me-1" />
              Reminder Order Confirmation
            </Button>
          </CardBody>
        </Card>
      </Col>

      {/* STATS */}
      {stats && (
        <Col xxl={9}>
          <Row>
            <StatsCard
              icon="solar:cart-bold"
              name="Total Orders"
              amount={stats.total_orders}
              onClick={() => router.push('/orders/orders-list')}
            />

            <StatsCard
              icon="solar:users-group-rounded-bold"
              name="Total Customers"
              amount={stats.total_customers}
              onClick={() => router.push('/customer/customer-list')}
            />

            <StatsCard
              icon="solar:wallet-money-bold"
              name="Pending Payment"
              amount={`₹ ${stats.pending_payment}`}
            />

            <StatsCard
              icon="solar:bill-list-bold"
              name="Order Amount"
              amount={`₹ ${stats.total_order_amount}`}
            />

          </Row>
        </Col>
      )}
    </>
  );
};

export default Stats;
