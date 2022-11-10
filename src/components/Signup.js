import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SignupService from "../services/SignupService";
import { useForm } from "react-hook-form";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();

  const cancel = () => {
    history.replace("/login");
  };

  const getTitle = () => {
    return <h3 className="text-center">Sign Up</h3>;
  };

  const onSubmit = (data) => {
    let user = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    SignupService.addUser(user).then(history.replace("/login"));
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

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    {...register("password", {
                      required: "Password is Required",
                    })}
                  />
                  {errors.password && (
                    <small className="text-danger">
                      {errors.password.message}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="form-control"
                    {...register("confirmPassword", {
                      required: "Confirm Password is Required",
                    })}
                  />
                  {errors.confirmPassword && (
                    <small className="text-danger">
                      {errors.confirmPassword.message}
                    </small>
                  )}
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

export default Signup;
