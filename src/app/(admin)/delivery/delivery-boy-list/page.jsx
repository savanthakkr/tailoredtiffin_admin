import PageTItle from '@/components/PageTItle'
import DeliveryBoyList from './components/DeliveryBoyList'

export const metadata = {
  title: 'Delivery Boy List'
}

export default function Page() {
  return (
    <>
      <PageTItle title="Delivery Boy LIST" />
      <DeliveryBoyList />
    </>
  )
}
