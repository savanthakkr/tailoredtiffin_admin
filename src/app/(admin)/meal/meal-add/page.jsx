'use client';

import React from 'react';
import { Col, Row } from 'react-bootstrap';
import MealEditCard from './components/MealEditCard';
import FileUploadWrapper, { ImageContextProvider } from './components/FileUploadWrapper';
import AddMeal from './components/AddMeal';
import PageTItle from '@/components/PageTItle';

const MealAddPage = () => {
  return (
    <ImageContextProvider>
      <>
        <PageTItle title="CREATE Meal" />
        <Row>
          <Col xl={9} lg={8}>
            <FileUploadWrapper />
            <AddMeal />
          </Col>
        </Row>
      </>
    </ImageContextProvider>
  );
};

export default MealAddPage;