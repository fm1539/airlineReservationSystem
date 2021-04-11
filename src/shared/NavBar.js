import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

function NavBar(props){ //props = {nav: [[link, title]], accountManagement: [signinOnlick, signupOnclick]}
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">AirGo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
                {props.nav.map((navItem) => {
                    return(
                        <Nav.Link href={navItem[0]}>{navItem[1]}</Nav.Link>
                    )
                })}
            </Nav>
            {props.loggedIn ? <Nav.Link onClick={props.logOut}>Logout</Nav.Link>
            :
            <NavDropdown title="Sign In/Up" id="collasible-nav-dropdown" style={{'color': 'white'}}>
                <NavDropdown.Item onClick={props.accountManagement[0]}>Sign In</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={props.accountManagement[1]}>Sign Up</NavDropdown.Item>
            </NavDropdown> 
            }
        </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar