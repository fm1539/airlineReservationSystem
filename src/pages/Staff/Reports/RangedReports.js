import React, {useState} from 'react'
import {Button, Card} from 'react-bootstrap'
import {sCheckLoggedIn, sLogout} from '../../../global/Reducer'
import NavBar from '../../../shared/NavBar'
import Sidebar from '../../../shared/Sidebar'
import axios from 'axios'
import Chart from "react-google-charts"

function RangedReports(){

    const [searchInput, setSearchInput] = useState({
        startDate: "",
        endDate: ""
    }) 

    const searchButtonHandler = () => {
        const obj = {
            startDate: searchInput.startDate,
            endDate: searchInput.endDate
        }
        axios.post('http://localhost:8000/api/staff/viewReports?&airline_name='+JSON.parse(localStorage.getItem('staffObj')).airline_name, obj).then(response => {
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
    }

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

    const handleShow = () => setShow(true);
    const handleShow2 = () => setShow2(true);

    
    let loggedIn = false
    if (sCheckLoggedIn()) loggedIn = true

    const [data, setData] = useState([])

    const dataHandler = (arr) => setData(arr)

    const searchChangeHandler = (event) => {
        setSearchInput({
            ...searchInput,
            [event.target.name]: event.target.value
        })
    }

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
                <h1>Range</h1>
                <Card style={{boxShadow: '0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)', width:'50%', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Card.Body>
                        <Card.Title style={{'textAlign': 'left'}}>Search with Range</Card.Title>
                        <br/>
                        <label for="depart_date">Beginning Date: </label>
                        <br/>
                        <input name="startDate" type="date" onChange={searchChangeHandler}/> <br/><br/>
                        <label for="arrive_date">Ending Date: </label>
                        <br/>
                        <input name="endDate" type="date" onChange={searchChangeHandler}/> <br/><br/>
                        <Button onClick={searchButtonHandler}>Search</Button>
                    </Card.Body>
                </Card>
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

export default RangedReports