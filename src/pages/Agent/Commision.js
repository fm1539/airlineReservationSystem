import React, { useState, useEffect } from 'react'
import NavBar from '../../shared/NavBar'
import {logout, checkLoggedIn} from '../../global/Reducer'
import { Tab, Button, Row, Nav, Col } from 'react-bootstrap';
import axios from 'axios'

function Commision(){
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [last30, setLast30] = useState({});
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [rangeData, setRangeData] = useState({})

    var fromDateHandler = (event) => setFromDate(event.target.value)
    var toDateHandler = (event) => setToDate(event.target.value)
    const last30Handler = (obj) => setLast30(obj)
    const rangeDateHandler = (obj) => setRangeData(obj)



    const filterHandler = () => {
        const query = "?startDate=" + fromDate +"&endDate=" + toDate
        axios.get('http://localhost:8000/api/agent/'+JSON.parse(localStorage.getItem('agentObj')).email+'/viewMyCommission'+query)
        .then(response => rangeDateHandler(response.data.results[0]));
    }
  
    const handleShow = () => setShow(true);

    const handleShow2 = () => setShow2(true);
    let loggedIn = false
    if (checkLoggedIn()) loggedIn = true

    useEffect(()=>{
        //Last 30 days
        axios.get('http://localhost:8000/api/agent/'+JSON.parse(localStorage.getItem('agentObj')).email+'/viewMyCommission')
        .then(response=> last30Handler(response.data.results[0]))
    }, [])

    return (
        <div>
            <NavBar 
                nav={[['/aViewFlights', 'View My Flights'],['/trackSpending', 'Track Spending'], ['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {logout}
                logoPath='/'
            />            
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row>
                        <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                            <Nav.Link eventKey="30">Last 30 Days</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="range">Date Range</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        </Col>
                        <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="30">
                                <p>Total Commission: {last30.totalCommission}</p>
                                <p>Average Commission: {last30.avgCommission}</p>
                                <p>Tickets Sold: {last30.ticketsSold}</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="range">
                                <label>From</label>
                                <input type="date" onChange={fromDateHandler}/>
                                <label>To</label>
                                <input type="date" onChange={toDateHandler}/>
                                <Button onClick={filterHandler}>Filter</Button>
                                <p>Total Commission: {rangeData.totalCommission}</p>
                                <p>Tickets Sold: {last30.ticketsSold}</p>
                            </Tab.Pane>
                        </Tab.Content>
                        </Col>
                    </Row>
                    </Tab.Container>
                
            {/* <div style={{ display: 'flex', maxWidth: 900 }}> */}
  
  {/* <Chart
    width={400}
    height={'300px'}
    chartType="AreaChart"
    loader={<div>Loading Chart</div>}
    data={[
      ['Year', 'Sales', 'Expenses'],
      ['2013', 1000, 400],
      ['2014', 1170, 460],
      ['2015', 660, 1120],
      ['2016', 1030, 540],
    ]}
    options={{
      title: 'Company Performance',
      hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
      vAxis: { minValue: 0 },
      // For the legend to fit, we make the chart area smaller
      chartArea: { width: '50%', height: '70%' },
      // lineWidth: 25
    }}
  />
</div>
<div style={{ display: 'flex' }}>
  <Chart
    width={400}
    height={'300px'}
    chartType="BubbleChart"
    loader={<div>Loading Chart</div>}
    data={[
      ['ID', 'Life Expectancy', 'Fertility Rate', 'Region', 'Population'],
      ['CAN', 80.66, 1.67, 'North America', 33739900],
      ['DEU', 79.84, 1.36, 'Europe', 81902307],
      ['DNK', 78.6, 1.84, 'Europe', 5523095],
      ['EGY', 72.73, 2.78, 'Middle East', 79716203],
      ['GBR', 80.05, 2, 'Europe', 61801570],
      ['IRN', 72.49, 1.7, 'Middle East', 73137148],
      ['IRQ', 68.09, 4.77, 'Middle East', 31090763],
      ['ISR', 81.55, 2.96, 'Middle East', 7485600],
      ['RUS', 68.6, 1.54, 'Europe', 141850000],
      ['USA', 78.09, 2.05, 'North America', 307007000],
    ]}
    options={{
      title:
        'Correlation between life expectancy, fertility rate ' +
        'and population of some world countries (2010)',
      hAxis: { title: 'Life Expectancy' },
      vAxis: { title: 'Fertility Rate' },
      bubble: { textStyle: { fontSize: 11 } },
    }}
  />
  <Chart
    width={400}
    height={300}
    chartType="LineChart"
    loader={<div>Loading Chart</div>}
    data={[
      [
        { type: 'number', label: 'x' },
        { type: 'number', label: 'values' },
        { id: 'i0', type: 'number', role: 'interval' },
        { id: 'i1', type: 'number', role: 'interval' },
        { id: 'i2', type: 'number', role: 'interval' },
        { id: 'i2', type: 'number', role: 'interval' },
        { id: 'i2', type: 'number', role: 'interval' },
        { id: 'i2', type: 'number', role: 'interval' },
      ],
      [1, 100, 90, 110, 85, 96, 104, 120],
      [2, 120, 95, 130, 90, 113, 124, 140],
      [3, 130, 105, 140, 100, 117, 133, 139],
      [4, 90, 85, 95, 85, 88, 92, 95],
      [5, 70, 74, 63, 67, 69, 70, 72],
      [6, 30, 39, 22, 21, 28, 34, 40],
      [7, 80, 77, 83, 70, 77, 85, 90],
      [8, 100, 90, 110, 85, 95, 102, 110],
    ]}
    options={{
      intervals: { style: 'sticks' },
      legend: 'none',
    }}
  />
</div>   */}
            
        </div>
    )
}

export default Commision