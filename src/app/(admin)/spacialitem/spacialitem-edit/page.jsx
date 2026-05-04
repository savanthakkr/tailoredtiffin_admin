'use client';

import FileUpload from '@/components/FileUpload';
import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import AddSpacialItem from './components/AddSpacialItem';
import { useSearchParams } from 'next/navigation';



const SpacialItemEditPage = () => {
  const searchParams = useSearchParams();
  const spacialitemId = searchParams.get('id');

  return (
    <>
      <PageTItle title="SpacialItem EDIT" />
      <Row>
        <Col xl={9} lg={8}>
          <FileUpload title="Add Thumbnail Photo" />
          <AddSpacialItem spacialitemId={spacialitemId} />
        </Col>
      </Row>
    </>
  );
};

export default SpacialItemEditPage;
