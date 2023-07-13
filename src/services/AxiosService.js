import axios from "axios";
import { app } from "../main.js";

const apiClient = axios.create();

export default {
    postLibraryBooks(infoObj) {
        // by putting ?auth=idToken you will be granted user privilege (after logged in) to write with Regis data node
        let url = "https://webdev-test-c28f1-default-rtdb.asia-southeast1.firebasedatabase.app/regis.json?auth="
        + app.config.globalProperties.$idToken;
        if (!app.config.globalProperties.$authenticated) {
            alert("User must login first to reserve book");
        }
        return apiClient.post(url, infoObj);
    },
    getLibraryBooks() {
        // since our data base will contain each user's basket
        // we gonna make it require auth
        let url = "https://webdev-test-c28f1-default-rtdb.asia-southeast1.firebasedatabase.app/regis.json?auth="
            + app.config.globalProperties.$idToken;
        return apiClient.get(url);
    },
    deleteLibraryBooks(frbid) {
        let url = "https://webdev-test-c28f1-default-rtdb.asia-southeast1.firebasedatabase.app/regis/" + frbid + ".json?auth="
            + app.config.globalProperties.$idToken;
        return apiClient.delete(url);
    },
    postRegister(infoObj) {
        let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
            + "AIzaSyBuJkaa2VYAsff1obRSEwznNJGNO4JOIfg";
        return apiClient.post(url, infoObj);
    },
}