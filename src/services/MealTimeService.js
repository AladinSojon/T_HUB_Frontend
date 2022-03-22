import axios from "axios";

const MEALTIME_API_BASE_URL = "http://localhost:8080/mealTime/list";
const ROLE_API_BASE_URL = "http://localhost:8080/role/list";
const ASSIGNED_ROLE_API_BASE_URL = "http://localhost:8080/user/role";


class MealTimeService {

    getMealTimeList(headers) {
        return axios.get(MEALTIME_API_BASE_URL, { headers });
    }

    getRoleList(headers) {
        return axios.get(ROLE_API_BASE_URL, { headers });
    }

    getAssignedRoleList(id, headers) {
        return axios.get(ASSIGNED_ROLE_API_BASE_URL + "/" + id, { headers });

    }
}

export default new MealTimeService();