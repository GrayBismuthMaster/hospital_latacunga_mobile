//IMPORT DE LA LIBRERÍA 
import _ from 'lodash';
export interface ReservaCitaState { 
    reservaCita : ReservaCita | null
}

import { ReservaCita } from "../interfaces/appInterfaces";

type ReservaCitaAction =  
    | {type : 'addReservaCita', payload : Array<any>}
    | {type : 'updateReservaCita', payload : ReservaCita}
    | {type : 'deleteReservaCita', payload : string}
    

export const reservaCitaReducer = (state : any, action : any) : any => {
    switch (action.type) {
        case 'FETCH_RESERVAS_CITAS':
            return { 
                ...state, 
                reservaCita : {...state, ..._.mapKeys(action.payload, 'id')}
            }
        case 'FETCH_RESERVAS_CITAS_BY_USER_ID':
            return {
                ...state,
                reservaCita : { ..._.mapKeys(action.payload, 'id')}
            }

        case 'CREATE_RESERVA_CITA':
            return {
                ...state,
                reservaCita: { ...state, [action.payload.id] : action.payload}  
            }
        case 'EDIT_RESERVA_CITA': 
        return { ...state, [action.payload.id] : action.payload};
        case 'DELETE_RESERVA_CITA':
            return _.omit(state, action.payload);
        default:
            return state;
    }
}