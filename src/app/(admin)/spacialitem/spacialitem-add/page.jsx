import React from 'react';
import { Col, Row } from 'react-bootstrap';
import SpacialItemEditCard from './components/SpacialItemEditCard';
import FileUpload from '@/components/FileUpload';
import AddSpacialItem from './components/AddSpacialItem';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'SpacialItem Add'
};
const SpacialItemAddPage = () => {
  return <>
      <PageTItle title="CREATE SpacialItem" />
      <Row>
        <Col xl={9} lg={8}>
          <FileUpload title="Add Thumbnail Photo" />
          <AddSpacialItem />
        </Col>
      </Row>
    </>;
};
export default SpacialItemAddPage;