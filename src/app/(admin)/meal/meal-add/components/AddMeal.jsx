'use client';

import TextFormInput from '@/components/form/TextFormInput';
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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useImageContext } from './FileUploadWrapper';

/* ===============================
   VALIDATION
================================ */
const schema = yup.object({
  meals_name: yup.string().required('Meal name is required'),
  price: yup.number().required('Price is required'),
  description: yup.string().required('Description is required'),
  subji_count: yup.number().min(0).required(),
  other_count: yup.number().min(0).required(),
});

const AddMeal = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { uploadedImages, uploading } = useImageContext();

  /* ===============================
     STATE
  =============================== */
  const [breads, setBreads] = useState([]);
  const [breadConfig, setBreadConfig] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [sideItems, setSideItems] = useState([]);
  const [selectedSideItems, setSelectedSideItems] = useState([]);

  /* ===============================
     FORM
  =============================== */
  const { handleSubmit, control, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      meals_name: '',
      price: '',
      description: '',
      subji_count: 0,
      other_count: 0,
      is_special_meal: false,
      is_active: true,
    },
  });

  /* ===============================
     FETCH BREADS
  =============================== */
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

  /* ===============================
     BREAD CONFIG HANDLERS
  =============================== */
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
     SUBMIT
  =============================== */
  const onSubmit = async values => {
    if (!session?.accessToken) {
      alert('Unauthorized');
      return;
    }

    setSubmitting(true);
    setUploadError(null);

    try {
      // Create FormData instead of JSON
      const formData = new FormData();

      // 1. Add meal data as JSON string
      const payload = {
        meals_name: values.meals_name,
        price: Number(values.price),
        description: values.description,

        bread_config: breadConfig.filter(
          b => b.bread_id && Number(b.qty) > 0
        ),

        subji_count: Number(values.subji_count),
        other_count: Number(values.other_count),

        included_side_items: selectedSideItems,

        is_special_meal: values.is_special_meal ? 1 : 0,
        special_item_id: null,
      };

      formData.append('inputdata', JSON.stringify(payload));

      // 2. Add actual file objects (NOT filename strings)
      if (uploadedImages && uploadedImages.length > 0) {
        uploadedImages.forEach((file, index) => {
          if (file instanceof File) {
            formData.append('image', file);
          }
        });
      }

      // 3. Send as FormData
      const res = await fetch(
        'https://api.tailoredtiffin.com/admin/add/add_meal',
        {
          method: 'POST',
          headers: {
            'Authorization': session.accessToken,
            // Don't set Content-Type header - browser will set it with proper boundary
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (data.status === 'success') {
        router.push('/meal/meal-list');
      } else {
        alert(data.msg || 'Failed to add meal');
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
     UI
  =============================== */
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

      {/* BASIC INFO */}
      <Card className="mb-3">
        <CardHeader>
          <CardTitle as="h4">Meal Information</CardTitle>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            <Col lg={6}>
              <TextFormInput
                control={control}
                name="meals_name"
                label="Meal Name"
                placeholder="Premium Meal"
              />
            </Col>

            <Col lg={6}>
              <TextFormInput
                control={control}
                type="number"
                name="price"
                label="Price"
                placeholder="150"
              />
            </Col>

            <Col lg={12}>
              <TextFormInput
                control={control}
                name="description"
                label="Description"
                placeholder="5 Roti or 2 Bhakhri"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* COUNTS */}
      <Card className="mb-3">
        <CardHeader>
          <CardTitle as="h4">Meal Structure</CardTitle>
        </CardHeader>
        <CardBody>
          <Row className="g-3">

            <Col lg={4}>
              <TextFormInput
                control={control}
                type="number"
                name="subji_count"
                label="Subji Count"
              />
            </Col>

            <Col lg={4}>
              <TextFormInput
                control={control}
                type="number"
                name="other_count"
                label="Rice Section"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* SIDE ITEMS CHECKBOXES */}
      {sideItems.length > 0 && (
        <Card className="mb-3">
          <CardHeader>
            <CardTitle as="h4">Included Add Ons</CardTitle>
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
      )}

      {/* 🍞 BREAD CONFIG */}
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

      {/* OPTIONS */}
      <Card className="mb-3">
        <CardHeader>
          <CardTitle as="h4">Options</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={3}>
              <FormCheck
                label="Special Meal"
                {...control.register('is_special_meal')}
              />
            </Col>

            <Col lg={3}>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ACTIONS */}
      <div className="p-3 bg-light rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button 
              type="submit" 
              className="w-100"
              disabled={submitting || uploading}
            >
              {submitting ? 'Saving...' : 'Save Meal'}
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
