import { Row } from 'react-bootstrap';
import Conversions from './components/Conversions';
import Orders from './components/Orders';
import Stats from './components/Stats';
import PageTItle from '@/components/PageTItle';
import DashboardMenuManager from './components/DashboardMenuManager';
import PredictedTiffinCalculator from './components/PredictedTiffinCalculator';

export const metadata = {
  title: 'Dashboard'
};
const DashboardPage = () => {
  return <>
      <Row>
        <PageTItle title="DASHBOARD" />
        <Stats />
        <PredictedTiffinCalculator />
        <Conversions />
        {/* <Orders /> */}
        <DashboardMenuManager />
      </Row>
    </>;
};
export default DashboardPage;