import React, { useEffect, useState } from 'react'
import ItemService from '../services/ItemService';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const CreateItem = () => {

    const access_token = localStorage.getItem('access_token');

    const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `${access_token}`,
    };

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        if (id === '_add') {
            return;
        } else {
            ItemService.getItemById(id, headers).then((res) => {
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

    const cancel = () => {
        history.replace('/item-list');
    }

    const getTitle = () => {
        if (id === '_add') {
            return <h3 className='text-center'>Add Item</h3>
        } else {
            return <h3 className='text-center'>Update Item</h3>
        }
    }

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    <div className='card col-md-6 offset-md-3 offset-md-3'>
                        {
                            getTitle()
                        }
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
                                <button className='btn btn-danger' onClick={() => cancel()} style={{ marginLeft: '10px' }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateItem;