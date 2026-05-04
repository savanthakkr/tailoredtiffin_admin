import React from 'react';
import SideItemList from './components/SideItemList';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'Side Item List'
};
const SideItemListPage = () => {
  return <>
      <PageTItle title="SIDE ITEM LIST" />
      <SideItemList />
    </>;
};
export default SideItemListPage;
