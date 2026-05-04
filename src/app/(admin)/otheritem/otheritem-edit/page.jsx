'use client';

import FileUpload from '@/components/FileUpload';
import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import AddOtherItem from './components/AddOtherItem';
import { useSearchParams } from 'next/navigation';



const OtherItemEditPage = () => {
  const searchParams = useSearchParams();
  const otheritemId = searchParams.get('id');

  return (
    <>
      <PageTItle title="OtherItem EDIT" />
      <Row>
        <Col xl={9} lg={8}>
          <FileUpload title="Add Thumbnail Photo" />
          <AddOtherItem otheritemId={otheritemId} />
        </Col>
      </Row>
    </>
  );
};

export default OtherItemEditPage;
