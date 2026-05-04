'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getSubjiList } from '../../helpers/getSubjiList';
import { toggleSubjiStatus } from '../../helpers/toggleSubjiStatus';
import { deleteSubji } from '../../helpers/deleteSubji';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardFooter, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';

const SubjiList = () => {
  const { data: session } = useSession();
  const [subjiData, setSubjiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubji = async () => {
    if (!session?.accessToken) return;

    const res = await getSubjiList(session.accessToken);

    console.log("RAW RESPONSE =>", res);

    const green = res?.green || res?.data?.green || [];
    const kathol = res?.kathol || res?.data?.kathol || [];

    const merged = [...green, ...kathol];

    console.log("MERGED =>", merged);

    setSubjiData(merged);
  };




  useEffect(() => {
    fetchSubji();
  }, [session]);

  const handleToggle = async (item) => {
    setLoading(true);
    await toggleSubjiStatus({
      subji_id: item.subji_id,
      is_active: item.is_active === '1' ? 0 : 1,
      token: session.accessToken,
    });
    await fetchSubji();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sabji?')) return;

    setLoading(true);
    await deleteSubji({ subji_id: id, token: session.accessToken });
    await fetchSubji();
    setLoading(false);
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <CardTitle as="h4">All Sabji List</CardTitle>
            <Link href="/subji/subji-add" className="btn btn-sm btn-primary">
              Add Sabji
            </Link>
          </CardHeader>

          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="bg-light-subtle">
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {subjiData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-3">
                      No Sabji Found
                    </td>
                  </tr>
                )}

                {subjiData.map(item => (
                  <tr key={item.subji_id}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>
                      {item.is_active === '1' ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>{item.subji_id}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant={item.is_active === '1' ? 'outline-danger' : 'outline-success'}
                          onClick={() => handleToggle(item)}
                          disabled={loading}
                        >
                          {item.is_active === '1' ? 'Deactivate' : 'Activate'}
                        </Button>

                        <Link
                          href={`/subji/subji-edit?id=${item.subji_id}`}
                          className="btn btn-soft-primary btn-sm"
                        >
                          <IconifyIcon icon="solar:pen-2-broken" />
                        </Link>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(item.subji_id)}
                          disabled={loading}
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

          <CardFooter className="text-end">
            Total: {subjiData.length}
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default SubjiList;
