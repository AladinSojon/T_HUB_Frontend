import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import MealPreferenceService from "../services/MealPreferenceService";

const MealPreference = ({ date, handleClose }) => {
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

    const onSubmit = (data) => {
        handleClose();

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
            <div className="row">
                <div className="card-body">
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
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MealPreference;