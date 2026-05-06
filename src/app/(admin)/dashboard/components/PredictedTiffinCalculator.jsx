'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardBody, CardTitle, Col, Row, Form, Button, Table, Badge } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getDefaultDateSlot } from '@/helpers/dateSlot';

const PredictedTiffinCalculator = () => {
  const { data: session } = useSession();
  const defaultVal = getDefaultDateSlot();

  const [date, setDate] = useState(defaultVal.date);
  const [slot, setSlot] = useState(defaultVal.slot);
  const [orders, setOrders] = useState([]);
  const [totals, setTotals] = useState(null);
  const [predictedTiffins, setPredictedTiffins] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch all orders for the given date and slot
  const fetchOrders = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.tailoredtiffin.com/admin/get_admin_daily_orders?date=${date}&slot=${slot}`,
        { headers: { Authorization: session.accessToken } }
      );
      const json = await res.json();

      if (json.status === 'success') {
        setOrders(json.data);
        calculateTotals(json.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals from all orders
  const calculateTotals = (orderList) => {
    const itemMap = {};
    let totalOrderCount = orderList.length;

    // Process each order
    orderList.forEach(order => {
      // Process bread items
      if (order.totals?.bread) {
        order.totals.bread.forEach(item => {
          if (!itemMap[`bread_${item.name}`]) {
            itemMap[`bread_${item.name}`] = { type: 'Bread', name: item.name, qty: 0 };
          }
          itemMap[`bread_${item.name}`].qty += Number(item.qty || 0);
        });
      }

      // Process subji items
      if (order.totals?.subji) {
        order.totals.subji.forEach(item => {
          if (!itemMap[`subji_${item.name}`]) {
            itemMap[`subji_${item.name}`] = { type: 'Subji', name: item.name, qty: 0 };
          }
          itemMap[`subji_${item.name}`].qty += Number(item.qty || 0);
        });
      }

      // Process other items
      if (order.totals?.other) {
        order.totals.other.forEach(item => {
          if (!itemMap[`other_${item.name}`]) {
            itemMap[`other_${item.name}`] = { type: 'Other', name: item.name, qty: 0 };
          }
          itemMap[`other_${item.name}`].qty += Number(item.qty || 0);
        });
      }

      // Count tiffin
      if (!itemMap['tiffin']) {
        itemMap['tiffin'] = { type: 'Tiffin', name: 'Meals', qty: 0 };
      }
      itemMap['tiffin'].qty += 1;
    });

    setTotals({
      items: Object.values(itemMap),
      totalOrders: totalOrderCount
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [session, date, slot]);

  // Calculate predicted items
  const calculatePredictedItems = () => {
    if (!totals || totals.totalOrders === 0 || !predictedTiffins) return [];

    return totals.items.map(item => ({
      ...item,
      predicted: Math.round((item.qty / totals.totalOrders) * predictedTiffins)
    }));
  };

  const predictedItems = calculatePredictedItems();

  return (
    <Col xxl={12}>
      <Card>
        <CardBody>
          <CardTitle as="h5" className="mb-4">
            <IconifyIcon icon="solar:calculator-linear" className="me-2" />
            Predicted Tiffin Calculator
          </CardTitle>

          {/* Date and Slot Selection */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="mb-2">Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="mb-2">Slot</Form.Label>
                <Form.Select
                  value={slot}
                  onChange={e => setSlot(e.target.value)}
                >
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="mb-2">Predicted Tiffins</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={predictedTiffins}
                  onChange={e => setPredictedTiffins(Number(e.target.value))}
                  placeholder="Enter predicted number"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Current Order Summary */}
          {totals && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="p-3 bg-light rounded-2">
                    <p className="text-muted mb-2">Total Current Orders</p>
                    <h3 className="mb-0 text-primary">{totals.totalOrders}</h3>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 bg-light rounded-2">
                    <p className="text-muted mb-2">Predicted Tiffins</p>
                    <h3 className="mb-0 text-success">
                      {predictedTiffins}
                      {predictedTiffins > 0 && (
                        <span className="text-muted fs-6 ms-2">
                          (+{((predictedTiffins / totals.totalOrders - 1) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </h3>
                  </div>
                </Col>
              </Row>

              {/* Current vs Predicted Table */}
              <div className="table-responsive">
                <Table className="table-sm mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Item Type</th>
                      <th>Item Name</th>
                      <th className="text-center">Current Orders</th>
                      <th className="text-center">Per Order Ratio</th>
                      <th className="text-center">Predicted (if {predictedTiffins})</th>
                      <th className="text-center">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totals.items.map((item, idx) => {
                      const predicted = Math.round(
                        (item.qty / totals.totalOrders) * predictedTiffins
                      );
                      const difference = predicted - item.qty;

                      return (
                        <tr key={idx}>
                          <td>
                            <Badge
                              bg={
                                item.type === 'Bread'
                                  ? 'info'
                                  : item.type === 'Subji'
                                  ? 'success'
                                  : item.type === 'Other'
                                  ? 'warning'
                                  : 'primary'
                              }
                            >
                              {item.type}
                            </Badge>
                          </td>
                          <td>{item.name}</td>
                          <td className="text-center fw-semibold">{item.qty}</td>
                          <td className="text-center">
                            {(item.qty / totals.totalOrders).toFixed(2)}
                          </td>
                          <td className="text-center text-primary fw-semibold">
                            {predicted}
                          </td>
                          <td className="text-center">
                            {difference >= 0 ? (
                              <Badge bg="success">+{difference}</Badge>
                            ) : (
                              <Badge bg="danger">{difference}</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              {predictedTiffins > 0 && (
                <hr className="my-4" />
              )}

              {predictedTiffins > 0 && (
                <div>
                  <h6 className="mb-3">Summary by Category</h6>
                  <Row>
                    {['Bread', 'Subji', 'Other', 'Tiffin'].map(category => {
                      const categoryItems = totals.items.filter(
                        i => i.type === category
                      );
                      const currentTotal = categoryItems.reduce(
                        (sum, i) => sum + i.qty,
                        0
                      );
                      const predictedTotal = categoryItems.reduce(
                        (sum, i) =>
                          sum +
                          Math.round((i.qty / totals.totalOrders) * predictedTiffins),
                        0
                      );

                      return (
                        <Col md={3} xs={6} key={category} className="mb-3">
                          <div className="p-3 border rounded">
                            <p className="text-muted mb-2 small">{category}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <p className="mb-0">
                                  <small className="text-muted">Current:</small>
                                </p>
                                <h5 className="mb-0">{currentTotal}</h5>
                              </div>
                              <div className="text-end">
                                <p className="mb-0">
                                  <small className="text-muted">Predicted:</small>
                                </p>
                                <h5 className="mb-0 text-primary">
                                  {predictedTotal}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              )}
            </>
          )}

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default PredictedTiffinCalculator;
