import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserService from '../services/UserService';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { Modal } from 'react-bootstrap';
import { BsXLg } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';
import UserComponent from './UserComponent';
import AssignRole from './AssignRole';

const ListUser = () => {

    const [show, setShow] = useState(false);
    const [showRoleAssign, setShowRoleAssign] = useState(false);
    const [userId, setUserId] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseRoleAssign = () => setShowRoleAssign(false);
    const handleShowRoleAssign = () => setShowRoleAssign(true);

    const access_token = localStorage.getItem('access_token');

    const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `${access_token}`,
    };

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        UserService.getUserList(headers).then((res) => {
            if (res.data.access === "accessDenied" || res.data.access === "accountUnverified") {
                history.push({
                    pathname: 'access-denied',
                    state: { detail: res.data }
                });
            }

            console.log("user " + JSON.stringify(res.data));

            setUserList(res.data);
        });

        if (localStorage.getItem('access_token') === null) {
            history.push("/login");
        }
    }, []);


    const linkFollow = (id, row) => {
        return (
            <div>
                <button onClick={() => editUser(id)} className="btn btn-info">Edit</button>
                <button style={{ marginLeft: '10px' }} onClick={() => deleteUser(id)} className="btn btn-danger">Delete</button>
                <button style={{ marginLeft: '10px' }} onClick={() => assignRole(id)} className="btn btn-success">Assign Role</button>
            </div>
        );
    };

    const history = useHistory();

    const editUser = (id) => {
        setUserId(id);
        handleShow();
    }

    const deleteUser = (id) => {
        UserService.deleteUser(id, headers).then((res) => {
            setUserList(() => userList.filter(user => user.id !== id));
        });
    }

    const getTitle = () => {
        if (userId === '_add') {
            return <h3 className='text-center'>Add User</h3>
        } else {
            return <h3 className='text-center'>Update User</h3>
        }
    }

    const getRoleAssignTitle = () => {
        return <h3 className='text-center'>Assign Role to User</h3>
    }

    const assignRole = (id) => {
        setUserId(id);
        handleShowRoleAssign();
    }

    return (
        <div>
            <div className='row'>
                <button className='btn btn-info' style={{ marginBottom: '10px', marginTop: '10px' }} onClick={() => editUser('_add')}>Add User</button>
                <h2 style={{ marginBottom: '10px', marginTop: '10px', paddingLeft: '35%' }}>User List</h2>
                <div className='row justify-content-center'>
                    <BootstrapTable data={userList} striped hover condensed pagination={paginationFactory} filter={filterFactory}>
                        <TableHeaderColumn isKey dataField='id' hidden>Id</TableHeaderColumn>
                        <TableHeaderColumn dataField='username' tdStyle={{ whiteSpace: 'normal' }} filterValue={textFilter}>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='firstName' tdStyle={{ whiteSpace: 'normal' }}>First Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='lastName' tdStyle={{ whiteSpace: 'normal' }}>Last Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='email' tdStyle={{ whiteSpace: 'normal' }}>Email</TableHeaderColumn>
                        <TableHeaderColumn dataField='id' width='25%' dataFormat={linkFollow}>Action</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{getTitle()}</Modal.Title>
                    <BsXLg onClick={handleClose} />
                </Modal.Header>
                <Modal.Body><UserComponent id={userId} handleClose={handleClose} /></Modal.Body>
            </Modal>

            <Modal show={showRoleAssign} onHide={handleCloseRoleAssign}>
                <Modal.Header>
                    <Modal.Title>{getRoleAssignTitle()}</Modal.Title>
                    <BsXLg onClick={handleCloseRoleAssign} />
                </Modal.Header>
                <Modal.Body><AssignRole id={userId} handleClose={handleCloseRoleAssign} /></Modal.Body>
            </Modal>
        </div>
    )
}

export default ListUser;
