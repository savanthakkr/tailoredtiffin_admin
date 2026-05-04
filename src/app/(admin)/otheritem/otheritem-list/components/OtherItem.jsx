

import Image from 'next/image';
import { otheritemData } from '../data';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
const OtherItemCard = ({
  otheritemTitle,
  image
}) => {
  return <Card>
      {/* <CardBody className="text-center">
        <div className="rounded bg-secondary-subtle d-flex align-items-center justify-content-center mx-auto">
          <Image src={image} alt="ProductImg" className="avatar-xl" />
        </div>
        <h4 className="mt-3 mb-0">{otheritemTitle}</h4>
      </CardBody> */}
    </Card>;
};
const OtherItem = () => {
  return <Row>
      {otheritemData.map((item, idx) => <Col md={6} xl={3} key={idx}>
          <OtherItemCard {...item} />
        </Col>)}
    </Row>;
};
export default OtherItem;