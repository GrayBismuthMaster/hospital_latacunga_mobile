import React, {createContext, useReducer, useEffect} from 'react'
import AsyncStorage  from '@react-native-async-storage/async-storage';

import HospitalLatacungaApi from '../api/HospitalLatacungaApi';
import { Usuario, LoginResponse, LoginData, RegisterData } from '../interfaces/appInterfaces'
import { authReducer, AuthState } from './authReducer';
type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status : 'checking' | 'authenticated' | 'not-authenticated'
    signUp : (registerData : RegisterData) => void
    signIn : (loginData: LoginData) => void
    logOut : ()=> void
    removeError : ()=> void
}

const authInitialState : AuthState = {
    status : 'checking',
    token : null,
    user : null,
    errorMessage : ''
}

export const AuthContext = createContext({} as AuthContextProps);
export const AuthProvider = ({children} : any)=>{

    const [state, dispatch] = useReducer(authReducer, authInitialState);
    useEffect(()=>{
        checkToken();
    },[])    
    //Verificar token 
    const checkToken = async() =>{
        const tokenVerificado = await AsyncStorage.getItem('token');
        console.log("token verificado")
        console.log(tokenVerificado)
        if(!tokenVerificado){
            return dispatch({type: 'notAuthenticated'})
        }
        const resp = await HospitalLatacungaApi.get('/auth/verify')
        console.log("respuesta de verificacione de token ", resp.data);
        
        dispatch({
            type: 'signUp',
            payload :{
                token: resp.data.token ,
                user : resp.data.user
            }
        })
        
    }


 
   const  signIn = async (obj : LoginData)=>{
        try{
            const {email, password} = obj
            const resp = await HospitalLatacungaApi.post('/auth/signin', {email, password})
            console.log(resp.data);
            const token = resp.data.token;
            const user = resp.data.datosUsuario;
            await AsyncStorage.setItem('token',token);
            dispatch({
                type: 'signUp',
                payload :{
                    token ,
                    user
                }
            })
        }catch(error:any){
            console.log(error);
            const errorMessage = error.message;
            dispatch({type : 'addError', payload: errorMessage || 'información incorrecta'})
        }
   }
   const  signUp = async ({nombre, cedula, fecha_nacimiento, sexo, estado_civil, religion, ocupacion, lugar_nacimiento, residencia, domicilio, telefono, estado, imagen, username, email, password} : RegisterData)=> {
        try{
            const resp = await HospitalLatacungaApi.post('/auth/signup', {nombre, cedula, fecha_nacimiento, sexo, estado_civil, religion, ocupacion, lugar_nacimiento, residencia, domicilio, telefono, estado, imagen, username, email, password})
            console.log(resp.data);
            const token = resp.data.token;
            const user = resp.data.datosUsuario;
            dispatch({
                type: 'signUp',
                payload :{
                    token ,
                    user
                }
            })

            await AsyncStorage.setItem('token',token);
        }catch(error:any){
            console.log(error);
            const errorMessage = error.message;
            dispatch({type : 'addError', payload: errorMessage || 'información incorrecta'})
        }
    }

    const logOut = async()=> {
        await AsyncStorage.removeItem('token');
        dispatch({type : 'logout'})
    };
    const removeError = ()=> {
        dispatch({type : 'removeError'});
    } 


    return (
        <AuthContext.Provider value = {{
            ...state,
             signUp,
             signIn,
             logOut, 
             removeError
        }}>
            {children}
        </AuthContext.Provider>
    )
}

