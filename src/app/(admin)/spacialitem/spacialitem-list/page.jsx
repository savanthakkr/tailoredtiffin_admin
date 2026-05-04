import React from 'react';
import SpacialItem from './components/SpacialItem';
import SpacialItemList from './components/SpacialItemList';
import PageTItle from '@/components/PageTItle';
export const metadata = {
  title: 'SpacialItem List'
};
const SpacialItemListPage = () => {
  return <>
      <PageTItle title="SpacialItem LIST" />
      <SpacialItem />
      <SpacialItemList />
    </>;
};
export default SpacialItemListPage;