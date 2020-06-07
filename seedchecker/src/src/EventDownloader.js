import axios from "axios";

const instance = axios.create({
    baseURL: "https://raw.githubusercontent.com/Leanny/SeedSearcher/master/Events/"
});

export default instance;