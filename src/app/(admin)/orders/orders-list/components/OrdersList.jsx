'use client';

import { useEffect, useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Link from 'next/link';
import { Card, CardBody, CardFooter, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import OrdersDataCardPage from './OrdersDataCard';
import { useSession } from 'next-auth/react';
import { getDefaultDateSlot } from '@/helpers/dateSlot';
import logoDark from '@/assets/images/logo-dark.png';



const OrdersList = () => {

  const { data: session } = useSession();
  const defaultVal = getDefaultDateSlot();

  const [date, setDate] = useState(defaultVal.date);
  const [slot, setSlot] = useState(defaultVal.slot);
  const [orders, setOrders] = useState([]);
  // Remove kitchen state, will compute from orders
  const [printedStatus, setPrintedStatus] = useState({});

  // Get storage key for printed status
  const getPrintStatusKey = () => `printedStatus_${date}_${slot}`;

  // Load printed status from localStorage
  const loadPrintedStatus = () => {
    try {
      const stored = localStorage.getItem(getPrintStatusKey());
      const status = stored ? JSON.parse(stored) : {};
      setPrintedStatus(status);
    } catch (error) {
      console.error('Error loading printed status:', error);
      setPrintedStatus({});
    }
  };

  // Save printed status to localStorage
  const savePrintedStatus = (newStatus) => {
    try {
      localStorage.setItem(getPrintStatusKey(), JSON.stringify(newStatus));
      setPrintedStatus(newStatus);
    } catch (error) {
      console.error('Error saving printed status:', error);
    }
  };

  // Toggle printed status for an order
  const togglePrintedStatus = (orderId) => {
    const newStatus = { ...printedStatus };
    newStatus[orderId] = !newStatus[orderId];
    savePrintedStatus(newStatus);
  };

  /* ============================
     FETCH DAILY ORDERS
  ============================ */
  const fetchOrders = async () => {
    const res = await fetch(
      `https://api.tailoredtiffin.com/admin/get_admin_daily_orders?date=${date}&slot=${slot}`,
      { headers: { Authorization: session?.accessToken } }
    );
    const json = await res.json();
    console.log(json);
    console.log("adsadasdasds");
    
    
    if (json.status === 'success') setOrders(json.data);
  };

  // Aggregate kitchen summary from all orders
  const getKitchenSummary = () => {
    const kitchenMap = {};
    orders.forEach(order => {
      const items = buildFinalTotals(order.totals, order.extras, order.meal);
      items.forEach(item => {
        const key = item.name;
        if (!kitchenMap[key]) {
          kitchenMap[key] = { name: item.name, total_qty: 0 };
        }
        kitchenMap[key].total_qty += Number(item.qty || 0);
      });
    });
    return Object.values(kitchenMap);
  };

  const buildFinalTotals = (totals, extras = [], meal = null) => {
    const map = {};

    // Helper to normalize type names
    const normalizeType = (type) => {
      if (!type) return '';
      if (type === 'side_items' || type === 'side_item') return 'Add On';
      if (type === 'other' || type === 'other_item' || type === 'other_items') return 'Other';
      if (type === 'bread') return 'Bread';
      if (type === 'subji' || type === 'subjis') return 'Subji';
      if (type === 'special' || type === 'special_item') return 'Special';
      if (type === 'meal') return 'Meal';
      return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const addItem = (type, name, qty) => {
      const key = `${type}_${name}`;
      if (!map[key]) {
        map[key] = { type, name, qty: 0 };
      }
      map[key].qty += Number(qty || 0);
    };

    // Add meal itself
    if (meal) {
      addItem('Meal', meal.name, meal.quantity);
    }

    // Base totals
    totals.bread?.forEach(b => addItem(normalizeType('bread'), b.name, b.qty));
    totals.subji?.forEach(s => addItem(normalizeType('subji'), s.name, s.qty));
    totals.other?.forEach(o => addItem(normalizeType('other'), o.name, o.qty));
    totals.side_items?.forEach(si => addItem(normalizeType('side_items'), si.name, si.qty));
    totals.special?.forEach(sp => addItem(normalizeType('special'), sp.name, sp.qty));

    // Extras
    extras.forEach(e => {
      addItem(normalizeType(e.item_type), e.name, e.qty);
    });

    return Object.values(map);
  };

const printInvoice = (order) => {
  const logoUrl = logoDark.src; // ⭐ VERY IMPORTANT

  // Helper to build item rows
  const buildItemRows = () => {
    let rows = "";
    // Use buildFinalTotals to get all items
    const finalTotals = buildFinalTotals(order.totals, order.extras, order.meal);
    if (finalTotals.length) {
      finalTotals.forEach((item) => {
        rows += `<tr><td style='text-align:left;'>${item.name}</td><td>${item.qty}</td></tr>`;
      });
    } else {
      rows = `<tr><td colspan='2'>No items</td></tr>`;
    }
    return rows;
  };

  // Payment info
  const payment = order.payment || {};
  const paidStatus = payment.is_paid == 1 ? "Paid" : "Pending";

  // Customer info
  const customer = order.user || {};

  const html = `
    <html>
    <head>
      <title>Invoice</title>
      <style>
        body {
          font-family: Arial;
          text-align:center;
          padding:20px;
        }
        .box {
          border:1px dashed #000;
          padding:15px;
          width:320px;
          margin:auto;
        }
        img {
          width:90px;
          margin-bottom:10px;
        }
        h3 {
          margin:5px 0;
        }
        p {
          margin:4px 0;
          font-size:14px;
        }
        hr {
          margin:10px 0;
        }
        table {
          width:100%;
          border-collapse:collapse;
          margin:10px 0;
        }
        th, td {
          border:1px solid #ddd;
          padding:4px 6px;
          font-size:13px;
        }
        th {
          background:#f5f5f5;
        }
        .totals {
          text-align:right;
          font-weight:bold;
        }
        .section-title {
          margin:10px 0 2px 0;
          font-size:15px;
          font-weight:bold;
          text-align:left;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <img src="${logoUrl}" />
        <h3>Tailored Tiffin</h3>
        <p><b>Invoice:</b> ${order.delivery_invoice_no}</p>
        <p><b>Order ID:</b> ${order.order_id}</p>
        <p><b>Date:</b> ${order.delivery_date}</p>
        <p><b>Slot:</b> ${order.slot}</p>
        <hr/>
        <div class="section-title">Customer</div>
        <p><b>Name:</b> ${customer.name || "-"}</p>
        <p><b>Mobile:</b> ${customer.mobile || "-"}</p>
        <hr/>
        <div class="section-title">Items</div>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th></tr>
          </thead>
          <tbody>
            ${buildItemRows()}
          </tbody>
        </table>
        <hr/>
        <div class="section-title">Delivery</div>
        <p><b>Delivery Boy:</b> ${order.delivery_boy_name || "-"}</p>
        <p><b>Address:</b> ${order.address || order.address || "-"}</p>
        <hr/>
        <div class="section-title">Payment</div>
        <p><b>Total:</b> ₹${payment.total_amount || "-"}</p>
        <p><b>Status:</b> ${paidStatus}</p>
      </div>
      <script>
        window.print();
        window.onafterprint = () => window.close();
      </script>
    </body>
    </html>
  `;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
};
const printAllOrders = () => {
  if (!orders || orders.length === 0) return;

  const logoUrl = logoDark.src;

  const html = `
    <html>
    <head>
      <title>All Orders Print</title>
      <style>
        body { font-family: Arial; padding: 20px; }

        .page {
          page-break-after: always;
          border: 1px solid #000;
          padding: 15px;
          margin-bottom: 20px;
        }

        .logo { width: 120px; display:block; margin:auto; }

        .row { margin: 6px 0; font-size: 14px; }

        table {
          width:100%;
          border-collapse:collapse;
        }

        th, td {
          border:1px solid #ddd;
          padding:6px;
        }

        th { background:#f5f5f5; }

        .section { font-weight:bold; margin-top:10px; }
      </style>
    </head>

    <body>
      ${orders
        .map((order) => {
          const customer = order.user || {};
          const payment = order.payment || {};
          const paidStatus =
            payment.is_paid == 1 ? "Paid" : "Pending";

          const items = buildFinalTotals(
            order.totals,
            order.extras,
            order.meal
          );

          return `
            <div class="page">

              <img class="logo" src="${logoUrl}" />

              <div class="row"><b>Order ID:</b> #${order.order_id}</div>
              <div class="row"><b>Status:</b> ${paidStatus}</div>

              <div class="row"><b>Customer:</b> ${customer.name || "-"}</div>
              <div class="row"><b>Address:</b> ${order.address || "-"}</div>

              <div class="section">Order Details</div>

              <table>
                <tr><th>Item</th><th>Qty</th></tr>
                ${items
                  .map(
                    (i) => `
                  <tr><td>${i.name}</td><td>${i.qty}</td></tr>
                `
                  )
                  .join("")}
              </table>

            </div>
          `;
        })
        .join("")}
    </body>
    </html>
  `;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};




  useEffect(() => {
    if (!session?.accessToken) return;
    fetchOrders();
    loadPrintedStatus();
  }, [date, slot, session]);

  return (
    <>
      {/* 🔹 Kitchen Summary Cards */}
      <OrdersDataCardPage kitchenData={getKitchenSummary()} />

      <Row>
        <Col xl={12}>
          <Card>
            <div className="d-flex card-header justify-content-between align-items-center">
              <CardTitle as={'h4'}>Daily Orders</CardTitle>


              <div className="d-flex gap-2">
                {/* DATE PICKER */}
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                {/* SLOT DROPDOWN */}
                <Dropdown>
                  <DropdownToggle className="btn btn-outline-light">
                    {slot.toUpperCase()}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => setSlot('lunch')}>
                      Lunch
                    </DropdownItem>
                    <DropdownItem onClick={() => setSlot('dinner')}>
                      Dinner
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Link
  href={`/orders/orders-map?date=${date}&slot=${slot}`}
  className="btn btn-danger"
>
  Show Orders Map
</Link>
<button
                onClick={printAllOrders}
                className="btn btn-danger"
              >
                Print All
              </button>
              </div>
            </div>
            

            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Meal</th>
                      <th>Total</th>
                      <th>Delivery Boy</th>
                      <th>Invoice</th>
                      <th>Print</th>
                      <th>Printed</th>
                    </tr>
                  </thead>
                 <tbody>
  {orders.map(o => {
    const isSpecial = !!o.selected_items.special_item;

    return (
      <tr key={o.order_id}>
        <td>#{o.order_id}</td>

        {/* CUSTOMER */}
        <td>
          <b>{o.user.name}</b>
          <br />
          <small>{o.user.mobile}</small>
        </td>

        {/* MEAL */}
        <td>
          <b>{o.meal.name}</b>
          <br />
          Qty: {o.meal.quantity}
        </td>

       


        {/* TOTAL COUNTS */}
        <td>
  {(() => {
    if (isSpecial) {
      return (
        <div>
          {o.totals.special?.map(s => (
            <div key={s.id}>
              <b>Special:</b> {s.qty} {s.name}
            </div>
          ))}
        </div>
      );
    }

    const finalTotals = buildFinalTotals(o.totals, o.extras, o.meal);

    return finalTotals.length ? (
      finalTotals.map((t, i) => (
        <div key={i}>
          <b>{t.type}:</b> {t.qty} {t.name}
        </div>
      ))
    ) : (
      <span className="text-muted">-</span>
    );
    
  })()}
</td>
 <td>{o.delivery_boy_name || "-"}</td>
<td>{o.delivery_invoice_no || "-"}</td>

<td>
  <button
    className="btn btn-sm btn-dark"
    onClick={() => {
      printInvoice(o);
      togglePrintedStatus(o.order_id);
    }}
  >
    Print
  </button>
</td>

<td>
  {printedStatus[o.order_id] ? (
    <span className="badge bg-success">
      <IconifyIcon icon="solar:check-circle-linear" /> Printed
    </span>
  ) : (
    <span className="badge bg-warning text-dark">
      <IconifyIcon icon="solar:clock-circle-linear" /> Not Printed
    </span>
  )}
</td>




        {/* PAYMENT */}
        <td>
          ₹ {o.payment.total_amount}
          <br />
          <span
            className={`badge bg-${
              o.payment.is_paid == 1 ? "success" : "warning"
            }`}
          >
            {o.payment.is_paid == 1 ? "Paid" : "Pending"}
          </span>
        </td>
      </tr>
    );
  })}
</tbody>


                </table>
              </div>
            </CardBody>

            <CardFooter />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrdersList;
