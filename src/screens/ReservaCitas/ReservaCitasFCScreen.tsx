import {addDays, format} from 'date-fns';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, Button, Dimensions, Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Agenda} from 'react-native-calendars';
import { Consultorio, IdEspecialidadGenerar,IdProfesionalGenerar, ReservaCita } from '../../interfaces/appInterfaces';
import HospitalLatacungaApi from '../../api/HospitalLatacungaApi';
import EventCalendar from 'react-native-events-calendar'
import { Fab } from '../../components/Fab';
import { AuthContext } from '../../context/AuthContext';
import { LoadingScreen } from '../Navigation/LoadingScreen';
import { CreateReservaCitas } from './CreateReservaCitas';
import { ReservaCitaContext } from '../../context/ReservaCitaContext';

let { width } = Dimensions.get('window')

type Hora = {
    start : string,
    end : string,
    title : string,
    summary: string
}

export const ReservaCitasFCScreen: React.FC = () => {
    //create ref to store the current visible date
    const calendarRef = useRef(null);
    useRef(new Date());
  const [items, setItems] = useState<{[key: string]: ReservaCita[]}>({});
  const [horas, setHoras] = useState<Hora[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('2022-02-09');
  const [isVisible, setIsVisible] = useState(false);
  //Get user id with useReducer
    
    //Context para la foto de perfil 
    const {user, token, logOut} = useContext(AuthContext)
    if(!user){
        return <LoadingScreen/>
    }
    


  //DATE
  
  const [date, setDate] = useState(new Date());
  

  //MOTIVO DE LA RESERVA
  const [motivoReserva, setMotivoReserva] = useState('');

  //CONTEXT
  
    //Context para la foto de perfil 
    const {fetchReservasCitasByUserId, reservaCita} = useContext(ReservaCitaContext)
    
    const [reservasCitas , setReservasCitas] = useState([]);
  
  const createReserva = () =>{
    setIsVisible(true);
  }

  useEffect(() => {
    console.log(user.id);
    getData();
    console.log('estado',reservaCita);
    return ()=>{

    }
  }, []);
  useEffect(()=>{
    console.log('se refresca por reserva global')
    
    getData();
    return ()=>{

    }
  },[reservaCita!==null ? Object.values(reservaCita).length : null])
  useEffect(()=>{
    console.log('refresh por reserva')
    
    console.log('estado',reservaCita);
    // console.log('reservas en estado local', reservasCitas)
    async function setData (){
      // const response = await HospitalLatacungaApi.get('/reservasCitas/');
        const data: ReservaCita[] = Object.values(reservaCita);
        console.log('data desde reserva cita fc')
        console.log(data);
        const mappedData =await data.map((reserva, index) => {
            return {
            ...reserva,
            date: format(new Date(reserva.fecha_hora_inicio_reserva), 'yyyy-MM-dd'),
            };
        });

        const reduced = await mappedData.reduce(
            (acc: {[key: string]: ReservaCita[]}, currentItem) => {
            const {date, ...coolItem} = currentItem;

            acc[date] = [coolItem];

            return acc;
            },
            {},
        );

        setItems(reduced);
        
        const mapHoras = () =>{
            //const horas: {[key: string]: ReservaCita[]} = {};
            const horitas = data.map((reserva, index) => {
                return ({
                    start :new Date(reserva.fecha_hora_inicio_reserva).toUTCString(),
                    end : new Date(reserva.fecha_hora_fin_reserva).toUTCString(),
                    title : reserva.motivo_reserva,
                    summary : reserva.usuario_reserva_cita.primer_nombre
                })
                // setHoras({...horas, start : reserva.fecha_hora_inicio_reserva, end : reserva.fecha_hora_fin_reserva, title : reserva.motivo_reserva, summary : reserva.id_usuario.nombre})
            });
            console.log('las horas de aksad')
            console.log(horitas);
            setHoras(horitas);
        }
        mapHoras();
    }
    setData(reservaCita)
    return ()=>{

    }
  },[reservasCitas])

  const getData = async () => {
    await fetchReservasCitasByUserId(user.id);
    setReservasCitas(reservaCita);
    
  };

  const renderItem = (item: ReservaCita) => {
      console.log('item desde render item')
        console.log(format(new Date(item.fecha_hora_inicio_reserva), 'yyyy-MM-dd'));
        setSelectedDay(format(new Date(item.fecha_hora_inicio_reserva), 'yyyy-MM-dd'));
      return (
      <View style={styles.itemContainer}>
        <Text 
          style={{
            color : 'rgba(0,0,0,0.8)'
          }}
        >{item.motivo_reserva}</Text>
        <Text
          style={{
            color : 'rgba(0,0,0,0.8)'
          }}
        >Hora inicio de cita : {`${new Date(item.fecha_hora_inicio_reserva).getHours()}:${new Date(item.fecha_hora_inicio_reserva).getMinutes()}`}</Text>
        <Text
          style={{
            color : 'rgba(0,0,0,0.8)'
          }}
        >Hora final de cita : {`${new Date(item.fecha_hora_fin_reserva).getHours()}:${new Date(item.fecha_hora_fin_reserva).getMinutes()}`}</Text>
      </View>
    );
  };


  

  return (
    <SafeAreaView style={styles.safe}>
      <View style = {{flex: 3}}>
        <Agenda items={items } renderItem={renderItem} selectedDay={'2022-02-08'} onDayPress={(day)=>console.log('selecciondo',day )}/>
      </View>
      <View style ={{
        flex : 3,
      }}>
        <EventCalendar
            onRef={calendarRef}
            eventTapped={(event:Hora) => {
                console.log('evento',event);
            }}
            style={{
              color : 'black'
            }}
            events={horas}
            width={width}
            
            />
      </View>

        <CreateReservaCitas
          isVisible={isVisible}
          setIsVisible = {setIsVisible}
        />
        
      <Fab position='right' title={"+"} onPress={createReserva}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    color : 'black'
  },
});
