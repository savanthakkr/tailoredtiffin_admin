'use client';

import FileUploadWrapper, { ImageContextProvider } from '../meal-add/components/FileUploadWrapper';
import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import AddMeal from './components/AddMeal';
import { useSearchParams } from 'next/navigation';

const MealEditPage = () => {
  const searchParams = useSearchParams();
  const mealId = searchParams.get('id');

  return (
    <ImageContextProvider>
      <>
        <PageTItle title="Meal EDIT" />
        <Row>
          <Col xl={9} lg={8}>
            <FileUploadWrapper />
            <AddMeal mealId={mealId} />
          </Col>
        </Row>
      </>
    </ImageContextProvider>
  );
};

export default MealEditPage;
