import React, {useEffect, useState} from 'react'
import {InputGroup, FormControl, Modal, Button, Card, Container, Row, Col, Tab, Tabs} from 'react-bootstrap'
import {sCheckLoggedIn, sLogout, sLogin, sRegister} from '../../global/Reducer'
import NavBar from '../../shared/NavBar'
import paginationFactory from 'react-bootstrap-table2-paginator'
import BootstrapTable from 'react-bootstrap-table-next'
import Sidebar from '../../shared/Sidebar'
import axios from 'axios'
import Flight from './Flight'

function Frequent(){

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    
    let loggedIn = false
    if (sCheckLoggedIn()) loggedIn = true

    const [flightNumbers, setFlightNumbers] = useState([])
    const [customers, setCustomers] = useState([])

    const flightNumbersHandler = (arr) => {
        setFlightNumbers(arr)
    }
    const customersHandler = (arr) => {
        setCustomers(arr)
    }

    useEffect(() => {
        axios.get('http://localhost:8000/api/staff/frequentCustomer/'+JSON.parse(localStorage.getItem('staffObj')).airline_name).then(response => {
            const obj = response.data
            console.log('obj', obj);
            let arrF = []
            let arrC = []
            for (let key in obj){
                arrF.push(key)
                arrC.push(obj[key])
                console.log('obj[key]', obj[key]);
            }
            flightNumbersHandler(arrF)
            customersHandler(arrC)
        })
    }, [])

    return (
        <React.Fragment>
        {loggedIn ? <NavBar 
            nav={[['/aViewFlights', 'View My Flights'], ['/viewTop', 'View Top Customers'], ['#pricing', 'Flight Tracker']]} 
            accountManagement={[handleShow, handleShow2]}
            loggedIn = {loggedIn}
            logOut = {sLogout}
            logoPath="/staff"
        />
        :
        <NavBar 
            nav={[['#pricing', 'Flight Tracker']]} 
            accountManagement={[handleShow, handleShow2]}
            loggedIn = {loggedIn}
            logOut = {sLogout}
            logoPath="/staff"
        />
    }

        <div>
            <Sidebar />
            <div style={{marginLeft: '270px', paddingTop: '80px'}}>
                <div className="flights-div">
                    <h1>Flights</h1>
                    <br /><br />
                    {flightNumbers.length? 
                    flightNumbers.map((flightNumber, index) => {
                        return <Flight flight_number={flightNumber} customers={customers[index]}/>
                    })
                    : 
                    null
                    }
                </div>
            </div>
        </div>
    </React.Fragment>
    )
}

export default Frequent