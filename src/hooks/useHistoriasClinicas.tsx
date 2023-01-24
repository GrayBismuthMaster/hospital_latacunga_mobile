import { useEffect, useState } from "react";
import HospitalLatacungaApi from "../api/HospitalLatacungaApi";
import { HistoriaClinica} from "../interfaces/appInterfaces";

export const useHistoriasClinicas = ({_id}:any) => {
    const [isLoading, setIsLoading] = useState(true);
    const [historiasClinicas, setHistoriasClinicas ] = useState<HistoriaClinica>();
    const getHistoriasClinicas = async () =>{
        const historiasClinicasByUserId= await HospitalLatacungaApi.get<HistoriaClinica>(`/historiasClinicas/user/${_id}`);
        const historiasClinicas = historiasClinicasByUserId.data;
        setHistoriasClinicas(historiasClinicas);
        setIsLoading(false);
    }
    useEffect(() => {
        getHistoriasClinicas();
    }, [])
  return (
        {
            historiasClinicas,
            isLoading
        }
    )
};
