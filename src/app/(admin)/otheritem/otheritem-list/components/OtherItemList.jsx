'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getOtherItemList } from '../helpers/getOtherItemList';
import { toggleOtherItemStatus } from '../helpers/toggleOtherItemStatus';
import { deleteOtherItem } from '../helpers/deleteOtherItem'; // ✅ NEW
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardFooter, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';

const OtherItemList = () => {
  const { data: session } = useSession();
  const [otheritemData, setOtherItemData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOtherItem = async () => {
    if (!session?.accessToken) return;
    const data = await getOtherItemList(session.accessToken);
    setOtherItemData(data);
    console.log(data);
    console.log("ajdbashjdhasdasd");
  };

  useEffect(() => {
    fetchOtherItem();
  }, [session]);

  const handleToggleStatus = async (item) => {
    if (!session?.accessToken) return;
    setLoading(true);

    await toggleOtherItemStatus({
      other_item_id: item.other_item_id,
      is_active: item.is_active === "1" ? 0 : 1,
      token: session.accessToken,
    });

    await fetchOtherItem();
    setLoading(false);
  };

  // ✅ DELETE HANDLER
  const handleDelete = async (other_item_id) => {
    if (!session?.accessToken) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this otheritem?');
    if (!confirmDelete) return;

    setLoading(true);

    const res = await deleteOtherItem({
      other_item_id,
      token: session.accessToken,
    });

    if (res.status === 'success') {
      await fetchOtherItem();
    } else {
      alert(res.msg || 'Failed to delete otheritem');
    }

    setLoading(false);
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as="h4" className="flex-grow-1">
              All OtherItem List
            </CardTitle>
            <Link href="/otheritem/otheritem-add" className="btn btn-sm btn-primary">
              Add OtherItem
            </Link>
          </CardHeader>

          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered">
              <thead className="bg-light-subtle">
                <tr>
                  <th>OtherItem Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {otheritemData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-3">
                      No OtherItem Found
                    </td>
                  </tr>
                )}

                {otheritemData.map((item) => (
                  <tr key={item.other_item_id}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>
                      {item.is_active === "1" ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>{item.other_item_id}</td>
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
                          href={`/otheritem/otheritem-edit?id=${item.other_item_id}`}
                          className="btn btn-soft-primary btn-sm"
                        >
                          <IconifyIcon icon="solar:pen-2-broken" />
                        </Link>

                        {/* DELETE */}
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={loading}
                          onClick={() => handleDelete(item.other_item_id)}
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
            Total: {otheritemData.length} items
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default OtherItemList;
