import axios from "axios";

axios.defaults.headers.common['Content-Type'] = "application/json"
axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.NEXTAUTH_URL

export default axios