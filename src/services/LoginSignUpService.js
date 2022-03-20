import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

class LoginSignUpService {

    addLogin(login) {        
        return axios.post(API_BASE_URL + '/login', login);
    }

    addSignup(user) {
        return axios.post(API_BASE_URL + '/signup', user);
    }
}

export default new LoginSignUpService();