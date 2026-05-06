'use client';

import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
              name="name"
              label="SpacialItem Name"
              placeholder="Enter SpacialItem Name"
            />
          </Col>
          <Col lg={6}>
            <TextFormInput
              control={control}
              type="number"
              name="price"
              label="Price"
              placeholder="Enter Price"
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

const AddSpacialItem = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const schema = yup.object({
    name: yup.string().required('Please enter spacialitem name'),
    price: yup.number().required('Please enter price'),
  });

  const { reset, handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values) => {
    try {
      if (!session?.accessToken) {
        alert('Unauthorized');
        return;
      }

      const res = await fetch('http://localhost:3002/admin/add/add_special_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session.accessToken}`, // ✅ FIX
        },
        body: JSON.stringify({
          inputdata: {
            name: values.name,
            price: Number(values.price),
          },
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        reset();
        router.push('/spacialitem/spacialitem-list'); // ✅ REDIRECT
      } else {
        alert(data.msg || 'Failed to add spacialitem');
      }
    } catch (error) {
      console.error('Add spacialitem error:', error);
      alert('Something went wrong');
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
              onClick={() => router.push('/spacialitem/spacialitem-list')}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default AddSpacialItem;
