import React from 'react';
import { Col, Row } from 'react-bootstrap';
import BreadEditCard from './components/BreadEditCard';
import FileUpload from '@/components/FileUpload';
import AddBread from './components/AddBread';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Bread Add'
};
const BreadAddPage = () => {
  return <>
      <PageTItle title="CREATE Bread" />
      <Row>
        <Col xl={9} lg={8}>
          <FileUpload title="Add Thumbnail Photo" />
          <AddBread />
        </Col>
      </Row>
    </>;
};
export default BreadAddPage;