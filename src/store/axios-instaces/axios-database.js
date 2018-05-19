import axios from "axios";

const instance = axios.create({
    baseURL: "https://test-r-app.firebaseio.com"
});

export default instance;