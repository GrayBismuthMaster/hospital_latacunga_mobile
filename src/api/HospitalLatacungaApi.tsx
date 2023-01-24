import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
// const baseURL = 'http://3.12.17.53:5001/api'
const baseURL = 'http://192.168.100.34:5001/api';

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