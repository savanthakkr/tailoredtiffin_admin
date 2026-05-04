import React from 'react';
import OtherItem from './components/OtherItem';
import OtherItemList from './components/OtherItemList';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'OtherItem List'
};
const OtherItemListPage = () => {
  return <>
      <PageTItle title="OtherItem LIST" />
      <OtherItem />
      <OtherItemList />
    </>;
};
export default OtherItemListPage;