import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import MenuService from '../services/MenuService';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

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

    // const linkFollow = (id, row) => {
    //     return (
    //         <div>
    //             <button onClick={() => editItem(id)} className="btn btn-info">Edit</button>
    //             <button style={{ marginLeft: '10px' }} onClick={() => deleteItem(id)} className="btn btn-danger">Delete</button>
    //         </div>
    //     );
    // };

    const processMealList = (mealList, row) => {

        mealList.map(child => {
            return <TableHeaderColumn>Meal Time</TableHeaderColumn>
        })
        // menuList.map((groups) => {
        //     return {
        //         children: groups.mealList.map(child => {
        //             return console.log(child.mealTime)
        //         }),
        //     }
        // })
    }

    return (
        <div>
            <h2 className='text-center'>Item List</h2>
            <div className='row justify-content-center'>
                <BootstrapTable data={menuList} striped hover condensed pagination={paginationFactory} filter={filterFactory}>
                    <TableHeaderColumn isKey dataField='date' width='20%' hidden>Id</TableHeaderColumn>
                    <TableHeaderColumn dataField='date'>Date</TableHeaderColumn>
                    <TableHeaderColumn dataField='day'>Description</TableHeaderColumn>
                    {/* {
                        dataField.menuList.map(child => {
                            return <TableHeaderColumn>Meal Time</TableHeaderColumn>
                        })
                    } */}

                    <TableHeaderColumn dataField='mealList' dataFormat={processMealList}>Action</TableHeaderColumn>

                </BootstrapTable>
            </div>
        </div>
    )
}

export default ListMenu;
