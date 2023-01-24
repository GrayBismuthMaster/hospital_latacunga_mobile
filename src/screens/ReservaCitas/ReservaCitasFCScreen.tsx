import {addDays, format} from 'date-fns';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, Button, Dimensions, Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Agenda} from 'react-native-calendars';
import { Consultorio, IdEspecialidadGenerar,IdProfesionalGenerar, ReservaCita } from '../../interfaces/appInterfaces';
import HospitalLatacungaApi from '../../api/HospitalLatacungaApi';
import EventCalendar from 'react-native-events-calendar'
import { Fab } from '../../components/Fab';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { loginStyles } from '../../theme/loginTheme';
import { AuthContext } from '../../context/AuthContext';
import { LoadingScreen } from '../Navigation/LoadingScreen';

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
  const [mode, setMode] = useState('datetime');
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState('Toque para escoger');
  // INIT TIME
  const [time, setTime] = useState(new Date());
  const [startTimeText, setStartTimeText] = useState('Toque para escoger');
  const [showStartTime, setShowStartTime] = useState(false)
  //END TIME
  const [endTime, setEndTime] = useState(new Date());
  const [endTimeText, setEndTimeText] = useState('Toque para escoger');
  const [showEndTime, setShowEndTime] = useState(false)
  
  //CONSULTORIO
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [consultorio, setConsultorio] = useState('');
  //ESPECIALIDADES
  const [especialidades, setEspecialidades] = useState<IdEspecialidadGenerar>([]);
  const [especialidad, setEspecialidad] = useState('')
  //PROFESIONALES
  const [profesionales, setProfesionales] = useState<IdProfesionalGenerar>([]);
  const [profesional, setProfesional] = useState('')

  const [imagenProfesional, setImagenProfesional] = useState('');

  //MOTIVO DE LA RESERVA
  const [motivoReserva, setMotivoReserva] = useState('');

  useEffect(() => {
    // run once

    const getData = async () => {
    //   const response = await fetch(
    //     'https://jsonplaceholder.typicode.com/posts',
    //   );
        const response = await HospitalLatacungaApi.get('/reservasCitas/');
        const data: ReservaCita[] = await response.data;
        // console.log('data desde reserva cita fc')
        // console.log(data);
        const mappedData = data.map((reserva, index) => {
            //const date = addDays(new Date(), index);
            // console.log('post desde map ----------')
            // console.log(reserva);
            return {
            ...reserva,
            date: format(new Date(reserva.fecha_hora_inicio_reserva), 'yyyy-MM-dd'),
            };
        });

        const reduced = mappedData.reduce(
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
                    summary : reserva.id_usuario_reserva_cita.primer_nombre
                })
                // setHoras({...horas, start : reserva.fecha_hora_inicio_reserva, end : reserva.fecha_hora_fin_reserva, title : reserva.motivo_reserva, summary : reserva.id_usuario.nombre})
            });
            console.log('las horas de aksad')
            console.log(horitas);
            setHoras(horitas);
        }
        mapHoras();

          const getConsultorios = async () =>{
          const response = await HospitalLatacungaApi.get('/consultorios/');
          const data: Consultorio[] = await response.data;
          console.log('data desde consultorios')
          console.log(data);
          // const mappedData = data.map((consultorio, index) => {
          //     //const date = addDays(new Date(), index);
          //     console.log('post desde map ----------')
          //     console.log(consultorio);
          //     return {
          //     ...consultorio,
          //     nombre: consultorio.nombre_consultorio,
          //     };
          // });

          // const reduced = mappedData.reduce(
          //     (acc: {[key: string]: Consultorio[]}, currentItem) => {
          //     const {nombre, ...coolItem} = currentItem;

          //     acc[nombre] = [coolItem];

          //     return acc;
          //     },
          //     {},
          // );

          console.log('consultorios desde ult')
          
          setConsultorios(data);
         

        }
        getConsultorios();

    };

    getData();
  }, []);

  const createReserva = () =>{
    console.log('crear reserva moodal')
    setIsVisible(true);
      
  }

  

  const renderItem = (item: ReservaCita) => {
      console.log('item desde render item')
        console.log(format(new Date(item.fecha_hora_inicio_reserva), 'yyyy-MM-dd'));
        setSelectedDay(format(new Date(item.fecha_hora_inicio_reserva), 'yyyy-MM-dd'));
      return (
      <View style={styles.itemContainer}>
        <Text>{item.motivo_reserva}</Text>
        <Text>Hora inicio de cita : {`${new Date(item.fecha_hora_inicio_reserva).getHours()}:${new Date(item.fecha_hora_inicio_reserva).getMinutes()}`}</Text>
        <Text>Hora final de cita : {`${new Date(item.fecha_hora_fin_reserva).getHours()}:${new Date(item.fecha_hora_fin_reserva).getMinutes()}`}</Text>
      </View>
    );
  };

  {/* DATE TIME PICKER*/}
  const onChangeDate = (event : any, selectedDate : any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let tempDate = format(new Date (currentDate), 'MM-dd-yyyy');
    //let fDate = tempDate.getDate() + "/" + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    //let fTime = 'Hours' + tempDate.getHours() + ' Minutes' + tempDate.getMinutes();
    setDateText(tempDate );
    //console.log(fDate + ' (' + fTime + ')');
  }
  
  const showMode = (currentMode : any) =>{
    setShow(true);
    setMode(currentMode);
  }

  {/* START TIME PICKER */}
  const onChangeStartTime = (event : any, selectedTime : any) => {
    //console.log(selectedTime)
    //JUEGO DE CEROS EN HORAS
    const horas = new Date(selectedTime).getUTCHours() <10 ? '0'+ new Date(selectedTime).getUTCHours() : new Date(selectedTime).getUTCHours();
    const minutos = new Date(selectedTime).getUTCMinutes() <10 ? '0'+ new Date(selectedTime).getUTCMinutes() : new Date(selectedTime).getUTCMinutes();
    const segundos = new Date(selectedTime).getUTCSeconds() <10 ? '0'+ new Date(selectedTime).getUTCSeconds() : new Date(selectedTime).getUTCSeconds();
    const fTime = horas + ':' + minutos + ':' + segundos;
    //JUEGO DE CEROS PARA AM O PM
    const ampm = new Date(selectedTime).getUTCHours() <12 ? 'AM' : 'PM';
    const fTimeAMPM = fTime + ' ' + ampm;
    const currentTime = selectedTime || time;
    console.log(fTimeAMPM);
    setShowStartTime(Platform.OS === 'ios');
    setStartTimeText(fTimeAMPM);
  
  }
  const showStartTimeMode = (currentMode : any) =>{
    setShowStartTime(true);
    setMode(currentMode);
  }

  {/* END TIME PICKER */}
  
  const onChangeEndTime = (event : any, selectedTime : any) => {
    //console.log(selectedTime)
    //JUEGO DE CEROS EN HORAS
    const horas = new Date(selectedTime).getUTCHours() <10 ? '0'+ new Date(selectedTime).getUTCHours() : new Date(selectedTime).getUTCHours();
    const minutos = new Date(selectedTime).getUTCMinutes() <10 ? '0'+ new Date(selectedTime).getUTCMinutes() : new Date(selectedTime).getUTCMinutes();
    const segundos = new Date(selectedTime).getUTCSeconds() <10 ? '0'+ new Date(selectedTime).getUTCSeconds() : new Date(selectedTime).getUTCSeconds();
    const fTime = horas + ':' + minutos + ':' + segundos;
    //JUEGO DE CEROS PARA AM O PM
    const ampm = new Date(selectedTime).getUTCHours() <12 ? 'AM' : 'PM';
    const fTimeAMPM = fTime + ' ' + ampm;
    const currentTime = selectedTime || endTime;
    console.log(fTimeAMPM);
    setShowEndTime(Platform.OS === 'ios');
    setEndTimeText(fTimeAMPM);
  
  }
  const showEndTimeMode = (currentMode : any) =>{
    setShowEndTime(true);
    setMode(currentMode);
  }


  const generarEspecialidades = (itemValue : any) =>{
    console.log(itemValue);
    console.log(JSON.parse(itemValue.especialidades));
    setConsultorio(itemValue.id_consultorio);
    setEspecialidades(JSON.parse(itemValue.especialidades));
    console.log('state consultorio')
    console.log(consultorio)
    console.log('state especialidades')
    console.log(especialidades)
  }

  const generarProfesionales = (itemValue : any) =>{
    console.log(itemValue);
    console.log(JSON.parse(itemValue.profesionales));
    setEspecialidad(itemValue.id_especialidad);
    setProfesionales(JSON.parse(itemValue.profesionales));
    console.log('state especialidad')
    console.log(especialidad)
    console.log('state profesionales')
    console.log(profesionales)
  }

  const generarImagenProfesional = (itemValue : any) =>{
    
     console.log(itemValue);
     setProfesional(itemValue.id_profesional);
     setImagenProfesional(itemValue.imagen_profesional);
     console.log('final')
    console.log(consultorio);
    console.log(especialidad);
    console.log(profesional);
  }

  const reservarCita = () =>{
    console.log('final')
    const anio = dateText.substring(6,10);
    const mes = dateText.substring(3,5);
    const dia = dateText.substring(0,2);
    
    const fecha = `${anio}-${mes}-${dia}`;

    const fechaStartTime = `${fecha}T${startTimeText.substring(0,startTimeText.length-3)}`;
    
    const horaStartTime = startTimeText.substring(0,2)
    console.log(horaStartTime)
  
    const minutosStartTime = startTimeText.substring(3,5)
    console.log(minutosStartTime)

    const segundosStartTime = startTimeText.substring(6,8)
    console.log(segundosStartTime)
    
    
    const fechaStartNew = new Date(parseInt(anio),parseInt(dia)-1, parseInt(mes),  parseInt(horaStartTime), parseInt(minutosStartTime), parseInt(segundosStartTime));
    
    const fechaEndTime = `${fecha}T${endTimeText.substring(0,endTimeText.length-3)}`;
    
    const horaEndTime = endTimeText.substring(0,2)
    console.log(horaStartTime)
  
    const minutosEndTime = endTimeText.substring(3,5)
    console.log(minutosEndTime)

    const segundosEndTime = endTimeText.substring(6,8)
    console.log(segundosEndTime)
    
    
    const fechaEndNew = new Date(parseInt(anio),parseInt(dia)-1, parseInt(mes),  parseInt(horaEndTime), parseInt(minutosEndTime), parseInt(segundosEndTime));
    
    console.log(motivoReserva)
    console.log(new Date(fechaStartTime))

    // var oldDateObj = new Date();
    // var newDateObj = new Date();
    // newDateObj.setTime(oldDateObj.getTime() + (30 * 60 * 1000));
    // console.log(newDateObj);
    
    console.log(fechaEndTime)
    console.log(user.id)
    console.log(consultorio);
    console.log(especialidad);
    console.log(profesional);
    //PETICION POST PARA RESERVAR CITA
    HospitalLatacungaApi.post('/reservasCitas',{
      motivo_reserva : motivoReserva,
      fecha_hora_inicio_reserva : fechaStartNew,
      fecha_hora_fin_reserva: fechaEndNew,               
      estado_reserva : 'PENDIENTE',                                                      
      id_usuario : user.id,                    
      id_profesional : profesional,                 
      id_especialidad : especialidad,                
      id_consultorio : consultorio    
    })
    .then(res => {
      console.log(res.data);
      if(res.data){
        Alert.alert('Reserva realizada con exito');
        
      }else{
        Alert.alert('Error al realizar la reserva');
      }
    })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style = {{flex: 3}}>
        <Agenda items={items} renderItem={renderItem} selectedDay={'2022-02-08'}/>
      </View>
      <View style ={{flex : 3}}>
        <EventCalendar
            onRef={calendarRef}
            eventTapped={(event:Hora) => {
                console.log(event);
            }}
            
            events={horas}
            width={width}
            />
      </View>
      <Fab position='right' title={"+"} onPress={createReserva}/>
      <Modal
            animationType='fade'
            visible={isVisible}
            transparent

        >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>  
                <ScrollView
                  contentContainerStyle = {{
                    
                    alignItems : "center",
                    justifyContent : "center",
                    width: Dimensions.get('window').width * 0.8, 
                    height: '92%', 
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginVertical : '10%',
                  }}
                >
                <TouchableOpacity
                  onPress={() => setIsVisible(false)}
                   
                >
                  <View style ={{
                    alignItems : 'flex-start'
                  }}>
                    <Icon
                        name = {'close'}
                        color='red'
                        size = {30} 
                    >

                    </Icon>  
                  </View>
                  
                </TouchableOpacity>  
                
                    <Text style={{fontSize: 25, marginBottom: 10, 
                        fontWeight: 'bold', color : 'black'}}>Crear Reserva</Text>
                        <TextInput
                            placeholder='Motivo de la reserva'
                            placeholderTextColor = 'rgba(0,0,0,0.8)'
                        
                            underlineColorAndroid="black"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS,
                                        {color: 'black', fontSize : 18}
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => setMotivoReserva(value)}
                            value = {motivoReserva}  
                            // onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    <Text style = {{
                        marginVertical: 4,
                        fontWeight: 'bold',
                        color:'black',
                        fontSize: 18,
                    }}>Fecha de la cita</Text>
                    <TouchableOpacity onPress={() => showMode('date')}>
                    <Text style = {{
                        marginTop: 10,
                        color:'blue',
                        fontSize: 15,
                    }}>{ dateText} </Text>
                    
                    </TouchableOpacity>
                    {/*HORA INICIAL DE LA CITA */}
                    <Text style = {{
                        marginVertical: 4,
                        fontWeight: 'bold',
                        color:'black',
                        fontSize: 18,
                    }}>Hora inicial de la cita</Text>
                    <TouchableOpacity onPress={() => showStartTimeMode('time')}>
                    <Text style = {{
                        marginTop: 10,
                        color:'blue',
                        fontSize: 15,
                    }}>{ startTimeText} </Text>
                    </TouchableOpacity>
                    
                    {/*HORA FINAL DE LA CITA */}
                    <Text style = {{
                        marginVertical: 4,
                        fontWeight: 'bold',
                        color:'black',
                        fontSize: 18,
                    }}>Hora final de la cita</Text>
                    <TouchableOpacity onPress={() => showEndTimeMode('time')}>
                    <Text style = {{
                        marginTop: 10,
                        color:'blue',
                        fontSize: 15,
                    }}>{ endTimeText} </Text>
                    </TouchableOpacity>

                    {show && (
                                <DateTimePicker
                                    timeZoneOffsetInMinutes={0}
                                    value={date}
                                    mode={mode}
                                    display="default"
                                    onChange={onChangeDate}
                                    dayOfWeekFormat='long'
                                />
                            )}
                    {showStartTime && (
                                <DateTimePicker
                                    timeZoneOffsetInMinutes={0}
                                    value={time}
                                    mode={mode}
                                    display="default"
                                    onChange={onChangeStartTime}
                                    dayOfWeekFormat='long'
                                />
                            )}
                    {showEndTime && (
                                <DateTimePicker
                                    timeZoneOffsetInMinutes={0}
                                    value={time}
                                    mode={mode}
                                    display="default"
                                    onChange={onChangeEndTime}
                                    dayOfWeekFormat='long'
                                />
                            )}
                            
                    {/*PICKER PARA EL CONSULTORIO */}
                    <Text style = {{
                        marginVertical: 4,
                        fontWeight: 'bold',
                        color:'black',
                        fontSize: 18,
                    }}>Consultorio</Text>                    
                    <Picker
                        selectedValue={consultorio}
                        style={{ height: 50, width: 190 }}
                        onValueChange={(itemValue, itemIndex) => generarEspecialidades(itemValue)}
                        
                    >
                        <Picker.Item label="Seleccione un consultorio" value="0" />
                        {
                           Object.values(consultorios).map(data => (
                               <Picker.Item label={`${data.direccion_consultorio}`} value={{id_consultorio : data._id, especialidades : JSON.stringify(data.id_especialidad)}} />
                      
                        ))
                        }
                    </Picker>
                    {
                      especialidades.length > 0 && (
                        <>  
                          <Text style = {{
                            marginVertical: 4,
                            fontWeight: 'bold',
                            color:'black',
                            fontSize: 18,
                          }}>Especialidad</Text>                    
                          <Picker
                              selectedValue={especialidad}
                              style={{ height: 50, width: 190 }}
                              onValueChange={(itemValue, itemIndex) => generarProfesionales(itemValue)}
                          >
                              <Picker.Item label="Seleccione una especialidad" value="0" />
                              {
                                Object.values(especialidades).map(data => (
                                    <Picker.Item label={`${data.nombre_especialidad}`} value={{id_especialidad : data._id, profesionales : JSON.stringify(data.id_profesional)}} />
                            
                              ))
                              }
                          </Picker>
                        </>
                        )
                    }
                    {
                       profesionales.length > 0 && (
                        <>  
                          <Text style = {{
                            marginVertical: 4,
                            fontWeight: 'bold',
                            color:'black',
                            fontSize: 18,
                          }}>Profesional</Text>                    
                          <Picker
                              selectedValue={profesional}
                              style={{ height: 50, width: 190 }}
                              onValueChange={(itemValue, itemIndex) => generarImagenProfesional(itemValue)}
                          >
                              <Picker.Item label="Seleccione una especialidad" value="0" />
                              {
                                Object.values(profesionales).map(data => (
                                    <Picker.Item label={`${data.nombre_profesional} - ${data.apellido_profesional}`} value={{id_profesional : data._id, imagen_profesional : data.imagen_profesional }} />
                            
                              ))
                              }
                          </Picker>
                        </>
                        )
                    }

                    {
                      profesional ? (
                        <>
                          <Image 
                            style = {{
                              width: 70,
                              height: 70,
                              marginTop: 5,
                              marginBottom: 15,
                              alignSelf: 'center',
                            }}
                            source = {{uri : imagenProfesional}}
                          />
                          <TouchableOpacity
                            onPress={reservarCita}
                          >
                            <Icon
                              name="book-online"
                              size={40}
                              color="green"
                              
                            />
                          </TouchableOpacity>
                        </>
                        
                        
                      )
                      :
                      (
                        <>
                        </>
                      )
                    }
                </ScrollView>
            </View>
        </Modal>
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
  },
});
