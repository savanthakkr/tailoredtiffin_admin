'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getMealList } from '../helpers/getMealList';
import { toggleMealStatus } from '../helpers/toggleMealStatus';
import { deleteMeal } from '../helpers/deleteMeal';
import { DebugMealData } from '../DebugMealData';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Button,
} from 'react-bootstrap';

const MealList = () => {
  const { data: session } = useSession();
  const [mealData, setMealData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeal = async () => {
    if (!session?.accessToken) return;
    const data = await getMealList(session.accessToken);
    
    // LOG: Check what data we're receiving
    console.log("=== MEAL DATA RECEIVED ===");
    console.log("Total meals:", data.length);
    if (data.length > 0) {
      console.log("First meal:", data[0]);
      console.log("First meal image:", data[0].image);
      console.log("All meal images:", data.map(m => ({ name: m.meals_name, image: m.image })));
    }
    
    setMealData(data);
  };

  useEffect(() => {
    fetchMeal();
  }, [session]);

  const handleToggleStatus = async (item) => {
    if (!session?.accessToken) return;
    setLoading(true);

    await toggleMealStatus({
      meals_id: item.meals_id,
      is_active: item.is_active === "1" ? 0 : 1,
      token: session.accessToken,
    });

    await fetchMeal();
    setLoading(false);
  };

  const handleDelete = async (meals_id) => {
    if (!session?.accessToken) return;

    if (!confirm('Are you sure you want to delete this meal?')) return;

    setLoading(true);
    const res = await deleteMeal({ meals_id, token: session.accessToken });

    if (res.status === 'success') {
      await fetchMeal();
    } else {
      alert(res.msg || 'Delete failed');
    }

    setLoading(false);
  };

  return (
    <Row>
      {/* DEBUG COMPONENT - Logs to console */}
      <DebugMealData data={mealData} />
      
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <CardTitle as="h4">All Meal List</CardTitle>
            <Link href="/meal/meal-add" className="btn btn-sm btn-primary">
              Add Meal
            </Link>
          </CardHeader>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Image</th>
                  <th>ID</th>
                  <th>Meal Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Bread</th>
                  <th>Sabji</th>
                  <th>Other</th>
                  <th>Special</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {mealData.length === 0 && (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No Meals Found
                    </td>
                  </tr>
                )}

                {mealData.map((item) => (
                  <tr key={item.meals_id}>
                    <td>
                      {item.image ? (
                        <>
                          {console.log(`Meal ${item.meals_id} (${item.meals_name}) - Image URL:`, item.image)}
                          <img 
                            src={encodeURI(item.image)} 
                            alt={item.meals_name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              console.error(`Failed to load image for meal ${item.meals_id}:`, item.image);
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<span class="text-muted" style="font-size: 12px;">Image not found</span>';
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {console.log(`Meal ${item.meals_id} (${item.meals_name}) - NO IMAGE`)}
                          <span className="text-muted">N/A</span>
                        </>
                      )}
                    </td>
                    <td>{item.meals_id}</td>
                    <td>{item.meals_name}</td>
                    <td>₹{item.price}</td>
                    <td>{item.description || '-'}</td>
                    <td>{item.bread_count}</td>
                    <td>{item.subji_count}</td>
                    <td>{item.other_count}</td>
                    <td>
                      {item.is_special_meal === "1"
                        ? 'Yes'
                        : 'No'}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          item.is_active === "1"
                            ? 'bg-success'
                            : 'bg-danger'
                        }`}
                      >
                        {item.is_active === "1" ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{item.created_at}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant={
                            item.is_active === "1"
                              ? 'outline-danger'
                              : 'outline-success'
                          }
                          disabled={loading}
                          onClick={() => handleToggleStatus(item)}
                        >
                          {item.is_active === "1" ? 'Deactivate' : 'Activate'}
                        </Button>

                        <Link
                          href={`/meal/meal-edit?id=${item.meals_id}`}
                          className="btn btn-soft-primary btn-sm"
                        >
                          <IconifyIcon icon="solar:pen-2-broken" />
                        </Link>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={loading}
                          onClick={() => handleDelete(item.meals_id)}
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
            Total Meals: {mealData.length}
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

export default MealList;
