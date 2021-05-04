import React, {useState, useEffect} from 'react'
import NavBar from '../../shared/NavBar'
import axios from 'axios'
import {InputGroup, FormControl, Modal, Button, Card, Container, Row, Col} from 'react-bootstrap'
import {aLogin, aLogout, aCheckLoggedIn, aRegister} from '../../global/Reducer'

function AHomePage(){
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false)

    const [cities, setCities] = useState([])
    const [airports, setAirports] = useState([])
 
    const [loginEvent, setLoginEvent] = useState({
        email: "",
        password: ""
    })

    const [searchInput, setSearchInput] = useState({
        leaving: "",
        going: "",
        depart_date: ""
    }) 

    useEffect(()=> {
        axios.get('http://localhost:8000/api/customer/getAllAirports').then( response => airportHandler(response.data.results))
        axios.get('http://localhost:8000/api/customer/getAllCities').then( response => cityHandler(response.data.results)) 
    }, [])

    const cityHandler =(arr) => setCities(arr)

    const airportHandler = (arr) => setAirports(arr)

    const loginChangeHandler = (event) => {
        setLoginEvent({
            ...loginEvent, 
            [event.target.name]: event.target.value
        })
    }

    const searchChangeHandler = (event) => {
        setSearchInput({
            ...searchInput,
            [event.target.name]: event.target.value
        })
    }

    const searchButtonHandler = () => {
        let obj = {
            "sourceCity": "",
            "sourceAirport": "",
            "destinationCity": "",
            "destinationAirport": "",
            "departureDate": ""
        }
        if (cities.includes(searchInput.leaving)) obj["sourceCity"] = searchInput.leaving;
        else if (airports.includes(searchInput.leaving)) obj["sourceAirport"] = searchInput.leaving;

        if (cities.includes(searchInput.going)) obj["destinationCity"] = searchInput.going;
        else if (airports.includes(searchInput.going)) obj["destinationAirport"] = searchInput.going;

        let query = ""
        
        for (var key in obj){
            if (obj[key] !== "")  query += key + "=" + obj[key] + '&'
        }
        query = query.slice(0, query.length-1)
        
        window.location = "/aSearchResults?" + query

    }

    const loginButtonHandler = () => aLogin(loginEvent, '/agent')

    const [registerEvent, setRegisterEvent] = useState({
        email: "", 
        password: ""
    })

    const registerChangeHandler = (event) => {
        setRegisterEvent({
            ...registerEvent,
            [event.target.name]: event.target.value
        })
    }

    const registerButtonHandler = () => aRegister(registerEvent, '/')

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);


    let loggedIn = false
    if (aCheckLoggedIn()) loggedIn = true

    return (
        <React.Fragment>
            {loggedIn ? <NavBar 
                nav={[['/aViewFlights', 'View My Flights'], ['/viewTop', 'View Top Customers'], ['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {aLogout}
                logoPath="/agent"
            />
            :
            <NavBar 
                nav={[['#pricing', 'Flight Tracker']]} 
                accountManagement={[handleShow, handleShow2]}
                loggedIn = {loggedIn}
                logOut = {aLogout}
                logoPath="/agent"
            />
        }
            
            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>Email</label>
                        <br/>
                        <input type="email" name="email" placeholder="Email" onChange={loginChangeHandler} autocomplete="chrome-off" required/>
                        <br/>
                        <br/>
                        <label>Password</label>
                        <br/>
                        <input type="password" name="password" placeholder="Password" onChange={loginChangeHandler} autocomplete="chrome-off" required/>
                        <br /><br />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={loginButtonHandler}>
                    Sign In
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>Email</label>
                        <br/>
                        <input type="email" name="email" placeholder="Email" onChange={registerChangeHandler} required/>
                        <br/>
                        <br/>
                        <label>Password</label>
                        <br/>
                        <input type="password" name="password" placeholder="Password" onChange={registerChangeHandler} required/>
                        <br /><br />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                    Close
                </Button>
                <Button variant="primary" onClick={registerButtonHandler}>
                    Sign Up
                </Button>
                </Modal.Footer>
            </Modal>
            <div className="a-search-flights-div">
                <h1 style={{color: 'white'}}>Help a Customer Find A Flight Today!</h1>
            <Card style={{boxShadow: '0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)', width:'50%', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Card.Body>
                        <Card.Title style={{'textAlign': 'left'}}>Search Flights</Card.Title>
                        <div style={{'display': 'flex'}}>
                            <InputGroup className="mb-3" style={{'width': '50%'}}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">Leaving</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                placeholder="From"
                                aria-label="Username"
                                name="leaving"
                                onChange={searchChangeHandler}
                                aria-describedby="basic-addon1"
                                />
                            </InputGroup>
                            <div style={{'width': '10px'}}> </div>
                            <InputGroup className="mb-3" style={{'width': '50%'}}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">Going</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                placeholder="To"
                                aria-label="Username"
                                name="going" onChange={searchChangeHandler}
                                aria-describedby="basic-addon1"
                                />
                            </InputGroup>
                        </div>
                        <br/>
                        <label for="depart_date">Departure Date: </label>
                        <br/>
                        <input name="depart_date" type="date" onChange={searchChangeHandler}/> <br/><br/>
                        <Button onClick={searchButtonHandler}>Search</Button>
                    </Card.Body>
                </Card>
            </div>
            <h1 style={{marginTop:'20px'}}>Some of our Reviews</h1>
            <Container style={{marginTop: '20px'}}>
                <Row md={3}>
                    <Col xs>
                        <Card border="success" style={{ borderRadius: '20px' }}>
                            <Card.Header>John Doe</Card.Header>
                            <Card.Body>
                            <Card.Title>Great!</Card.Title>
                            <Card.Text>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs>
                        <Card border="success" style={{borderRadius: '20px' }}>
                            <Card.Header>Sarah Connor</Card.Header>
                            <Card.Body>
                            <Card.Title>Exquisite</Card.Title>
                            <Card.Text>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs>
                    <Card border="success" style={{ borderRadius: '20px' }}>
                            <Card.Header>Tony Stark</Card.Header>
                            <Card.Body>
                            <Card.Title>Suited Me</Card.Title>
                            <Card.Text>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default AHomePage