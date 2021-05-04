import React, {useEffect, useState} from 'react'
import {sCheckLoggedIn, sLogout} from '../../global/Reducer'
import NavBar from '../../shared/NavBar'
import Sidebar from '../../shared/Sidebar'
import axios from 'axios'
import Chart from "react-google-charts"

function Comparison(){
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

    const [revenue, setRevenue] = useState({
        directMonth: "",
        indirectMonth: "",
        directYear: "",
        indirectYear: ""
    })

    const revenueHandler = (key, value) =>{
        setRevenue({
            ...revenue,
            [key]: value
        })
    }

    const handleShow = () => setShow(true);

    const handleShow2 = () => setShow2(true);
    let loggedIn = false
    if (sCheckLoggedIn()) loggedIn = true


    useEffect(() => {
        axios.get('http://localhost:8000/api/staff/revenue?cusorAgent=customer&timeFlag=month&airline_name'+JSON.parse(localStorage.getItem('staffObj')).airline_name).then(response => {
            console.log(response);
            revenueHandler('directMonth', response.data[0].revenue)
        })

        axios.get('http://localhost:8000/api/staff/revenue?cusorAgent=customer&timeFlag=year&airline_name'+JSON.parse(localStorage.getItem('staffObj')).airline_name).then(response => {
            console.log(response);
            revenueHandler('directYear', response.data[0].revenue)
        })

        axios.get('http://localhost:8000/api/staff/revenue?cusorAgent=agent&timeFlag=month&airline_name'+JSON.parse(localStorage.getItem('staffObj')).airline_name).then(response => {
            console.log(response);
            revenueHandler('indirectMonth', response.data[0].revenue)
        })

        axios.get('http://localhost:8000/api/staff/revenue?cusorAgent=agent&timeFlag=year&airline_name'+JSON.parse(localStorage.getItem('staffObj')).airline_name).then(response => {
            console.log(response);
            revenueHandler('indirectYear', response.data[0].revenue)
        })
    }, [])

    return (
        <div>
            
        <NavBar 
            nav={[]} 
            accountManagement={[handleShow, handleShow2]}
            loggedIn = {loggedIn}
            logOut = {sLogout}
            logoPath="/staff"
        />
    

        <div>
            <Sidebar />
            <div style={{marginLeft: '270px', paddingTop: '80px'}}>
            <h1>Last Month</h1>
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                    ['Type Of Purchase', 'Amount of Tickets'],
                    ['Direct', revenue.directMonth],
                    ['Indirect', revenue.indirectMonth],
                ]}
                options={{
                    title: 'My Daily Activities',
                }}
                rootProps={{ 'data-testid': '1' }}
                style={{margin:'auto'}}
                />

            <h1>Last Year</h1>
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                    ['Type Of Purchase', 'Amount of Tickets'],
                    ['Direct', revenue.directYear],
                    ['Indirect', revenue.indirectYear],
                ]}
                options={{
                    title: 'My Daily Activities',
                }}
                rootProps={{ 'data-testid': '1' }}
                style={{margin:'auto'}}
                />
            </div>
        </div>
        </div>

    )
}



export default Comparison