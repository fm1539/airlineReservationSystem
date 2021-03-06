import React, {useEffect, useState} from 'react'
import {sCheckLoggedIn, sLogout} from '../../../global/Reducer'
import NavBar from '../../../shared/NavBar'
import Sidebar from '../../../shared/Sidebar'
import axios from 'axios'
import Chart from "react-google-charts"

function LastMonth(){

    const obj = {
        1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'June',
        7: 'July', 8: 'Aug', 9: 'Sept', 10: 'Oct', 11: 'Nov', 12: 'Dec'
      } 

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

    const handleShow = () => setShow(true);

    const handleShow2 = () => setShow2(true);

    
    let loggedIn = false
    if (sCheckLoggedIn()) loggedIn = true

    const [data, setData] = useState([])

    const dataHandler = (arr) => setData(arr)


    useEffect(() => {
        axios.post('http://localhost:8000/api/staff/viewReports?timeFlag=month&airline_name='+JSON.parse(localStorage.getItem('staffObj')).airline_name).then(response => {
            console.log(response);
            let arr = [['Month', 'Tickets']]
            response.data.forEach(element => {
                console.log('monthVal', element.month);
                console.log('month', obj[element.month]);
                arr.push([obj[element.month], element.ticketsSold])
            });
            console.log('arr', arr);
            console.log(arr);
            dataHandler(arr)
        })
    }, [])

    return (
        <React.Fragment>
        {loggedIn ? <NavBar 
            nav={[]} 
            accountManagement={[handleShow, handleShow2]}
            loggedIn = {loggedIn}
            logOut = {sLogout}
            logoPath="/staff"
        />
        :
        <NavBar 
            nav={[]} 
            accountManagement={[handleShow, handleShow2]}
            loggedIn = {loggedIn}
            logOut = {sLogout}
            logoPath="/staff"
        />
    }

        <div>
            <Sidebar />
            <div style={{marginLeft: '270px', paddingTop: '80px'}}>
                <h1>Last Month</h1>
                {data.length > 1 ?
                <Chart
                style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '5vh', marginBottom: '10vh'}}
                width={1000}
                height={500}
                chartType="ColumnChart"
                loader={<div>Loading Chart...</div>}
                data={data}
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
                :
                null

                }
                
            </div>
        </div>
    </React.Fragment>
    )
}

export default LastMonth