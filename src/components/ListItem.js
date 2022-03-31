import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import ItemService from '../services/ItemService';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

const ListItem = () => {
    const access_token = localStorage.getItem('access_token');

    const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `${access_token}`
        // 'Access-Control-Allow-Credentials': true
    };

    const [itemList, setItemList] = useState([]);
    useEffect(() => {
        ItemService.getItemList(headers).then((res) => {
            //console.log(JSON.stringify(res));
            if (res.data.access == "accessDenied" || res.data.access == "accountUnverified") {
                history.push({
                    pathname: 'access-denied',
                    state: { detail: res.data }
                });
            }

            setItemList(res.data);
        });

        if (localStorage.getItem('access_token') === null) {
            history.push("/login");
        }
    }, []);

    const linkFollow = (id, row) => {
        return (
            <div>
                <button onClick={() => editItem(id)} className="btn btn-info">Edit</button>
                <button style={{ marginLeft: '10px' }} onClick={() => deleteItem(id)} className="btn btn-danger">Delete</button>
            </div>
        );
    };

    const history = useHistory();

    const editItem = (id) => {
        history.push('item/' + id);
    }

    const deleteItem = (id) => {
        ItemService.deleteItem(id, headers).then((res) => {
            setItemList(() => itemList.filter(item => item.id !== id));
        });
    }

    return (
        <div>
            <h2 className='text-center'>Item List</h2>
            <div className='row justify-content-center'>
                <BootstrapTable data={itemList} striped hover condensed pagination={paginationFactory} filter={filterFactory}>
                    <TableHeaderColumn isKey dataField='id' width='20%' hidden>Id</TableHeaderColumn>
                    <TableHeaderColumn dataField='name' tdStyle = {{ whiteSpace: 'normal' }} filterValue={textFilter}>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='description' tdStyle = {{ whiteSpace: 'normal' }}>Description</TableHeaderColumn>
                    <TableHeaderColumn dataField='id' tdStyle = {{ whiteSpace: 'normal' }} dataFormat={linkFollow}>Action</TableHeaderColumn>
                </BootstrapTable>
            </div>
        </div>
    )
}

export default ListItem;
