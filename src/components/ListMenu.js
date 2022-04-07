import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import MenuService from '../services/MenuService';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { merge } from 'lodash';
import { Modal } from 'react-bootstrap';
import { BsXLg } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';
import MealPreference from './MealPreference';
import MenuComponent from './MenuComponent';

const ListMenu = () => {

    const [show, setShow] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [date, setDate] = useState('');
    const [menuId, setMenuId] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseMenu = () => setShowMenu(false);
    const handleShowMenu = () => setShowMenu(true);

    const access_token = localStorage.getItem('access_token');
    const history = useHistory();

    const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `${access_token}`,
    };

    const [menuList, setMenuList] = useState([]);
    useEffect(() => {
        MenuService.getMenuList(headers).then((res) => {
            setMenuList(res.data)
        });

        if (localStorage.getItem('access_token') === null) {
            history.push("/login");
        }
    }, []);

    const linkFollow = (date, row) => {
        return (
            <div>
                <button onClick={() => editMealPreference(date)} className="btn btn-info">Edit Preference</button>
            </div>
        );
    };

    const editMealPreference = (date) => {
        setDate(date);
        handleShow();
    }

    const addMenu = (id) => {
        setMenuId(id);
        handleShowMenu();
    }

    const getTitle = () => {
        return <h3 className='text-center'>Meal Preference</h3>
    }

    const getMenuTitle = () => {
        if (menuId === "_add") {
            return <h3 className="text-center">Create Menu</h3>;
        } else {
            return <h3 className="text-center">Update Menu</h3>;
        }
    }

    var thc = [];

    var finalcolumns = [];
    var columns = [];
    thc.push(<TableHeaderColumn isKey dataField='date' width='20%' hidden />,
        <TableHeaderColumn dataField='date'>Date</TableHeaderColumn>,
        <TableHeaderColumn dataField='day'>Day</TableHeaderColumn>
    );
    for (let i = 0; i < menuList.length; i++) {
        var l = Object.keys(menuList[i].mealList).length;
        for (var j = 0; j < l; j++) {
            columns.push(Object.keys(menuList[i].mealList)[j])
        }
    }

    finalcolumns = Array.from(new Set(columns));
    for (let i = 0; i < finalcolumns.length; i++) {
        thc.push(
            <TableHeaderColumn tdStyle={{ whiteSpace: 'normal' }} thStyle={{ whiteSpace: 'normal' }} dataField={finalcolumns[i]}>{finalcolumns[i]}</TableHeaderColumn>
        );
    }

    thc.push(<TableHeaderColumn dataField='date' width='11%' dataFormat={linkFollow}>Action</TableHeaderColumn>);

    for (var i = 0; i < menuList.length; i++) {
        merge(menuList[i], menuList[i].mealList);
    }

    return (
        <div>
            <div className='row'>
                <button className='btn btn-info' style={{ marginBottom: '10px', marginTop: '10px' }} onClick={() => addMenu('_add')}>Add Menu</button>

                <h2 style={{ marginBottom: '10px', marginTop: '10px', paddingLeft: '45%' }}>Menu</h2>
                <div className='row justify-content-center'>
                    <BootstrapTable data={menuList} striped hover condensed pagination={paginationFactory} filter={filterFactory} tableStyle={{ width: '1400px' }}>
                        {thc}
                    </BootstrapTable>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{getTitle()}</Modal.Title>
                    <BsXLg onClick={handleClose} />
                </Modal.Header>
                <Modal.Body><MealPreference date={date} handleClose={handleClose} /></Modal.Body>
            </Modal>

            <Modal show={showMenu} onHide={handleCloseMenu}>
                <Modal.Header>
                    <Modal.Title>{getMenuTitle()}</Modal.Title>
                    <BsXLg onClick={handleCloseMenu} />
                </Modal.Header>
                <Modal.Body><MenuComponent id={menuId} handleClose={handleCloseMenu} /></Modal.Body>
            </Modal>
        </div>
    )
}

export default ListMenu;
