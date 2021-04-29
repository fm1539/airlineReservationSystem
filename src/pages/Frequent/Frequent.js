import React, {useState} from 'react'
import {InputGroup, FormControl, Modal, Button, Card, Container, Row, Col, Tab, Tabs} from 'react-bootstrap'
import {sCheckLoggedIn, sLogout, sLogin, sRegister} from '../../global/Reducer'
import NavBar from '../../shared/NavBar'
import paginationFactory from 'react-bootstrap-table2-paginator'
import BootstrapTable from 'react-bootstrap-table-next'
import Sidebar from '../../shared/Sidebar'

function Frequent(){

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    
    let loggedIn = false
    if (sCheckLoggedIn()) loggedIn = true

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
            <div style={{marginLeft: '270px'}}>
                
            </div>
        </div>
    </React.Fragment>
    )
}

export default Frequent