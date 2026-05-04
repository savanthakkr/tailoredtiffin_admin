//subjiData : SubjiType[]

import Image from 'next/image';
import { subjiData } from '../data';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
const SubjiCard = ({
  subjiTitle,
  image
}) => {
  return <Card>
      <CardBody className="text-center">
        <div className="rounded bg-secondary-subtle d-flex align-items-center justify-content-center mx-auto">
          <Image src={image} alt="ProductImg" className="avatar-xl" />
        </div>
        <h4 className="mt-3 mb-0">{subjiTitle}</h4>
      </CardBody>
    </Card>;
};
const Subji = () => {
  return <Row>
      
    </Row>;
};
export default Subji;