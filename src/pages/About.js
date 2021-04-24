import React from "react";
import {Navbar, Card, Row, Col, Container} from 'react-bootstrap'

function About(){
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href='/' style={{width: '150px'}}><img className="logo"src="./logo1.png"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        </Navbar>
            <main role="main" className="inner cover">
                <div id="background-wrap">
                    <div className="bubble x1"></div>
                    <div className="bubble x2"></div>
                    <div className="bubble x3"></div>
                    <div className="bubble x4"></div>
                    <div className="bubble x5"></div>
                    <div className="bubble x6"></div>
                    <div className="bubble x7"></div>
                    <div className="bubble x8"></div>
                    <div className="bubble x9"></div>
                    <div className="bubble x10"></div>      
                </div>
            </main>
            <h1 style={{textAlign: 'left', marginLeft: '10%', paddingTop: '7vh'}}>Programmers</h1>
            <Container style={{marginTop: '10vh', overflowX: 'hidden'}}>
                <Row md={3}>
                    <Col xs>
                        <Card border="success" className="hoverEffect" style={{ borderRadius: '20px' }}>
                            <Card.Header>
                                <img className="pfp" src="spidey.jpeg"/>
                                <h1 className="about-name">Isfar Oshir</h1>
                            </Card.Header>
                            <Card.Body>
                            <Card.Title>Software Engineer</Card.Title>
                            <Card.Text>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            </Card.Text>
                            <a href="https://www.linkedin.com/in/isfar-oshir-043403190/" target="_blank" style={{paddingRight: '10px'}}><i className="fa fa-linkedin-square socialIcon"></i></a>
                            <a href="http://www.isfaroshir.com/" target="_blank" style={{paddingRight: '10px'}}><img src="isfarcom.png" style={{height:'15px'}} /></a>
                            <a href="https://github.com/ioshir4350?tab=stars" target="_blank"><i className="fa fa-github socialIcon" style={{color: 'black'}}></i></a>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs>
                        <Card border="success" style={{ borderRadius: '20px' }} className="hoverEffect">
                            <Card.Header>
                                <img className="pfp" src="spidey.jpeg"/>
                                <h1 className="about-name">Farhan Mashud</h1>
                            </Card.Header>
                            <Card.Body>
                            <Card.Title>Software Engineer</Card.Title>
                            <Card.Text>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs>
                        <Card border="success" className="hoverEffect" style={{ borderRadius: '20px' }}>
                            <Card.Header>
                                <img className="pfp" src="spidey.jpeg"/>
                                <h1 className="about-name">Mohammed Uddin</h1>
                            </Card.Header>
                            <Card.Body>
                            <Card.Title>Back End Software Engineer</Card.Title>
                            <Card.Text>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default About