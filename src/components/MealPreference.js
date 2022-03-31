import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import MealPreferenceService from "../services/MealPreferenceService";

const MealPreference = () => {
    const access_token = localStorage.getItem("access_token");

    const headers = {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `${access_token}`,
    };

    const [preferences, setPreferences] = useState([]);
    const [meals, setMeals] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm();

    const history = useHistory();
    const { date } = useParams();

    useEffect(() => {
        async function getMealPreference() {
            return MealPreferenceService
                .getMealPreference(date, headers)
                .then((res) => {
                    console.log(res.data);
                    setPreferences(Object.values(res.data));
                    setMeals(Object.keys(res.data));
                })
                .catch((err) => console.error('Service failure', err));
        }

        getMealPreference();
    }, []);

    const cancel = () => {
        history.push("/menu-list");
    };

    const onSubmit = (data) => {
        const updatedPreferences = { date: date };
        for (let index = 0; index < preferences.length; index++) {
            updatedPreferences[meals[index]] = preferences[index];
        }

        MealPreferenceService.submitPreference(updatedPreferences, headers).then(history.push("/menu-list"));
    }

    const handleCheck = (index) => {
        const updatedPreferences = preferences.map((item, i) =>
            i === index ? !item : item
        );

        setPreferences(updatedPreferences);
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        <div className="card-body">
                            <h3 className="text-center">Meal Preference</h3>
                            <h4 className="text-center">Date: {date}</h4>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <div className="list-container">
                                        {meals.map((item, index) => (
                                            <div key={index}>
                                                <input
                                                    type="checkbox"
                                                    value={item}
                                                    checked={preferences[index]}
                                                    onChange={() => handleCheck(index)}
                                                />
                                                <span style={{ marginLeft: '15px' }}>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button className="btn btn-success" type="submit">
                                    Save
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => cancel()}
                                    style={{ marginLeft: "10px" }}>
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MealPreference;