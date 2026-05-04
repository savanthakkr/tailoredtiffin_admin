'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getSpacialItemList } from '../helpers/getSpacialItemList';
import { toggleSpacialItemStatus } from '../helpers/toggleSpacialItemStatus';
import { deleteSpacialItem } from '../helpers/deleteSpacialItem'; // ✅ NEW
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardFooter, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';

const SpacialItemList = () => {
  const { data: session } = useSession();
  const [spacialitemData, setSpacialItemData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSpacialItem = async () => {
    if (!session?.accessToken) return;
    const data = await getSpacialItemList(session.accessToken);
    setSpacialItemData(data);
    console.log(data);
    console.log("ajdbashjdhasdasd");
  };

  useEffect(() => {
    fetchSpacialItem();
  }, [session]);

  const handleToggleStatus = async (item) => {
    if (!session?.accessToken) return;
    setLoading(true);

    await toggleSpacialItemStatus({
      special_item_id: item.special_item_id,
      is_active: item.is_active === "1" ? 0 : 1,
      token: session.accessToken,
    });

    await fetchSpacialItem();
    setLoading(false);
  };

  // ✅ DELETE HANDLER
  const handleDelete = async (special_item_id) => {
    if (!session?.accessToken) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this spacialitem?');
    if (!confirmDelete) return;

    setLoading(true);

    const res = await deleteSpacialItem({
      special_item_id,
      token: session.accessToken,
    });

    if (res.status === 'success') {
      await fetchSpacialItem();
    } else {
      alert(res.msg || 'Failed to delete spacialitem');
    }

    setLoading(false);
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as="h4" className="flex-grow-1">
              All SpacialItem List
            </CardTitle>
            <Link href="/spacialitem/spacialitem-add" className="btn btn-sm btn-primary">
              Add SpacialItem
            </Link>
          </CardHeader>

          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered">
              <thead className="bg-light-subtle">
                <tr>
                  <th>SpacialItem Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {spacialitemData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-3">
                      No SpacialItem Found
                    </td>
                  </tr>
                )}

                {spacialitemData.map((item) => (
                  <tr key={item.special_item_id}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>
                      {item.is_active === "1" ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>{item.special_item_id}</td>
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
                          href={`/spacialitem/spacialitem-edit?id=${item.special_item_id}`}
                          className="btn btn-soft-primary btn-sm"
                        >
                          <IconifyIcon icon="solar:pen-2-broken" />
                        </Link>

                        {/* DELETE */}
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={loading}
                          onClick={() => handleDelete(item.special_item_id)}
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
            Total: {spacialitemData.length} items
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default SpacialItemList;
