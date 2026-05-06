'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import PageTItle from '@/components/PageTItle';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  Badge,
  Form
} from 'react-bootstrap';

const CustomerDetailPage = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const user_id = searchParams.get('user_id');

  const [data, setData] = useState(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [mode, setMode] = useState('cash');
  const [loading, setLoading] = useState(false);

  // 🔹 FETCH USER DETAILS
  useEffect(() => {
    if (!session?.accessToken || !user_id) return;

    fetch(`http://localhost:3002/admin/admin_user_details?user_id=${user_id}`, {
      headers: {
        Authorization: session.accessToken
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setData(res.data);
        }
      })
      .catch(console.error);
  }, [session, user_id]);

  // 🔹 ADMIN SETTLE PAYMENT
  const settlePayment = async () => {
    if (!settleAmount) return alert('Enter amount');

    setLoading(true);

    const res = await fetch(
      `http://localhost:3002/admin/admin_settle_payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.accessToken
        },
        body: JSON.stringify({
          user_id,
          amount: settleAmount,
          mode
        })
      }
    );

    const json = await res.json();
    setLoading(false);

    if (json.status === 'success') {
      alert('Payment settled');
      location.reload();
    } else {
      alert(json.msg);
    }
  };

  // 🔹 SEND PENDING PAYMENT NOTIFICATION
  const sendPendingNotification = async () => {

  if (!wallet?.balance || Number(wallet.balance) <= 0) {
    return alert("No pending amount");
  }

  const res = await fetch(
    `http://localhost:3002/admin/admin_send_pending_payment_notification`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session.accessToken
      },
      body: JSON.stringify({
        user_id,
        amount: wallet.balance   // ✅ SEND AMOUNT
      })
    }
  );

  const json = await res.json();
  alert(json.msg);
};


  if (!data) return null;

  const { user, wallet, orders } = data;

  return (
    <>
      <PageTItle title="CUSTOMER DETAILS" />

      <Row>
        {/* LEFT SIDE */}
        <Col lg={4}>
          <Card>
            <CardBody>
              <h4>{user.name}</h4>
              <p>Email: {user.email || '-'}</p>
              <p>Mobile: {user.mobile_no}</p>
              <Badge bg={user.is_active == 1 ? 'success' : 'danger'}>
                {user.is_active == 1 ? 'Active' : 'Inactive'}
              </Badge>
            </CardBody>
          </Card>

          {/* WALLET */}
          <Card className="mt-3">
            <CardHeader>Wallet</CardHeader>
            <CardBody>
              <h5>Balance: ₹ {wallet.balance}</h5>

              <Form className="mt-3">
                <Form.Control
                  placeholder="Amount"
                  type="number"
                  value={settleAmount}
                  onChange={e => setSettleAmount(e.target.value)}
                />

                <Form.Select
                  className="mt-2"
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank</option>
                </Form.Select>

                <Button
                  className="mt-2 w-100"
                  onClick={settlePayment}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Settle Payment'}
                </Button>

                <Button
                  variant="warning"
                  className="mt-2 w-100"
                  onClick={sendPendingNotification}
                >
                  Send Pending Payment Notification
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* RIGHT SIDE */}
        <Col lg={8}>
          {/* ORDERS */}
          <Card>
            <CardHeader>Orders</CardHeader>
            <CardBody>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Date</th>
                    <th>Slot</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.order_id}>
                      <td>{o.order_id}</td>
                      <td>₹ {o.total_amount}</td>
                      <td>{o.is_paid == 1 ? 'Yes' : 'No'}</td>
                      <td>{o.delivery_dates}</td>
                      <td>{o.slot}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>

          {/* WALLET TRANSACTIONS */}
          <Card className="mt-3">
            <CardHeader>Wallet Transactions</CardHeader>
            <CardBody>
              <Table bordered>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.transactions.map(txn => (
                    <tr key={txn.wallet_txn_id}>
                      <td>{txn.wallet_txn_id}</td>
                      <td>
                        <Badge bg={txn.type === 'credit' ? 'success' : 'danger'}>
                          {txn.type}
                        </Badge>
                      </td>
                      <td>₹ {txn.amount}</td>
                      <td>{txn.description}</td>
                      <td>{txn.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CustomerDetailPage;
