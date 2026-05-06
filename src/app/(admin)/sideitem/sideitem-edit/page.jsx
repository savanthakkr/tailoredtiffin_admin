'use client';

import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import AddSideItem from './components/AddSideItem';
import { useSearchParams } from 'next/navigation';

const SideItemEditPage = () => {
  const searchParams = useSearchParams();
  const sideItemId = searchParams.get('id');

  return (
    <>
      <PageTItle title="ADD ON EDIT" />
      <Row>
        <Col xl={9} lg={8}>
          <AddSideItem sideItemId={sideItemId} />
        </Col>
      </Row>
    </>
  );
};

export default SideItemEditPage;
