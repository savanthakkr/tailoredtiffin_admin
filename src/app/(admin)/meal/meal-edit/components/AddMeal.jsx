'use client';

import TextFormInput from '@/components/form/TextFormInput';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  FormCheck,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useImageContext } from '../../meal-add/components/FileUploadWrapper';

const schema = yup.object({
  meals_name: yup.string().required(),
  price: yup.number().required(),
  description: yup.string().nullable(),
  subji_count: yup.number().required(),
  other_count: yup.number().required(),
  is_special_meal: yup.boolean(),
  special_item_id: yup.number().nullable(),
});

const AddMeal = ({ mealId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { uploadedImages, uploading } = useImageContext();

  const { control, handleSubmit, reset, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const isSpecialMeal = watch('is_special_meal');
  const [breads, setBreads] = useState([]);
  const [breadConfig, setBreadConfig] = useState([]);
  const [currentMealImage, setCurrentMealImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [sideItems, setSideItems] = useState([]);
  const [selectedSideItems, setSelectedSideItems] = useState([]);

  // 🔹 FETCH MEAL DETAILS
  useEffect(() => {
    if (!mealId || !session?.accessToken) return;

    const fetchMeal = async () => {
      const res = await fetch("https://api.tailoredtiffin.com/admin/get_meals", {
        headers: {
          Authorization: session.accessToken,
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (data.status === "success") {
        const meal = data.data.find(m => m.meals_id == mealId);

        if (meal) {
          reset({
            meals_name: meal.meals_name,
            price: meal.price,
            description: meal.description,
            subji_count: meal.subji_count,
            other_count: meal.other_count,
            is_special_meal: meal.is_special_meal == 1,
            special_item_id: meal.special_item_id,
            is_active: meal.is_active == 1,
          });
          // Handle bread_config - it might already be an object or a string
          const breadConfigData = typeof meal.bread_config === 'string' 
            ? JSON.parse(meal.bread_config || "[]")
            : (meal.bread_config || []);
          setBreadConfig(breadConfigData);
          setCurrentMealImage(meal.image);

          // Handle included_side_items
          let sideItemIds = meal.included_side_items || [];
          if (typeof sideItemIds === 'string') {
            try { sideItemIds = JSON.parse(sideItemIds); } catch { sideItemIds = []; }
          }
          setSelectedSideItems(sideItemIds.map(Number));
        }
      }
    };

    fetchMeal();
  }, [mealId, session, reset]);

  useEffect(() => {
    if (!session?.accessToken) return;

    fetch('https://api.tailoredtiffin.com/admin/get_bread', {
      headers: { Authorization: session.accessToken },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setBreads(res.data);
        }
      });

    fetch('https://api.tailoredtiffin.com/admin/get_side_items', {
      headers: { Authorization: session.accessToken },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setSideItems(res.data.filter(s => s.is_active === "1" || s.is_active === 1));
        }
      });
  }, [session]);

  const addBreadRow = () => {
    setBreadConfig(prev => [...prev, { bread_id: '', qty: 0 }]);
  };

  const updateBread = (index, field, value) => {
    const updated = [...breadConfig];
    updated[index][field] = value;
    setBreadConfig(updated);
  };

  const removeBread = index => {
    setBreadConfig(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSideItem = (sideItemId) => {
    setSelectedSideItems(prev =>
      prev.includes(sideItemId)
        ? prev.filter(id => id !== sideItemId)
        : [...prev, sideItemId]
    );
  };

  /* ===============================
     GET IMAGE FILENAMES
  =============================== */
  const getImageFilenames = () => {
    if (!uploadedImages || uploadedImages.length === 0) return [];
    
    return uploadedImages.map(file => {
      if (file instanceof File) {
        return file.name;
      }
      return file;
    });
  };

  // 🔹 SUBMIT EDIT
  const onSubmit = async (values) => {
    setSubmitting(true);
    setUploadError(null);

    try {
      const formData = new FormData();

      const payload = {
        meals_id: mealId,
        meals_name: values.meals_name,
        price: Number(values.price),
        description: values.description,
        subji_count: Number(values.subji_count),
        other_count: Number(values.other_count),
        included_side_items: selectedSideItems,
        bread_config: breadConfig,
        is_special_meal: values.is_special_meal ? 1 : 0,
        special_item_id: values.is_special_meal ? values.special_item_id : null,
      };

      // 1. Add meal data as JSON string
      formData.append('inputdata', JSON.stringify(payload));

      // 2. Add old_image if we have new images (for deletion on backend)
      if (uploadedImages && uploadedImages.length > 0) {
        if (currentMealImage) {
          formData.append('old_image', currentMealImage);
        }

        // 3. Add actual file objects (NOT filename strings)
        uploadedImages.forEach((file) => {
          if (file instanceof File) {
            formData.append('image', file);
          }
        });
      }

      // 4. Send as FormData
      const res = await fetch("https://api.tailoredtiffin.com/admin/edit_meal", {
        method: "POST",
        headers: {
          'Authorization': session?.accessToken,
          // Don't set Content-Type header - browser will set it with proper boundary
        },
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        router.push('/meal/meal-list');
      } else {
        alert(data.msg || 'Update failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* ERROR MESSAGE */}
      {uploadError && (
        <Card className="mb-3 border-danger">
          <CardBody className="text-danger">
            {uploadError}
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Meal</CardTitle>
        </CardHeader>

        <CardBody>
          {/* CURRENT IMAGE */}
          {currentMealImage && !uploadedImages?.length && (
            <Row className="mb-3">
              <Col lg={12}>
                <label className="form-label">Current Image</label>
                <img
                  src={currentMealImage}
                  alt="Current meal image"
                  style={{ maxWidth: '200px', height: 'auto', borderRadius: '4px' }}
                />
              </Col>
            </Row>
          )}

          <Row className="g-3">
            <Col lg={6}>
              <TextFormInput control={control} name="meals_name" label="Meal Name" />
            </Col>

            <Col lg={6}>
              <TextFormInput control={control} type="number" name="price" label="Price" />
            </Col>

            <Col lg={12}>
              <TextAreaFormInput control={control} name="description" label="Description" />
            </Col>

            <Col lg={4}>
              <TextFormInput control={control} type="number" name="subji_count" label="Subji Count" />
            </Col>

            <Col lg={4}>
              <TextFormInput control={control} type="number" name="other_count" label="Other Count" />
            </Col>

            {/* SIDE ITEMS CHECKBOXES */}
            {sideItems.length > 0 && (
              <Col lg={12}>
                <Card className="mb-3">
                  <CardHeader>
                    <CardTitle as="h4">Included Side Items</CardTitle>
                    <small className="text-muted">Each selected item = 1 qty included with the meal. For extra qty, user can add from extra items.</small>
                  </CardHeader>
                  <CardBody>
                    <Row className="g-3">
                      {sideItems.map(item => (
                        <Col lg={3} key={item.side_item_id}>
                          <FormCheck
                            label={`${item.name} (₹${item.price || 0}) - 1 qty`}
                            checked={selectedSideItems.includes(item.side_item_id)}
                            onChange={() => toggleSideItem(item.side_item_id)}
                          />
                        </Col>
                      ))}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            )}

            {/* 🍞 BREAD CONFIG */}
            <Col lg={12}>
              <Card className="mb-3">
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <CardTitle as="h4">Bread Configuration</CardTitle>
                  <Button size="sm" onClick={addBreadRow}>
                    + Add Bread
                  </Button>
                </CardHeader>

                <CardBody>
                  {!breadConfig.length && (
                    <p className="text-muted">No bread configured</p>
                  )}

                  {breadConfig.map((row, index) => (
                    <Row key={index} className="g-3 align-items-end mb-2">
                      <Col lg={6}>
                        <label className="form-label">Bread</label>
                        <select
                          className="form-select"
                          value={row.bread_id}
                          onChange={e =>
                            updateBread(index, 'bread_id', Number(e.target.value))
                          }
                        >
                          <option value="">Select bread</option>
                          {breads.map(b => (
                            <option key={b.bread_id} value={b.bread_id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </Col>

                      <Col lg={4}>
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={row.qty}
                          onChange={e =>
                            updateBread(index, 'qty', Number(e.target.value))
                          }
                        />
                      </Col>

                      <Col lg={2}>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeBread(index)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </CardBody>
              </Card>
            </Col>

            <Col lg={4}>
              <FormCheck
                type="switch"
                label="Special Meal"
                {...control.register('is_special_meal')}
              />
            </Col>

            {isSpecialMeal && (
              <Col lg={4}>
                <TextFormInput
                  control={control}
                  type="number"
                  name="special_item_id"
                  label="Special Item ID"
                />
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>

      <div className="p-3 bg-light mt-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button 
              type="submit" 
              className="w-100"
              disabled={submitting || uploading}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Col>
          <Col lg={2}>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => router.push('/meal/meal-list')}
              disabled={submitting || uploading}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default AddMeal;
