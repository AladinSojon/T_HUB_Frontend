import React, { useEffect, useState } from "react";
import { createBrowserHistory } from 'history';
import UserService from "../services/UserService";
import { useForm } from "react-hook-form";

const UserComponent = ({ id, handleClose }) => {
  const access_token = localStorage.getItem("access_token");

  const headers = {
    "X-Requested-With": "XMLHttpRequest",
    Authorization: `${access_token}`,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const history = createBrowserHistory({
    forceRefresh: true
  });

  useEffect(() => {
    if (id === "_add") {
      return;
    } else {
      UserService.getUserById(id, headers).then((res) => {
        if (res.data.access == "accessDenied" || res.data.access == "accountUnverified") {
          history.push({
            pathname: 'access-denied',
            state: { detail: res.data }
          });
        }

        let user = res.data;
        setValue("username", user.username);
        setValue("firstName", user.firstName);
        setValue("lastName", user.lastName);
        setValue("email", user.email);
      });
    }

    if (localStorage.getItem("access_token") === null) {
      history.push("/login");
    }
  }, []);

  const onSubmit = (data) => {
    let user = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    handleClose();

    if (id === '_add') {
      UserService.addUser(user, headers).then(history.replace("/user-list"));
    } else {
      UserService.updateUser(user, id, headers).then(history.replace("/user-list"));
    }
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
              <label>First Name</label>
              <input
                placeholder="First Name"
                className="form-control"
                {...register("firstName")}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                placeholder="Last Name"
                className="form-control"
                {...register("lastName")}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                placeholder="Email"
                className="form-control"
                {...register("email", {
                  required: "Email is Required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                })}
              />
              {errors.email && (
                <small className="text-danger">
                  {errors.email.message}
                </small>
              )}
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

export default UserComponent;
