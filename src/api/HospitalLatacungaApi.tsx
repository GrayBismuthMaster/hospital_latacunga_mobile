import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
// const baseURL = 'http://50.19.61.249:5002/api'
const baseURL = 'https://server.cmedcita.com/api';

const HospitalLatacungaApi = axios.create({baseURL});
//Middleware para interceptar las solicitudes
HospitalLatacungaApi.interceptors.request.use(
    async(config:any) => {
        const token = await AsyncStorage.getItem('token');
        if(token){
            config.headers['x-access-token']  = token;
        }
        return config;
    }
)

export default HospitalLatacungaApi;