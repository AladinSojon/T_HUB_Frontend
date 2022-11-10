import axios from "axios";

const ITEM_API_BASE_URL = "http://localhost:8080/item";


class ItemService {

    getItemList(headers) {
        return axios.get(ITEM_API_BASE_URL + '/list', { headers });
    }

    addItem(item, headers) {
        return axios.post(ITEM_API_BASE_URL, item, { headers });
    }

    getItemById(id, headers) {
        return axios.get(ITEM_API_BASE_URL + "/" + id, { headers });
    }

    updateItem(item, id, headers) {
        return axios.put(ITEM_API_BASE_URL + '/' + id, item, { headers });
    }

    deleteItem(id, headers) {
        return axios.delete(ITEM_API_BASE_URL + '/' + id, { headers });
    }
}

export default new ItemService();