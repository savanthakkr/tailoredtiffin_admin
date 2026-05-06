'use client';

import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const GeneralInformationCard = ({ control }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h4">General Information</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col lg={6}>
            <TextFormInput
              control={control}
              name="title"
              label="Sabji Title"
              placeholder="Enter Title"
            />
          </Col>
          <Col lg={6}>
            <TextFormInput
              control={control}
              type="number"
              name="price"
              label="Price"
              placeholder="Enter price"
            />
          </Col>
          <Col lg={6}>
            <label className="form-label">Sabji Type</label>
            <select
              className="form-select"
              {...control.register("subji_type")}
            >
              <option value="">Select Type</option>
              <option value="green">Green Sabji</option>
              <option value="kathol">Kathol Sabji</option>
            </select>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

const AddSubji = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjiId = searchParams.get('id'); // 👈 EDIT ID

  const schema = yup.object({
    title: yup.string().required('Please enter title'),
    price: yup.number().required('Please enter price'),
  });

  const { reset, handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  // 🔹 Prefill subji data
  useEffect(() => {
    if (!subjiId || !session?.accessToken) return;

    fetch('https://api.tailoredtiffin.com/admin/get_subji', {
      headers: {
        Authorization: `${session.accessToken}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        const subji = res.data.find(s => s.subji_id == subjiId);
        if (subji) {
          reset({
            title: subji.name,
            subji_type: subji.subji_type,
            price: subji.price,
          });
        }
      });
  }, [subjiId, session, reset]);

  const onSubmit = async (values) => {
    if (!session?.accessToken) return;

    const res = await fetch('https://api.tailoredtiffin.com/admin/edit_subji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${session.accessToken}`,
      },
      body: JSON.stringify({
        inputdata: {
          subji_id: Number(subjiId),
          name: values.title,
          subji_type: values.subji_type,
          price: Number(values.price),
        },
      }),
    });

    const data = await res.json();

    if (data.status === 'success') {
      router.push('/subji/subji-list');
    } else {
      alert(data.msg || 'Failed to update sabji');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GeneralInformationCard control={control} />

      <div className="p-3 bg-light mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button type="submit" className="w-100">
              Save Change
            </Button>
          </Col>
          <Col lg={2}>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => router.push('/subji/subji-list')}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default AddSubji;
