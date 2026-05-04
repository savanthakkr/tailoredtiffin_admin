

import Image from 'next/image';
import { breadData } from '../data';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
const BreadCard = ({
  breadTitle,
  image
}) => {
  return <Card>
      {/* <CardBody className="text-center">
        <div className="rounded bg-secondary-subtle d-flex align-items-center justify-content-center mx-auto">
          <Image src={image} alt="ProductImg" className="avatar-xl" />
        </div>
        <h4 className="mt-3 mb-0">{breadTitle}</h4>
      </CardBody> */}
    </Card>;
};
const Bread = () => {
  return <Row>
      {breadData.map((item, idx) => <Col md={6} xl={3} key={idx}>
          <BreadCard {...item} />
        </Col>)}
    </Row>;
};
export default Bread;