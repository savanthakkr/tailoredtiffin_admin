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
              {/* <option value="kathol">Kathol Sabji</option>  */}
              <option value="paneer">Paneer Sabji</option> 
              <option value="green-vegetable">Green Vegetable</option> 
              <option value="variety">Variety Sabji</option> 
              <option value="potato">Potato Sabji</option>


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

  const schema = yup.object({
    title: yup.string().required('Please enter title'),
    subji_type: yup.string().required('Please select sabji type'),
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

      const res = await fetch('https://api.tailoredtiffin.com/admin/add/add_subji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session.accessToken}`,
        },
        body: JSON.stringify({
          inputdata: {
            name: values.title,
            subji_type: values.subji_type,
            price: Number(values.price),
          }
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        reset();
        router.push('/subji/subji-list'); // ✅ redirect
      } else {
        alert(data.msg || 'Failed to add sabji');
      }
    } catch (error) {
      console.error('Add sabji error:', error);
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
