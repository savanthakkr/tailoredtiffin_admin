'use client';

import { WorldVectorMap } from '@/components/VectorMap';
import ReactApexChart from 'react-apexcharts';
import { pagesList } from '../data';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import Link from 'next/link';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
const Conversions = () => {
  const chartOptions = {
    chart: {
      height: 292,
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '14px',
            color: 'undefined',
            offsetY: 100
          },
          value: {
            offsetY: 55,
            fontSize: '20px',
            color: undefined,
            formatter: function (val) {
              return val + '%';
            }
          }
        },
        track: {
          background: 'rgba(170,184,197, 0.2)',
          margin: 0
        }
      }
    },
    fill: {
      gradient: {
        // enabled: true,
        shade: 'dark',
        shadeIntensity: 0.2,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91]
      }
    },
    stroke: {
      dashArray: 4
    },
    colors: ['#ff6c2f', '#22c55e'],
    series: [65.2],
    labels: ['Returning Customer'],
    responsive: [{
      breakpoint: 380,
      options: {
        chart: {
          height: 180
        }
      }
    }],
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    }
  };
  const options = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: false,
    markersSelectable: true,
    markers: [{
      name: 'Canada',
      coords: [56.1304, -106.3468]
    }, {
      name: 'Brazil',
      coords: [-14.235, -51.9253]
    }, {
      name: 'Russia',
      coords: [61, 105]
    }, {
      name: 'China',
      coords: [35.8617, 104.1954]
    }, {
      name: 'United States',
      coords: [37.0902, -95.7129]
    }],
    markerStyle: {
      initial: {
        fill: '#7f56da'
      },
      selected: {
        fill: '#22c55e'
      }
    },
    labels: {
      markers: {
        render: marker => marker.name
      }
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1
      }
    }
  };
  return <>
      <Col lg={4}>
        <Card>
        </Card>
      </Col>
    </>;
};
export default Conversions;