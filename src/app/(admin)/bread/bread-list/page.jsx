import React from 'react';
import Bread from './components/Bread';
import BreadList from './components/BreadList';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Bread List'
};
const BreadListPage = () => {
  return <>
      <PageTItle title="Bread LIST" />
      <Bread />
      <BreadList />
    </>;
};
export default BreadListPage;