import React, { useEffect } from 'react'
import ItemService from '../services/ItemService';
import { useForm } from 'react-hook-form';
import { createBrowserHistory } from 'history';


const ItemComponent = ({ id, handleClose }) => {

    const access_token = localStorage.getItem('access_token');

    const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `${access_token}`,
    };

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const history = createBrowserHistory({
        forceRefresh: true
        });

    useEffect(() => {
        if (id === '_add') {
            return;
        } else {
            ItemService.getItemById(id, headers).then((res) => {
                if (res.data.access == "accessDenied" || res.data.access == "accountUnverified") {
                    history.push({
                        pathname: 'access-denied',
                        state: { detail: res.data }
                    });
                }

                let item = res.data;
                setValue("name", item.name);
                setValue("description", item.description);
            });
        }

        if (localStorage.getItem('access_token') === null) {
            history.push("/login");
        }
    }, []);

    const onSubmit = (data) => {
        let item = { name: data.name, description: data.description };
        handleClose();

        if (id === '_add') {
            ItemService.addItem(item, headers).then(
                history.replace("/item-list")
            );
        } else {
            ItemService.updateItem(item, id, headers).then((res) => {
                history.replace('/item-list');
            });
        }
    }

    return (
        <div>
            <div className='row'>
                <div className='card-body'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='form-group'>
                            <label>Name</label>
                            <input placeholder='Name' className='form-control' {...register("name", { required: "Item Name is Required" })} />
                            {errors.name && (<small className='text-danger'>{errors.name.message}</small>)}
                        </div>

                        <div className='form-group'>
                            <label>Description</label>
                            <textarea style={{ height: '200px' }} className='form-control' placeholder='Description' {...register("description")} />
                        </div>

                        <button className='btn btn-success' type='submit'>Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ItemComponent;