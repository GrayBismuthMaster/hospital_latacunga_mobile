import _ from 'lodash';
import React, {createContext, useReducer, useEffect} from 'react'
import { View } from 'react-native'
import HospitalLatacungaApi from '../api/HospitalLatacungaApi';
import { ReservaCita } from '../interfaces/appInterfaces';
import { reservaCitaReducer, ReservaCitaState } from './reservaCitaReducer';

type ReservaCitaContextProps = {
    fetchReservasCitas : ()=>any;
    fetchReservasCitasByUserId : (arg0: string)=>any;
    reservaCita: ReservaCita | null;
    createReservaCita : (datosReserva : ReservaCita) => void;
    editReservaCita : (id_reserva : string, datosReserva : ReservaCita)=>void;
    deleteReservaCita : (id_reserva : string)=>void;
}

const reservaCitaInitialState : ReservaCitaState = {
    reservaCita : null,
}

export const ReservaCitaContext = createContext({} as ReservaCitaContextProps);

export const ReservaCitaProvider = ({children}:any) => {
    const [state, dispatch] = useReducer(reservaCitaReducer, reservaCitaInitialState);
    useEffect(() => {
        // fetchReservasCitas();
      return () => {
        
      };
    }, [])
    const fetchReservasCitas = async () => {
            const response = await HospitalLatacungaApi.get('/reservasCitas');
            console.log('respuesta', response.data)
           dispatch({type: 'FETCH_RESERVAS_CITAS', payload: response.data});
           console.log('estado',state);
    };
    const fetchReservasCitasByUserId =async (id : any) => {
        const response = await HospitalLatacungaApi.get(`/reservasCitas/user/${id}`);
        dispatch({type: 'FETCH_RESERVAS_CITAS_BY_USER_ID', payload: response.data});
    };
    
    
    //Damos un memorize para que al momento de hacer la petición no se repita
    const fetchReservaCitaById = function(reservaCita:any) {
        return _.memoize(async function (dispatch) {
            if(!reservaCita){
                return null;
            }
            const response = await HospitalLatacungaApi.get(`/reservasCitas/reservaCita/${reservaCita._id}`);
            dispatch({type: 'FETCH_RESERVA_CITA_BY_ID', payload: response.data});
        }) 
    };
    
    const createReservaCita = async (formValues:any) =>{
        await HospitalLatacungaApi.post('/reservasCitas', formValues)
                .then((res:any) => {
                    console.log('res de crear reserva cita', res.data.datosReservaCitaCreado);
                    dispatch({type: 'CREATE_RESERVA_CITA', payload: res.data.datosReservaCitaCreado});
    
                })
    };
    
    const editReservaCita = (userId :any, formValues : any) => async (dispatch:any) => {
        console.log('id',userId);
        console.log('valores desde el action', formValues)
        HospitalLatacungaApi.put(`/reservasCitas/${userId}`, formValues)
            .then((res: any) => {
                console.log("datos nuevos", res.data)
                dispatch({type: 'EDIT_RESERVA_CITA', payload: res.data});
    
            })
    }
    const deleteReservaCita = (userId :any) => async (dispatch:any) => {
        console.log('id',userId);
        // console.log('valores desde el action', formValues)
        await HospitalLatacungaApi.delete(`/reservasCitas/${userId}`);
        dispatch({type : 'DELETE_RESERVA_CITA', payload : userId});
        
    }
    return (
        <ReservaCitaContext.Provider value = {{
            ...state,
            fetchReservasCitas,
            fetchReservasCitasByUserId,
            fetchReservaCitaById,
            createReservaCita,
            editReservaCita,
            deleteReservaCita
        }}>
            {children}
        </ReservaCitaContext.Provider>
    )

}
