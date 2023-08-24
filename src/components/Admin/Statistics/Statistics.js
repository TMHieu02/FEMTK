import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getStaticOrder,
  getStaticOrderStore,
  getStaticProduct,
  getStaticProductStore,
  getStaticRevenue,
  getStaticRevenueStore,
} from '../../../store/slices/statistics-slice';
import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import { convertDate } from '../../../utils/convertDate';

const timeRanges = [
  { key: 0, value: 'Week' },
  { key: 1, value: 'Month' },
  { key: 2, value: 'Year' },
];
const StatsPage = () => {
  const dispatch = useDispatch();
  const [dataKeyOrder, setDataKeyOrder] = useState('label');
  const [dataKeyProduct, setDataKeyProduct] = useState('label');
  const [dataKeyRevenue, setDataKeyRevenue] = useState('label');
  const [statisticProduct, setStatisticProduct] = React.useState([]);
  const [statisticOrder, setStatisticOrder] = React.useState([]);
  const [statisticRevenue, setStatisticRevenue] = React.useState([]);

  // Revenue
  const [timeRangeRevenue, setTimeRangeRevenue] = useState('Year');
  const [selectedDateRevenue, setSelectedDateRevenue] = useState(new Date());
  const handleTimeRangeRevenueChange = (event) => {
    if (event !== 'Year') setDataKeyRevenue('date');
    else setDataKeyRevenue('label');
    setTimeRangeRevenue(event);
  };
  const handleDateRevenueChange = (date) => {
    setSelectedDateRevenue(date);
  };
  // Product
  const [timeRangeProduct, setTimeRangeProduct] = useState('Year');
  const [selectedDateProduct, setSelectedDateProduct] = useState(new Date());
  const handleTimeRangeProductChange = (event) => {
    if (event !== 'Year') setDataKeyProduct('date');
    else setDataKeyProduct('label');
    setTimeRangeProduct(event);
  };
  const handleDateProductChange = (date) => {
    setSelectedDateProduct(date);
  };
  // Order
  const [timeRangeOrder, setTimeRangeOrder] = useState('Year');
  const [selectedDateOrder, setSelectedDateOrder] = useState(new Date());
  const handleTimeRangeOrderChange = (event) => {
    if (event !== 'Year') setDataKeyOrder('date');
    else setDataKeyOrder('label');
    setTimeRangeOrder(event);
  };
  const handleDateOrderChange = (date) => {
    setSelectedDateOrder(date);
  };
  const getValueRange = (data) => {
    switch (data) {
      case 'Year':
        return 2;
      case 'Month':
        return 1;
      case 'Week':
        return 0;
    }
  };
  useEffect(() => {
    dispatch(
      getStaticProduct({
        dateStr: selectedDateProduct,
        option: getValueRange(timeRangeProduct),
      })
    ).then((res) => {
      console.log(res.payload.data);
      setStatisticProduct(res.payload.data);
    });
  }, [selectedDateProduct, timeRangeProduct]);
  useEffect(() => {
    dispatch(
      getStaticRevenue({
        dateStr: selectedDateProduct,
        option: getValueRange(timeRangeRevenue),
      })
    ).then((res) => {
      setStatisticRevenue(res.payload.data);
    });
  }, [selectedDateRevenue, timeRangeRevenue]);
  useEffect(() => {
    dispatch(
      getStaticOrder({
        dateStr: selectedDateProduct,
        option: getValueRange(timeRangeOrder),
      })
    ).then((res) => {
      setStatisticOrder(res.payload.data);
    });
  }, [selectedDateOrder, timeRangeOrder]);
  return (
    <div className="content">
      <h2 className="title">Thống kê sản phẩm</h2>
      <div className="revenue-dropdown">
        <Dropdown onSelect={handleTimeRangeProductChange}>
          <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
            {timeRangeProduct}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {timeRanges.map((range, index) => (
              <Dropdown.Item key={index} eventKey={range.value}>
                {range.value}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDateProduct}
            onChange={handleDateProductChange}
            dateFormat="dd/MM/yyyy"
            className="form-control"
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={statisticProduct}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={dataKeyProduct}
            tickFormatter={(value) => {
              if (timeRangeProduct !== 'Year') return convertDate(value);
              return value;
            }}
          />

          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2 className="title">Thống kê doanh thu</h2>
      <div className="revenue-dropdown">
        <Dropdown onSelect={handleTimeRangeRevenueChange}>
          <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
            {timeRangeRevenue}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {timeRanges.map((range, index) => (
              <Dropdown.Item key={index} eventKey={range.value}>
                {range.value}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDateRevenue}
            onChange={handleDateRevenueChange}
            dateFormat="dd/MM/yyyy"
            className="form-control"
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={statisticRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={dataKeyRevenue}
            tickFormatter={(value) => {
              if (timeRangeRevenue !== 'Year') return convertDate(value);
              return value;
            }}
          />{' '}
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h2 className="title">Thống kê đơn hàng</h2>
      <div className="revenue-dropdown">
        <Dropdown onSelect={handleTimeRangeOrderChange}>
          <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
            {timeRangeOrder}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {timeRanges.map((range, index) => (
              <Dropdown.Item key={index} eventKey={range.value}>
                {range.value}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDateOrder}
            onChange={handleDateOrderChange}
            dateFormat="dd/MM/yyyy"
            className="form-control"
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={statisticOrder}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={dataKeyOrder}
            tickFormatter={(value) => {
              if (timeRangeOrder !== 'Year') return convertDate(value);
              return value;
            }}
          />{' '}
          <YAxis />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsPage;
