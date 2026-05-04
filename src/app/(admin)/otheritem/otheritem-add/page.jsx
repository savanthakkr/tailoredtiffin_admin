import React from 'react';
import { Col, Row } from 'react-bootstrap';
import OtherItemEditCard from './components/OtherItemEditCard';
import FileUpload from '@/components/FileUpload';
import AddOtherItem from './components/AddOtherItem';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'OtherItem Add'
};
const OtherItemAddPage = () => {
  return <>
      <PageTItle title="CREATE OtherItem" />
      <Row>
        <Col xl={9} lg={8}>
          <FileUpload title="Add Thumbnail Photo" />
          <AddOtherItem />
        </Col>
      </Row>
    </>;
};
export default OtherItemAddPage;