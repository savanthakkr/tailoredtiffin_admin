import FileUpload from '@/components/FileUpload';
import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import AddSubji from './components/AddSubji';

export const metadata = {
  title: 'Sabji Edit',
};

const SubjiEditPage = () => {
  return (
    <>
      <PageTItle title="SABJI EDIT" />
      <Row>
        <Col xl={9} lg={8}>
          <FileUpload title="Add Thumbnail Photo" />
          <AddSubji />
        </Col>
      </Row>
    </>
  );
};

export default SubjiEditPage;
