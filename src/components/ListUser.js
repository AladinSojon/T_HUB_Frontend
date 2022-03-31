import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserService from '../services/UserService';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

const ListUser = () => {

    const access_token = localStorage.getItem('access_token');

    const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `${access_token}`,
    };

    const[userList, setUserList] = useState([]);

    useEffect(() => {
        UserService.getUserList(headers).then((res) => {
            if (res.data.access == "accessDenied" || res.data.access == "accountUnverified") {
                history.push({
                    pathname: 'access-denied',
                    state: { detail: res.data }
                });
            }

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
        history.replace('user/' + id);
    }

    const deleteUser = (id) => {
        UserService.deleteUser(id, headers).then((res) => {
            setUserList( () => userList.filter(user => user.id !== id));
        });
    }

    const assignRole = (id) => {
        history.replace('assign-role-user/' + id);
    }

    return (
        <div>
            <h2 className='text-center'>User List</h2>
            <div className='row justify-content-center'>
                <BootstrapTable data={userList} striped hover condensed pagination={paginationFactory} filter={filterFactory}>
                    <TableHeaderColumn isKey dataField='id' hidden>Id</TableHeaderColumn>
                    <TableHeaderColumn dataField='username' tdStyle = {{ whiteSpace: 'normal' }} filterValue={textFilter}>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='firstName' tdStyle = {{ whiteSpace: 'normal' }}>First Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='lastName' tdStyle = {{ whiteSpace: 'normal' }}>Last Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='email' tdStyle = {{ whiteSpace: 'normal' }}>Email</TableHeaderColumn>
                    <TableHeaderColumn dataField='id' width='25%' dataFormat={linkFollow}>Action</TableHeaderColumn>
                </BootstrapTable>
            </div>
        </div>
    )
}

export default ListUser;
