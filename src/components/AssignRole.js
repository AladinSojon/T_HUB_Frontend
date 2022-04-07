import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import MealTimeService from "../services/MealTimeService";

const AssignRole = ({ id, handleClose }) => {
    const access_token = localStorage.getItem("access_token");

    const headers = {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `${access_token}`,
    };

    const [roles, setRoles] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm();

    const history = useHistory();

    useEffect(() => {
        async function getRoleList() {
            return MealTimeService
                .getRoleList(headers)
                .then((res) => {
                    for (let idx = 0; idx < res.data.length; idx++) {
                        res.data[idx].label = res.data[idx].name;
                        res.data[idx].value = res.data[idx].key;
                    }

                    setRoles(res.data);
                })
                .catch((err) => console.error('Service failure', err));
        }
        getRoleList();
    }, []);

    useEffect(() => {
        async function getAssignedRoleList() {
            return MealTimeService
                .getAssignedRoleList(id, headers)
                .then((res) => {
                    for (let idx = 0; idx < res.data.length; idx++) {
                        res.data[idx].label = res.data[idx].name;
                        res.data[idx].value = res.data[idx].key;
                    }
                    setValue("roles", res.data);
                })
                .catch((err) => console.error('Service failure', err));
        }

        getAssignedRoleList();
    }, []);

    useEffect(() => {
        UserService.getUserById(id, headers).then((res) => {
            if (res.data.access == "accessDenied" || res.data.access == "accountUnverified") {
                history.push({
                    pathname: 'access-denied',
                    state: { detail: res.data }
                });
            }

            let user = res.data;
            setValue("username", user.username);
        });


        if (localStorage.getItem("access_token") === null) {
            history.push("/login");
        }
    }, []);

    const onSubmit = (data) => {
        handleClose();

        const roles = [];
        for (var i = 0; i < data.roles.length; i++) {
            roles.push(data.roles[i].value);
        }

        let user = {
            username: data.username,
            roles: roles,
        };

        UserService.updateUser(user, id, headers).then(history.replace("/user-list"));
    };

    return (
        <div>
            <div className="row">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                placeholder="Username"
                                className="form-control"
                                {...register("username", {
                                    required: "Username is Required",
                                })}
                            />
                            {errors.username && (
                                <small className="text-danger">
                                    {errors.username.message}
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Item</label>
                            <div className="row">
                                <div className="col-md-11">
                                    <Controller
                                        name="roles"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <Select
                                                    isMulti={true}
                                                    placeholder="Roles"
                                                    options={roles}
                                                    {...field}
                                                />
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-success" type="submit">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignRole;
