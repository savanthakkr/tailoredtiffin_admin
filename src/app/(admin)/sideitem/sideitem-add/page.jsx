import React from 'react';
import { Col, Row } from 'react-bootstrap';
import AddSideItem from './components/AddSideItem';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Create Add On'
};
const SideItemAddPage = () => {
  return <>
      <PageTItle title="CREATE ADD ON" />
      <Row>
        <Col xl={9} lg={8}>
          <AddSideItem />
        </Col>
      </Row>
    </>;
};
export default SideItemAddPage;
