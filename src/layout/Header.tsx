import React from "react";
import { Dropdown, Breadcrumb, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IMAGES } from "@/contants/images";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="header">
            <Row>
                <Col xs={6} className="align-self-center">
                    <div className="mainbreadcrumb d-none d-md-block">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/admin">Pages</Breadcrumb.Item>
                            <Breadcrumb.Item active>{title}</Breadcrumb.Item>
                        </Breadcrumb>
                        {/* <h1>{title}</h1> */}
                    </div>
                </Col>
                <Col xs={6} className="text-end">
                    <div className='headerright' style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" className="p-0">
                                <img alt="" src={IMAGES.Avatar1} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile-settings">Profile Settings</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Col>
            </Row>
        </header>
    )
}

export default Header;