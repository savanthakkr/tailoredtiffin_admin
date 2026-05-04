import React from 'react';
import { Col, Row } from 'react-bootstrap';
import AddSideItem from './components/AddSideItem';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Side Item Add'
};
const SideItemAddPage = () => {
  return <>
      <PageTItle title="CREATE SIDE ITEM" />
      <Row>
        <Col xl={9} lg={8}>
          <AddSideItem />
        </Col>
      </Row>
    </>;
};
export default SideItemAddPage;
