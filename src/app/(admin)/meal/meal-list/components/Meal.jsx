

import Image from 'next/image';
import { mealData } from '../data';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
const MealCard = ({
  mealTitle,
  image
}) => {
  return <Card>
      {/* <CardBody className="text-center">
        <div className="rounded bg-secondary-subtle d-flex align-items-center justify-content-center mx-auto">
          <Image src={image} alt="ProductImg" className="avatar-xl" />
        </div>
        <h4 className="mt-3 mb-0">{mealTitle}</h4>
      </CardBody> */}
    </Card>;
};
const Meal = () => {
  return <Row>
      {mealData.map((item, idx) => <Col md={6} xl={3} key={idx}>
          <MealCard {...item} />
        </Col>)}
    </Row>;
};
export default Meal;