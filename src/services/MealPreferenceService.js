import axios from "axios";

const MENU_API_BASE_URL = "http://localhost:8080/menu";


class MealPreferenceService {

    getMealPreference(date, headers) {
        return axios.get(MENU_API_BASE_URL + '/mealPreference?date=' + date, { headers });
    }

    submitPreference(updatedPreferences, headers) {
        return axios.post(MENU_API_BASE_URL + '/mealPreference', updatedPreferences, { headers });
    }
}

export default new MealPreferenceService();