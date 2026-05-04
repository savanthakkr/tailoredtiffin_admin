import React from 'react';
import { Col, Row } from 'react-bootstrap';
import SubjiEditCard from './components/SubjiEditCard';
import FileUpload from '@/components/FileUpload';
import AddSubji from './components/AddSubji';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Sabji Add'
};
const SubjiAddPage = () => {
  return <>
      <PageTItle title="CREATE SABJI" />
      <Row>
        <Col xl={9} lg={8}>
          <FileUpload title="Add Thumbnail Photo" />
          <AddSubji />
        </Col>
      </Row>
    </>;
};
export default SubjiAddPage;