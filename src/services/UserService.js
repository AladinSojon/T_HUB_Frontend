import axios from "axios";

const USER_API_BASE_URL = "http://localhost:8080/user";

class UserService {

    getUserList(headers) {
        return axios.get(USER_API_BASE_URL + '/list', { headers });
    }

    addUser(user, headers) {
        return axios.post(USER_API_BASE_URL, user, { headers });
    }

    getUserById(id, headers) {
        return axios.get(USER_API_BASE_URL + '/' + id, { headers });
    }

    updateUser(user, id, headers) {
        return axios.put(USER_API_BASE_URL + '/' + id, user, { headers });
    }

    deleteUser(id, headers) {
        return axios.delete(USER_API_BASE_URL + '/' + id, { headers });
    }
}

export default new UserService();