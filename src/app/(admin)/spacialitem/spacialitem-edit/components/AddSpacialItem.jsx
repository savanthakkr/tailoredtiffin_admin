'use client';

import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AddSpacialItem = ({ spacialitemId }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const messageSchema = yup.object({
    title: yup.string().required('Please enter title'),
    price: yup.string().required('Please enter price'),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(messageSchema),
  });

  // 🔹 FETCH BREAD DETAILS FOR EDIT
  useEffect(() => {
    if (!spacialitemId || !session?.accessToken) return;

    const fetchSpacialItem = async () => {
      const res = await fetch("https://api.tailoredtiffin.com//admin/get_special_items", {
        headers: {
          Authorization: `${session.accessToken}`,
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        const spacialitem = data.data.find(b => b.special_item_id == spacialitemId);
        if (spacialitem) {
          reset({
            title: spacialitem.name,
            price: spacialitem.price,
          });
        }
      }
    };

    fetchSpacialItem();
  }, [spacialitemId, session]);

  // 🔹 SUBMIT EDIT
  const onSubmit = async (values) => {
    await fetch("https://api.tailoredtiffin.com//admin/edit_Special_item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${session.accessToken}`,
      },
      body: JSON.stringify({
        inputdata: {
          special_item_id: spacialitemId,
          name: values.title,
          price: values.price,
        },
      }),
    });

    router.push('/spacialitem/spacialitem-list');
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
                name="title"
                label="SpacialItem Title"
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
