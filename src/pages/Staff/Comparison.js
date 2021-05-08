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

    const [directMonth, setDirectMonth] = useState("")
    const [indirectMonth, setIndirectMonth] = useState("")
    const [directYear, setDirectYear] = useState("")
    const [indirectYear, setIndirectYear] = useState("")
    
    const revenueHandler = (key, value) =>{
        console.log("key");
        console.log(key);
        console.log(value);
        if (value === null){
            value = 5
        }
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
        async function fetchData(){
        console.log(JSON.parse(localStorage.getItem('staffObj')).airline_name)
        axios.get('http://localhost:8000/api/staff/revenue?cusOrAgent=customer&timeFlag=month&airline_name='+JSON.parse(localStorage.getItem('staffObj')).airline_name).then(response => {
            console.log('here1')
            console.log(response);
            setDirectMonth(response.data[0].revenue)
        })

        const response2 = await axios.get('http://localhost:8000/api/staff/revenue?cusOrAgent=customer&timeFlag=year&airline_name='+JSON.parse(localStorage.getItem('staffObj')).airline_name)
        console.log('here2')
        console.log(response2);
        // revenueHandler('directYear', response2.data[0].revenue)
        setDirectYear(response2.data[0].revenue)

        axios.get('http://localhost:8000/api/staff/revenue?cusOrAgent=agent&timeFlag=month&airline_name='+JSON.parse(localStorage.getItem('staffObj')).airline_name).then(response => {
            console.log('here3')
            console.log(response);
            setIndirectMonth(response.data[0].revenue)
        })

        const response4 = await axios.get('http://localhost:8000/api/staff/revenue?cusOrAgent=agent&timeFlag=year&airline_name='+JSON.parse(localStorage.getItem('staffObj')).airline_name)
        console.log('here4')
        console.log(response4);
        setIndirectYear(response4.data[0].revenue)
    }
    fetchData()
    }, [])

    useEffect(()=>{
        console.log(directYear);
    }, [directYear])

    useEffect(()=>{
        console.log(indirectYear);
    }, [indirectYear])

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
            <button onClick={() => {console.log(indirectYear, directYear)}}>Log Revenue State</button>
            <h1>Last Month</h1>
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                    ['Type Of Purchase', 'Amount of Tickets'],
                    ['Direct', directMonth],
                    ['Indirect', indirectMonth],
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
                    ['Direct', directYear],
                    ['Indirect', indirectYear],
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