'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getSideItemList } from '../helpers/getSideItemList';
import { toggleSideItemStatus } from '../helpers/toggleSideItemStatus';
import { deleteSideItem } from '../helpers/deleteSideItem';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardFooter, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';

const SideItemList = () => {
  const { data: session } = useSession();
  const [sideItemData, setSideItemData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSideItems = async () => {
    if (!session?.accessToken) return;
    const data = await getSideItemList(session.accessToken);
    setSideItemData(data);
  };

  useEffect(() => {
    fetchSideItems();
  }, [session]);

  const handleToggleStatus = async (item) => {
    if (!session?.accessToken) return;
    setLoading(true);

    await toggleSideItemStatus({
      side_item_id: item.side_item_id,
      is_active: item.is_active === "1" ? 0 : 1,
      token: session.accessToken,
    });

    await fetchSideItems();
    setLoading(false);
  };

  const handleDelete = async (side_item_id) => {
    if (!session?.accessToken) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this side item?');
    if (!confirmDelete) return;

    setLoading(true);

    const res = await deleteSideItem({
      side_item_id,
      token: session.accessToken,
    });

    if (res.status === 'success') {
      await fetchSideItems();
    } else {
      alert(res.msg || 'Failed to delete side item');
    }

    setLoading(false);
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as="h4" className="flex-grow-1">
              All Side Items
            </CardTitle>
            <Link href="/sideitem/sideitem-add" className="btn btn-sm btn-primary">
              Add Side Item
            </Link>
          </CardHeader>

          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered">
              <thead className="bg-light-subtle">
                <tr>
                  <th>Side Item Name</th>
                  <th>Status</th>
                  <th>ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {sideItemData.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-3">
                      No Side Items Found
                    </td>
                  </tr>
                )}

                {sideItemData.map((item) => (
                  <tr key={item.side_item_id}>
                    <td>{item.name}</td>
                    <td>
                      {item.is_active === "1" ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>{item.side_item_id}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant={item.is_active === "1" ? "outline-danger" : "outline-success"}
                          disabled={loading}
                          onClick={() => handleToggleStatus(item)}
                        >
                          {item.is_active === "1" ? "Deactivate" : "Activate"}
                        </Button>

                        <Link
                          href={`/sideitem/sideitem-edit?id=${item.side_item_id}`}
                          className="btn btn-soft-primary btn-sm"
                        >
                          <IconifyIcon icon="solar:pen-2-broken" />
                        </Link>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={loading}
                          onClick={() => handleDelete(item.side_item_id)}
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
            Total: {sideItemData.length} items
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default SideItemList;
