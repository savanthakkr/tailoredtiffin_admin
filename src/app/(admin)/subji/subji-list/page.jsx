import React from 'react';
import Category from './components/Subji';
import CategoryList from './components/SubjiList';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Category List'
};
const CategoryListPage = () => {
  return <>
      <PageTItle title="SABJI LIST" />
      <Category />
      <CategoryList />
    </>;
};
export default CategoryListPage;