import axios from "axios";

const MEALTIME_API_BASE_URL = "http://localhost:8080/mealTime/list";


class MealTimeService {

    getMealTimeList(headers) {
        return axios.get(MEALTIME_API_BASE_URL, { headers });
    }
}

export default new MealTimeService();