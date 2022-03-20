import axios from "axios";

const SIGNUP_API_BASE_URL = "http://localhost:8080/signup";

class SignupService {

    addUser(user) {
        return axios.post(SIGNUP_API_BASE_URL, user);
    }
}

export default new SignupService();