import axios from "axios";

const MENU_API_BASE_URL = "http://localhost:8080/menu";


class MenuService {

    getMenuList(headers) {
        return axios.get(MENU_API_BASE_URL + '/list', { headers });
    }

    addMenu(menu, headers) {
        return axios.post(MENU_API_BASE_URL, menu, { headers });
    }

    getMenuById(id, headers) {
        return axios.get(MENU_API_BASE_URL + "/" + id, { headers });
    }

    updateMenu(menu, id, headers) {
        return axios.put(MENU_API_BASE_URL + '/' + id, menu, { headers });
    }

    deleteMenu(id, headers) {
        return axios.delete(MENU_API_BASE_URL + '/' + id, { headers });
    }
}

export default new MenuService();