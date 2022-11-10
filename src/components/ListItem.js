import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import ItemService from '../services/ItemService';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { Modal } from 'react-bootstrap';
import { BsXLg } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';
import ItemComponent from './ItemComponent';

const ListItem = () => {

    const [show, setShow] = useState(false);
    const [itemId, setItemId] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const access_token = localStorage.getItem('access_token');

    const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `${access_token}`
    };

    const [itemList, setItemList] = useState([]);
    
    useEffect(() => {
        ItemService.getItemList(headers).then((res) => {
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
        setItemId(id);
        handleShow();
    }

    const deleteItem = (id) => {
        ItemService.deleteItem(id, headers).then((res) => {
            setItemList(() => itemList.filter(item => item.id !== id));
        });
    }

    const getTitle = () => {
        if (itemId === '_add') {
            return <h3 className='text-center'>Add Item</h3>
        } else {
            return <h3 className='text-center'>Update Item</h3>
        }
    }

    return (
        <div>
            <div className='row'>
                <button className='btn btn-info' style={{marginBottom: '10px', marginTop: '10px'}} onClick={() => editItem('_add')}>Add Item</button>
                <h2 style={{marginBottom: '10px', marginTop: '10px', paddingLeft: '30%'}}>Item List</h2>

                <div className='justify-content-center'>
                    <BootstrapTable data={itemList} striped hover condensed pagination={paginationFactory} filter={filterFactory}>
                        <TableHeaderColumn isKey dataField='id' width='20%' hidden>Id</TableHeaderColumn>
                        <TableHeaderColumn dataField='name' tdStyle={{ whiteSpace: 'normal' }} filterValue={textFilter}>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='description' tdStyle={{ whiteSpace: 'normal' }}>Description</TableHeaderColumn>
                        <TableHeaderColumn dataField='id' tdStyle={{ whiteSpace: 'normal' }} dataFormat={linkFollow}>Action</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{ getTitle() }</Modal.Title>
                    <BsXLg onClick={handleClose} />
                </Modal.Header>
                <Modal.Body><ItemComponent id={itemId} handleClose={handleClose} /></Modal.Body>
            </Modal>
        </div>
    )
}

export default ListItem;
