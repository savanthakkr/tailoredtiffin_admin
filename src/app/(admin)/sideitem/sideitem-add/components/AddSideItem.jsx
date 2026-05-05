'use client';

import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AddSideItem = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const schema = yup.object({
    name: yup.string().required('Please enter add on name'),
    price: yup.number().typeError('Please enter a valid price').required('Please enter price').min(0, 'Price must be 0 or more'),
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

      const res = await fetch('http://localhost:3002/admin/add/add_side_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session.accessToken}`,
        },
        body: JSON.stringify({
          inputdata: {
            name: values.name,
            price: values.price,
          },
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        reset();
        router.push('/sideitem/sideitem-list');
      } else {
        alert(data.msg || 'Failed to add add on');
      }
    } catch (error) {
      console.error('Add add on error:', error);
      alert('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                label="Add On Name"
                placeholder="Enter Add On Name (e.g. Buttermilk, Salad)"
              />
            </Col>
            <Col lg={6}>
              <TextFormInput
                control={control}
                name="price"
                label="Price"
                type="number"
                placeholder="Enter Price"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="p-3 bg-light mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button type="submit" className="w-100">
              Save
            </Button>
          </Col>
          <Col lg={2}>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => router.push('/sideitem/sideitem-list')}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default AddSideItem;
