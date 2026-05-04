'use client';

import FileUpload from '@/components/FileUpload';
import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import AddBread from './components/AddBread';
import { useSearchParams } from 'next/navigation';



const BreadEditPage = () => {
  const searchParams = useSearchParams();
  const breadId = searchParams.get('id');

  return (
    <>
      <PageTItle title="Bread EDIT" />
      <Row>
        <Col xl={9} lg={8}>
          <FileUpload title="Add Thumbnail Photo" />
          <AddBread breadId={breadId} />
        </Col>
      </Row>
    </>
  );
};

export default BreadEditPage;
