import React from 'react';
import Meal from './components/Meal';
import MealList from './components/MealList';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Meal List'
};
const MealListPage = () => {
  return <>
      <PageTItle title="Meal LIST" />
      <Meal />
      <MealList />
    </>;
};
export default MealListPage;