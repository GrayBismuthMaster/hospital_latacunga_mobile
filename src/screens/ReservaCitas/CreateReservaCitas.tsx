import React, { useState, useEffect, useContext} from 'react'
import {View, Text, Modal, ScrollView, Dimensions, TouchableOpacity, TextInput, Platform, StyleSheet,Image, Button} from 'react-native'
import HospitalLatacungaApi from '../../api/HospitalLatacungaApi';
import { Consultorio, Especialidad, EstadoReserva, Profesional } from '../../interfaces/appInterfaces';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { loginStyles } from '../../theme/loginTheme';
import { Picker } from '@react-native-picker/picker';
import { formatearFecha } from '../../utils/formatearFecha';
import {DateTimePickerComponent} from '../../components/DateTimePicker';
import { AuthContext } from '../../context/AuthContext';
import { LoadingScreen } from '../Navigation/LoadingScreen';

interface Props {
  isVisible : boolean;
  setIsVisible : (arg0:boolean)=>boolean
}

export const CreateReservaCitas = ({isVisible, setIsVisible}: Props) => {

  //Context para la foto de perfil 
  const {user} = useContext(AuthContext)
  if(!user){
      return <LoadingScreen/>
  }

  //MOTIVO RESERVA
  const [motivoReserva , setMotivoReserva] = useState("");
  //DROPDOWN RESERVA CITAS 
  const [selectedConsultorio, setSelectedConsultorio] = useState();
  const [selectedEspecialidad, setSelectedEspecialidad] = useState();
  const [selectedProfesional, setSelectedProfesional] = useState();
  
  const [consultorios, setConsultorios] = useState<any>([]);
  const [filterState, setFilterState] = useState({
      especialidades : [],
      profesionales : []
  });

  const generarEspecialidades = async (id_consultorio:any) => {
    console.log('desde generar especialidades', id_consultorio)
      await HospitalLatacungaApi.get(`consultorios/${id_consultorio}/especialidades`)
      .then((data:any)=>{
        console.log('datos obtenidos',data.data);
        setFilterState({...filterState, especialidades :data.data });
      
      })
      .catch((error)=>{
        console.log(error);
      });

      await setSelectedConsultorio(id_consultorio);
  }

    const generarProfesionales = async (id_especialidad:any) =>{
      console.log('desde generar profesionales', id_especialidad)
      await HospitalLatacungaApi.get(`especialidades/${id_especialidad}/profesionales`)
      .then((data:any)=>{
        console.log('datos obtenidos',data.data);
        setFilterState({...filterState, profesionales :data.data });
      
      })
      .catch((error)=>{
        console.log(error);
      });

      await setSelectedEspecialidad(id_especialidad);
    }
  //FIN DROPDOWN RESERVA CITAS

  const [imagenProfesional, setImagenProfesional] = useState('');

  
  const [date, setDate] = useState(new Date());
  const [initialTime, setInitialTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    
    const getConsultorios = async () =>{
      const response = await HospitalLatacungaApi.get('/consultorios/');
      const data: Consultorio[] = await response.data;
      setConsultorios(data);
      console.log('data desde consultorios')
      console.log(data);
      console.log('consultorios desde ult')
    }
    getConsultorios();
    return () => {
      
    };

  }, [])
    
  const submitReservaCita = ()=>{
    let id_profesional = JSON.parse(selectedProfesional);
    // console.log(`${initialTime.toLocaleString()} - ${date.setTime(initialTime)}`)
    // console.log('motivo reserva : ',motivoReserva,'fecha inicio reserva', initialTime, 'fecha hora fin reserva', endTime, 'estado reserva', EstadoReserva.PENDIENTE, 'id usuario reserva', user.id , 'id_especialidad reserva cita', selectedEspecialidad, 'id consultorio', selectedConsultorio, 'id profesional', id_profesional.id)
    HospitalLatacungaApi.post('/reservasCitas',{
      motivo_reserva : motivoReserva,
      fecha_hora_inicio_reserva : initialTime,
      fecha_hora_fin_reserva : endTime,
      estado_reserva : EstadoReserva.PENDIENTE,
      id_usuario_reserva_cita : user.id,
      id_especialidad_reserva_cita : selectedEspecialidad,
      id_profesional_reserva_cita : id_profesional.id,
      id_consultorio_reserva_cita : selectedConsultorio
    })
    .then((reservaCita)=>{
      console.log(reservaCita.data);
      
    })
  }
  
  return (
        <Modal
            animationType='fade'
            visible={isVisible}
            transparent

        >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical : '4%' }}>  
                <ScrollView
                  contentContainerStyle = {{
                    flexGrow : 1,
                    alignItems : "center",
                    justifyContent : "center",
                    width: Dimensions.get('window').width * 0.8, 
                    // height: '92%', 
                    backgroundColor: 'white',
                    borderRadius: 10,
                    // marginVertical : '3%',
                    paddingVertical : '10%'
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
                    />
                  </View>
                  
                </TouchableOpacity>  
                
                    <Text 
                      style={{
                        fontSize: 25, 
                        marginBottom: 10, 
                        fontWeight: 'bold', 
                        color : 'black'
                      }}>
                        Crear Reserva
                    </Text>
                    
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

                    <DateTimePickerComponent
                      title='Fecha de reserva de cita'
                      dateTime={date}
                      setDateTime = {setDate}
                      modeParent = {'date'}
                    />
                    <DateTimePickerComponent
                      title='Hora de inicio de cita'
                      dateTime={initialTime}
                      setDateTime = {setInitialTime}
                      modeParent = {'time'}
                    />
                    <DateTimePickerComponent
                      title='Hora final de cita'
                      dateTime={endTime}
                      setDateTime = {setEndTime}
                      modeParent = {'time'}
                    />
                    {/* CONSULTORIOS  */}
                      <Text style = {styles.title}>Consultorio</Text>                    
                      <Picker
                          selectedValue={selectedConsultorio}
                          style={styles.picker}
                          onValueChange={(itemValue, itemIndex) => generarEspecialidades(itemValue)}
                          
                      >
                          <Picker.Item label="Seleccione un consultorio" value="0" />
                          {
                            Object.values(consultorios).map((data:any) => (
                                <Picker.Item label={`${data.nombre_consultorio}`} value={data.id} />
                        
                          ))
                          }
                      </Picker>       
                    {/* FIN CONSULTORIOS  */}
                    {/* ESPECIALIDADES  */}
                    {
                      filterState.especialidades.length > 0
                        ?
                      <>
                        <Text style = {styles.title}>Especialidad</Text>                    
                        <Picker
                            selectedValue={selectedEspecialidad}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => generarProfesionales(itemValue)}
                            
                        >
                            <Picker.Item label="Seleccione una especialidad" value="0" />
                            {
                              Object.values(filterState.especialidades).map((data:Especialidad) => (
                                  <Picker.Item label={`${data.nombre_especialidad}`} value={data.id} />
                            ))
                            }
                        </Picker>
                      </>
                        :
                      <></>
                       
                    }
                    {/* FIN ESPECIALIDADES  */}
                    {/* PROFESIONALES  */}
                      {
                        filterState.profesionales.length > 0
                          ?
                        <>
                          <Text style = {styles.title}>Profesional</Text>                    
                          <Picker
                              selectedValue={selectedProfesional}
                              style={styles.picker}
                              onValueChange={(itemValue, itemIndex) =>{
                                let valorItemParseado = JSON.parse(itemValue);
                                
                                console.log("Valor del item",valorItemParseado.id);
                                setSelectedProfesional(itemValue);
                                setImagenProfesional(valorItemParseado.imagenProfesional);
                                console.log('valor de imagen', imagenProfesional)
                              }}
                              
                          >
                              <Picker.Item label="Seleccione un profesional" value="0" />
                              {
                                Object.values(filterState.profesionales).map((data:Profesional) => (
                                    <Picker.Item label={`${data.nombre_profesional} ${data.apellido_profesional}`} value={JSON.stringify({id : data.id, imagenProfesional : data.imagen_profesional})} />
                              ))
                              }
                          </Picker>
                        </>
                          :
                        <></>
                      }
                      {
                        imagenProfesional
                          ?
                          <>
                          <View
                            style={{
                              width : Dimensions.get('screen').width*0.4,
                              height : Dimensions.get('screen').height*0.2,

                            }}
                          >
                            <Image
                              style={{
                                flex : 1,
                                width :undefined,
                                height : undefined,
                                resizeMode : 'contain'
                              }}
                              source={{uri : imagenProfesional}}
                            />  
                          </View>
                          <Button
                            title='Reservar Cita'
                            onPress={submitReservaCita}
                          />
                          </>
                        
                          :
                        <>
                        </>
                      }
                    {/* FIN PROFESIONALES */}
                </ScrollView>
            </View>
        </Modal>
  )
}

const styles = StyleSheet.create(
  {
    picker : {
        height: 50, 
        width: 190, 
        backgroundColor : 'rgba(0,0,0,0.7)' 
    },
    title : {
      marginVertical: 4,
      fontWeight: 'bold',
      color:'black',
      fontSize: 18,
    }
  }
)