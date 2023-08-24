import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Breadcrumb, Dropdown, Tooltip } from 'react-bootstrap';
import './Home.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import DatePicker from 'react-datepicker';
import { fetchRevenue, fetchTotal, selectStatistics } from '../../../store/slices/statistics-slice';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { convertDate } from '../../../utils/convertDate';
function HomeAdmin() {
  const timeRanges = [
    { key: 0, value: 'Week' },
    { key: 1, value: 'Month' },
    { key: 2, value: 'Year' },
  ];
  const dispatch = useDispatch();
  const statistics = useSelector(selectStatistics);
  const [dataKeyProduct, setDataKeyProduct] = useState('label');

  const [timeRange, setTimeRange] = useState('Year');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchTotal());
  }, []);

  useEffect(() => {
    dispatch(fetchRevenue({ dateStr: selectedDate, option: getValueRange(timeRange) }));
  }, [selectedDate, timeRange]);
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
  const handleTimeRangeChange = (event) => {
    if (event !== 'Year') setDataKeyProduct('date');
    else setDataKeyProduct('label');
    setTimeRange(event);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="content-wrapper">
      <h1 className="title main-title">Home</h1>
      <div className="total-count-container">
        <div className="total-count-card total-users">
          <h3>Total Users</h3>
          <p>{statistics.total?.totalUser}</p>
        </div>
        {/* <div className="total-count-card total-stores">
          <h3>Total Stores</h3>
          <p>{statistics.total?.totalStore}</p>
        </div> */}
        <div className="total-count-card total-products">
          <h3>Total Post</h3>
          <p>{statistics.total?.totalProduct}</p>
        </div>
      </div>
      <div className="revenue-chart-container">
        <div>
          <h2 className="title">Doanh thu</h2>
          <div className="revenue-dropdown">
            <Dropdown onSelect={handleTimeRangeChange}>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                {timeRange}
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
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>
          </div>
          {statistics.revenue?.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={statistics.revenue} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={dataKeyProduct}
                  tickFormatter={(value) => {
                    if (timeRange !== 'Year') return convertDate(value);
                    return value;
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="centered-message">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;
