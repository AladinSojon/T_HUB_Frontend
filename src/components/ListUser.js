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
          setUserList(res.data)
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

    return (
        <div>
            <h2 className='text-center'>User List</h2>
            <div className='row justify-content-center'>
                <BootstrapTable data={userList} striped hover condensed pagination={paginationFactory} filter={filterFactory}>
                    <TableHeaderColumn isKey dataField='id' width='20%' hidden>Id</TableHeaderColumn>
                    <TableHeaderColumn dataField='username' filterValue={textFilter}>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='firstName'>First Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='lastName'>Last Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
                    <TableHeaderColumn dataField='id' dataFormat={linkFollow}>Action</TableHeaderColumn>
                </BootstrapTable>
            </div>
        </div>
    )
}

export default ListUser;
