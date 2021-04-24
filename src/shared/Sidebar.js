import React from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarContent, SidebarHeader, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { NavLink } from 'react-router-dom';

function Sidebar(){
    return (
        <React.Fragment>
        <ProSidebar className="side-bar">
                <SidebarHeader>
                    Employee
                </SidebarHeader>
                <SidebarContent>
                <ProSidebar>
                <Menu iconShape="square">
                    <SubMenu title="View Flights" >
                    <MenuItem>
                        <NavLink to="/staff"  activeStyle={{ color: 'red'}}>
                            Next 30 days
                        </NavLink>
                    </MenuItem>
                    <MenuItem>
                        <NavLink to="/range"  activeStyle={{ color: 'red'}}>
                            Current/Past Flights
                        </NavLink>
                    </MenuItem>
                    </SubMenu>
                    <SubMenu title="Components" >
                    <MenuItem>Component 1</MenuItem>
                    <MenuItem>Component 2</MenuItem>
                    </SubMenu>
                </Menu>
            </ProSidebar>
                </SidebarContent>
                <SidebarFooter>
                    Copyright
                </SidebarFooter>
            </ProSidebar>            
            </React.Fragment>
    )
}

export default Sidebar