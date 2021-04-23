import React, { useState, useEffect } from 'react'
import NavBar from '../shared/NavBar'
import Chart from "react-google-charts"
import {aLogout, aCheckLoggedIn} from '../global/Reducer'
import { Table, Tab, Tabs, Modal, Button, Row, Nav, Col } from 'react-bootstrap';
import axios from 'axios'

function ViewTopCustomer(){
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [ticketsBought, setTicketsBought] = useState([])
    const [commissionsReceived, setCommissionsReceived] = useState([])

    const ticketsHandler = (arr) => {
        setTicketsBought(arr)
    }

    const commissionsHandler = (arr) => {
        setCommissionsReceived(arr)
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);
    let loggedIn = false
    if (aCheckLoggedIn()){
        loggedIn = true
    }

    useEffect(()=>{
        axios.get('http://localhost:8000/api/agent/'+JSON.parse(localStorage.getItem('agentObj')).email+'/topCustomers').then(response=>{
            console.log(response.data);
            let numFlightsArr = [['Customer', 'Number of Flights']]
            let commissionArr = [['Customer', 'Commission ($)']]   
            response.data.ticketsBought.forEach((element, i) => {
              numFlightsArr.push([response.data.ticketsBought[i].customer_email, response.data.ticketsBought[i].ticketsBought])
            });
            response.data.commissionReceived.forEach((element, i) => {
                commissionArr.push([response.data.commissionReceived[i].customer_email, response.data.commissionReceived[i].commissionReceived])
              });
            ticketsHandler(numFlightsArr)
            commissionsHandler(commissionArr)
        })
    }, [])

    return (
        <div>
                <NavBar 
                nav={[['/aViewFlights', 'View My Flights'],['/viewTop', 'View Top Customers'], ['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {aLogout}
                logoPath = '/agent'
                />            

            {commissionsReceived.length>0 ?
            <React.Fragment>
            <h1 style={{marginTop: '5vh'}}>Top 5 Customers in $</h1>
            <Chart
            style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '5vh'}}
            width={1000}
            height={500}
            chartType="ColumnChart"
            loader={<div>Loading Chart...</div>}
            data={commissionsReceived}
            options={{
            title: 'Commission',
            chartArea: { width: '80%' },
            hAxis: {
                title: 'Customer'
            },
            vAxis: {
                title: 'Commission ($)'
            },
            }}
            legendToggle
            />
            </React.Fragment>
            :
            null
            }
                                
                            
            {ticketsBought.length>0 ?
            <React.Fragment>
            <h1 style={{marginTop: '15vh'}}>Top 5 Customers in Ticket Sales</h1>
            <Chart
            style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '5vh', marginBottom: '10vh'}}
            width={1000}
            height={500}
            chartType="ColumnChart"
            loader={<div>Loading Chart...</div>}
            data={ticketsBought}
            options={{
            title: 'Tickets',
            chartArea: { width: '80%' },
            hAxis: {
                title: 'Customer',
                minValue: 0,
            },
            vAxis: {
                title: 'Number of Tickets',
            },
            }}
            legendToggle
            />
            </React.Fragment>
            :
            null
            }
                
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

export default ViewTopCustomer