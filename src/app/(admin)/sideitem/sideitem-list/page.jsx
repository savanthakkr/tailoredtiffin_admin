import React from 'react';
import SideItemList from './components/SideItemList';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Add On List'
};
const SideItemListPage = () => {
  return <>
      <PageTItle title="ADD ON LIST" />
      <SideItemList />
    </>;
};
export default SideItemListPage;
