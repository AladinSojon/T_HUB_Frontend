import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { createBrowserHistory } from 'history';

const Header = () => {

    const history = createBrowserHistory({
        forceRefresh: true
    });

    const [loggedIn, setLoggedIn] = useState(false);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('loggedIn');
        history.replace('/login');
        setLoggedIn(false);
    }

    useEffect(() => {
        if (localStorage.getItem('access_token') !== null) {
            setLoggedIn(true);
        }
    }, []);

    return (
        <div>
            <header>
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="/">Meal Management</Navbar.Brand>
                        <Nav className="me-auto">
                            {loggedIn &&
                                <>
                                    <Nav.Link href="/item-list">Item List</Nav.Link>
                                    <Nav.Link href="/user-list">User List</Nav.Link>
                                    <Nav.Link href="/menu-list">Menu List</Nav.Link>
                                    <button type="button" className="btn btn-dark" onClick={() => logout()}>Logout</button>
                                </>
                            }
                            {!loggedIn &&
                                <>
                                    <Nav.Link href="/login">Sign In</Nav.Link>
                                    <Nav.Link href="/signup">Sign Up</Nav.Link>
                                </>
                            }
                        </Nav>
                    </Container>
                </Navbar>
            </header>
        </div>

    )
}

export default Header;
