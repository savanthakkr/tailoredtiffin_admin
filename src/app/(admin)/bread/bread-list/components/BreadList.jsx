'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getBreadList } from '../helpers/getBreadList';
import { toggleBreadStatus } from '../helpers/toggleBreadStatus';
import { deleteBread } from '../helpers/deleteBread'; // ✅ NEW
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardFooter, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';

const BreadList = () => {
  const { data: session } = useSession();
  const [breadData, setBreadData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBread = async () => {
    if (!session?.accessToken) return;
    const data = await getBreadList(session.accessToken);
    setBreadData(data);
  };

  useEffect(() => {
    fetchBread();
  }, [session]);

  const handleToggleStatus = async (item) => {
    if (!session?.accessToken) return;
    setLoading(true);

    await toggleBreadStatus({
      bread_id: item.bread_id,
      is_active: item.is_active === "1" ? 0 : 1,
      token: session.accessToken,
    });

    await fetchBread();
    setLoading(false);
  };

  // ✅ DELETE HANDLER
  const handleDelete = async (bread_id) => {
    if (!session?.accessToken) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this bread?');
    if (!confirmDelete) return;

    setLoading(true);

    const res = await deleteBread({
      bread_id,
      token: session.accessToken,
    });

    if (res.status === 'success') {
      await fetchBread();
    } else {
      alert(res.msg || 'Failed to delete bread');
    }

    setLoading(false);
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as="h4" className="flex-grow-1">
              All Bread List
            </CardTitle>
            <Link href="/bread/bread-add" className="btn btn-sm btn-primary">
              Add Bread
            </Link>
          </CardHeader>

          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered">
              <thead className="bg-light-subtle">
                <tr>
                  <th>Bread Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {breadData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-3">
                      No Bread Found
                    </td>
                  </tr>
                )}

                {breadData.map((item) => (
                  <tr key={item.bread_id}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>
                      {item.is_active === "1" ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>{item.bread_id}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {/* STATUS */}
                        <Button
                          size="sm"
                          variant={item.is_active === "1" ? "outline-danger" : "outline-success"}
                          disabled={loading}
                          onClick={() => handleToggleStatus(item)}
                        >
                          {item.is_active === "1" ? "Deactivate" : "Activate"}
                        </Button>

                        {/* EDIT */}
                        <Link
                          href={`/bread/bread-edit?id=${item.bread_id}`}
                          className="btn btn-soft-primary btn-sm"
                        >
                          <IconifyIcon icon="solar:pen-2-broken" />
                        </Link>

                        {/* DELETE */}
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={loading}
                          onClick={() => handleDelete(item.bread_id)}
                        >
                          <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CardFooter className="border-top text-end">
            Total: {breadData.length} items
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default BreadList;
