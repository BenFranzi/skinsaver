import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const SPA_URL = 'http://skinsaver.benfranzi.com';

export const URL = 'https://skinsaver-cap-api.herokuapp.com/api/v1';


const instance = axios.create({
    baseURL: URL
});

instance.interceptors.request.use(
    async config => {

        const token = await SecureStore.getItemAsync('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

export default instance;
