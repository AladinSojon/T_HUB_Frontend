import React, { useEffect, useState } from "react";
import MenuService from "../services/MenuService";
import MealTimeService from "../services/MealTimeService";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Select from 'react-select';
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import ItemService from "../services/ItemService";
import styles from "../css/menu.css"
import 'react-datepicker/dist/react-datepicker.css'


const MenuComponent = () => {
    const [mealTimeList, setMealTimeList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const access_token = localStorage.getItem("access_token");

    const headers = {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `${access_token}`,
    };

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm();

    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        async function getItemList() {
            return ItemService
                .getItemList(headers)
                .then((res) => {
                    for (let idx = 0; idx < res.data.length; idx++) {
                        res.data[idx].label = res.data[idx].name;
                        res.data[idx].value = res.data[idx].id;
                    }
                    setItemList(res.data);
                })
                .catch((err) => console.error('Service failure', err));
        }
        getItemList();
    }, []);

    useEffect(() => {
        async function getMealTimeList() {
            return MealTimeService
                .getMealTimeList(headers)
                .then((res) => {
                    for (let idx = 0; idx < res.data.length; idx++) {
                        res.data[idx].label = res.data[idx].name;
                        res.data[idx].value = res.data[idx].key;
                    }
                    setMealTimeList(res.data);
                })
                .catch((err) => console.error('Service failure', err));
        }
        getMealTimeList();
    }, []);

    useEffect(() => {
        if (id === "_add") {
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

        if (localStorage.getItem("access_token") === null) {
            history.push("/login");
        }
    }, []);

    const onSubmit = (data) => {
        let menu = {
            mealTime: data.mealTime["key"],
            itemList: data.itemList,
            mealDate: data.mealDate,
            headCount: data.headCount,
        };

        if (id === "_add") {
            MenuService.addMenu(menu, headers).then(history.replace("/item-list"));
        } else {
            MenuService.updateMenu(menu, id, headers).then((res) => {
                history.replace("/item-list");
            });
        }
    };

    const cancel = () => {
        history.replace("/item-list");
    };

    const getTitle = () => {
        if (id === "_add") {
            return <h3 className="text-center">Create Menu</h3>;
        } else {
            return <h3 className="text-center">Update Menu</h3>;
        }
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        {getTitle()}
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <label>Date</label>
                                    <div className="row">
                                        <div className="col-md-11">
                                            <Controller
                                                name="mealDate"
                                                control={control}
                                                defaultValue={false}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        placeholderText="dd/MM/yyyy"
                                                        className="form-control"
                                                        onChange={(exp) => field.onChange(exp)}
                                                        minDate={moment().toDate()}
                                                        selected={field.value}
                                                        wrapperClassName={styles['add-vehicle-date']}
                                                        dateFormat="dd MMMM yyyy"
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Meal Time</label>
                                    <div className="row">
                                        <div className="col-md-11">
                                            <Controller
                                                name="mealTime"
                                                control={control}
                                                defaultValue={false}
                                                rules={{ required: true }}
                                                render={({ field }) => {
                                                    return (
                                                        <Select
                                                            placeholder="MealTimeList"
                                                            options={mealTimeList}
                                                            {...field}
                                                        />
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Item</label>
                                    <div className="row">
                                        <div className="col-md-11">
                                            <Controller
                                                name="itemList"
                                                control={control}
                                                defaultValue={false}
                                                rules={{ required: true }}
                                                render={({ field }) => {
                                                    return (
                                                        <Select
                                                            isMulti={true}
                                                            placeholder="ItemList"
                                                            options={itemList}
                                                            {...field}
                                                        />
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Head Count</label>
                                    <div className="row">
                                        <div className="col-md-11">
                                            <input
                                                type="number"
                                                min={0}
                                                autoComplete="off"
                                                {...register('headCount')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button className="btn btn-success" type="submit">
                                    Save
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => cancel()}
                                    style={{ marginLeft: "10px" }}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuComponent;
