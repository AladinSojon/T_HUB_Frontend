import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import MenuService from '../services/MenuService';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { merge } from 'lodash';

const ListMenu = () => {
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
            <TableHeaderColumn tdStyle={{ whiteSpace: 'normal' }} thStyle = {{ whiteSpace: 'normal' }} dataField={finalcolumns[i]}>{finalcolumns[i]}</TableHeaderColumn>
        );
    }

    for (var i = 0; i < menuList.length; i++) {
        merge(menuList[i], menuList[i].mealList);
    }

    return (
        <div>
            <h2 className='text-center'>Menu</h2>
            <div className='row justify-content-center'>
                <BootstrapTable data={menuList} striped hover condensed pagination={paginationFactory} filter={filterFactory} tableStyle={{width: '1400px'}}>
                    {thc}
                </BootstrapTable>
            </div>
        </div>
    )
}

export default ListMenu;
