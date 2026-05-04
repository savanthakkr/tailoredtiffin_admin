'use client';

import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AddSideItem = ({ sideItemId }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const schema = yup.object({
    name: yup.string().required('Please enter side item name'),
    price: yup.number().typeError('Please enter a valid price').required('Please enter price').min(0, 'Price must be 0 or more'),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!sideItemId || !session?.accessToken) return;

    const fetchSideItem = async () => {
      const res = await fetch("https://api.tailoredtiffin.com/admin/get_side_items", {
        headers: {
          Authorization: `${session.accessToken}`,
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        const item = data.data.find(s => s.side_item_id == sideItemId);
        if (item) {
          reset({
            name: item.name,
            price: item.price,
          });
        }
      }
    };

    fetchSideItem();
  }, [sideItemId, session]);

  const onSubmit = async (values) => {
    await fetch("https://api.tailoredtiffin.com/admin/edit_side_item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session.accessToken}`,
      },
      body: JSON.stringify({
        inputdata: {
          side_item_id: sideItemId,
          name: values.name,
          price: values.price,
        },
      }),
    });

    router.push('/sideitem/sideitem-list');
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
                label="Side Item Name"
                placeholder="Enter Side Item Name"
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
              Save Change
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
