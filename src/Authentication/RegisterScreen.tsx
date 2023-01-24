import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, {useContext, useState} from 'react'
import { StyleSheet,SafeAreaView, View, Text,  ImageBackground, TouchableOpacity, Dimensions, TextInput, useWindowDimensions, Platform, KeyboardAvoidingView, Keyboard, Button, Image } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler'
import { ScreenStackProps } from 'react-native-screens'
import { Background } from '../components/Background'
import { Logo } from '../components/Logo'
import { AuthContext } from '../context/AuthContext'
import { useForm } from '../hooks/useForm'
import { RootStackParams } from '../Navigation/StackNavigator'
import { loginStyles } from '../theme/loginTheme'
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../theme/appTheme';
import { Axios } from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {RegisterData} from '../interfaces/appInterfaces';
import dermatologiaApi from '../api/HospitalLatacungaApi';
//import fs from 'react-native-fs';
import {RNS3} from 'react-native-aws3';

interface Props extends NativeStackScreenProps<RootStackParams,'LoginScreen'>{};

export const RegisterScreen = ({navigation} : Props) => {
    //CONTEXT
    const {signUp} = useContext(AuthContext);


    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState('Empty');
    //SEX PICKER 
    const [sex, setSex] = useState('');
    //IMAGE
    const [image, setImage]:any =useState();
    const [fullImageData , setFullImageData] : any = useState({});

    const onChangeDate = (event : any, selectedDate : any) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        let tempDate = new Date (currentDate);
        let fDate = tempDate.getDate() + "/" + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        //let fTime = 'Hours' + tempDate.getHours() + ' Minutes' + tempDate.getMinutes();
        setDateText(fDate );
        //console.log(fDate + ' (' + fTime + ')');
    }
    const showMode = (currentMode : any) =>{
        setShow(true);
        setMode(currentMode);
    }

    //Image
    
    const selectImage = () => {
        const options = {
            title : "Selecciona una imagen",
            storageOptions : {
                skipBackup : true,
                path : 'images'
            }
        }

        launchImageLibrary(options,response => {
            if(response.errorCode){
                console.log(response.errorMessage);
            } else if (response.didCancel){
                console.log('Selección de usuario cancelada');
            } else {
                const path = response.assets[0].uri;
                setImage(path);
                setFullImageData(response.assets[0]);
            }
        })
    }

    const takePicture = () =>{
        const options = {
            title : "Tomar una imagen",
            storageOptions : {
                skipBackup : true,
                path : 'images'
            },
            includeBase64: true
        }

        launchCamera(options, response =>{
            if(response.errorCode){
                console.log(response.errorMessage);
            } else if (response.didCancel){
                console.log('Selección de usuario cancelada');
            } else {
                const path = response.assets[0].uri;
                setImage(path);
                setFullImageData(response.assets[0]);
            }
        })

    }
    


    //USEFORM
    const {email, password, nombre, cedula, /*fecha_nacimiento,*/  estado_civil, religion, ocupacion, lugar_nacimiento, residencia, domicilio, telefono, estado,  username,onChange} = useForm({
        email : '',
        password : '',
        nombre : '',
        cedula : '',
        /*fecha_nacimiento : '2018/10/22',*/
        sexo : '',
        estado_civil: '',
        religion : '',
        ocupacion : '',
        lugar_nacimiento : '',
        residencia : '',
        domicilio : '',
        telefono : '',
        estado : '1',
        username : '',
    })

    const onRegister = async () =>  {
        /*
        try{
            const {data} = await dermatologiaApi.post('auth/signup', signUp)
            dispatch ({
                type: 'signUp',
                payload : {
                    token : data.token,
                    user: data.datosUsuario
                }
            })
        }catch(error){
            console.log(error)
        }
        */
                    console.log('Nombre arcuhiosd')
                    console.log(fullImageData);
                    /*
                    const FileUpload = {
                        file : {
                            name : fullImageData.fileName,
                            size: fullImageData.fileSize,  
                            type : fullImageData.type,
                            webkitRelativePath : fullImageData.uri, 
                        }
                    }
                    */
                   const file = {
                        uri : fullImageData.uri,
                        name : fullImageData.fileName,
                        type : fullImageData.type,
                   }
                   const config = {
                          keyPrefix: "mobile/",
                          bucket: 'dermatologiahg',
                          region: 'sa-east-1',
                          accessKey: 'AKIAQAUKBNLWM74VTENB',
                          secretKey: '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',
                          successActionStatus: 201
                   } 

                   RNS3.put(file, config)
                   .then(response => {
                       if (!response) return <div> Cargando .... </div>
                       console.log(response.body.postResponse)
                       console.log(response.body.postResponse.location)
                       const linkImagen = response.body.postResponse.location;
                       let booleanSex = false;
                       if(sex === '0'){
                            booleanSex = false
                       }else{
                           booleanSex = true
                       }
                       
                       signUp({
                            nombre,
                            cedula,
                            fecha_nacimiento : "1998/10/22",
                            sexo: booleanSex,
                            estado_civil, 
                            religion, 
                            ocupacion, 
                            lugar_nacimiento, 
                            residencia, 
                            domicilio, 
                            telefono, 
                            estado :'1',
                            imagen : linkImagen,
                            username,  
                            email,
                            password,
                        })
                    })
        /*

       console.log(nombre,cedula,sex,estado_civil, religion,  ocupacion,lugar_nacimiento,  residencia, domicilio, telefono,  image,   username,     email,  password);
        signUp({
            nombre,
            cedula,
            fecha_nacimiento : "1998/10/22",
            sexo: sex,
            estado_civil, 
            religion, 
            ocupacion, 
            lugar_nacimiento, 
            residencia, 
            domicilio, 
            telefono, 
            estado :'1',
            imagen : image,
            username,  
            email,
            password,
        })
        */
        Keyboard.dismiss();
    }
    

    return (
            <>
            {/*BACKGROUND */}
            
            <Background/>
            <KeyboardAvoidingView
                    style = {{flex: 1, backgroundColor:'#5856D6'}}
                    behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}
            >
            <ScrollView>
                
                    <View style = {loginStyles.formContainer}>
                        {/* Keyboard avoid view*/}
                        <Logo/>
                        <Text style={loginStyles.title}>Registro</Text>
                        
                        <Text style={loginStyles.label}>Nombres Completos</Text>
                        <TextInput
                            placeholder='Ingrese sus nombres'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                            
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'nombre')}
                            value = {nombre}  
                            onSubmitEditing={onRegister}
                            autoCorrect={false}
                        />
                        <Text style={loginStyles.label}>Cedula</Text>
                        <TextInput
                            placeholder='Ingrese su cédula'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                            
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'cedula')}
                            value = {cedula}  
                            onSubmitEditing={onRegister}
                            autoCorrect={false}
                        />
                        {/*FECHA NACIMIENTO */}
                            <Text style = {{
                                marginVertical: 10,
                                fontWeight: 'bold',
                                color:'white',
                                fontSize: 20,
                            }}>Fecha de Nacimiento</Text>
                            <Text style = {{
                                marginTop: 10,
                                fontWeight: 'bold',
                                color:'white',
                                fontSize: 20,
                            }}>{dateText}</Text>
                            <View style = {{
                                margin: 20
                            }}>
                                <Button
                                    title="Fecha de Nacimiento"
                                    onPress={() => showMode('date')}
                                />
                            </View>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    timeZoneOffsetInMinutes={0}
                                    value={date}
                                    mode={mode}
                                    display="default"
                                    onChange={onChangeDate}
                                    dayOfWeekFormat='long'
                                />
                            )}
                        {/*SEXO*/}
                        
                        <Text style={loginStyles.label}>Sexo</Text>
                        <Picker
                            selectedValue={sex}
                            onValueChange={(itemValue, itemIndex) =>
                                setSex(itemValue)
                            }
                            style={loginStyles.label}    
                        >
                            <Picker.Item label="Masculino" value="1" />
                            <Picker.Item label="Femenino" value="0" />
                        </Picker>

                        <Text style={loginStyles.label}>Estado civil</Text>
                        <TextInput
                            placeholder='Ingrese su estado civil'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                        
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'estado_civil')}
                            value = {estado_civil}  
                            onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <Text style={loginStyles.label}>Religión</Text>
                        <TextInput
                            placeholder='Ingrese su religión'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'

                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'religion')}
                            value = {religion}  
                            onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <Text style={loginStyles.label}>Ocupación</Text>
                        <TextInput
                            placeholder='Ingrese su ocupación'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                            
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'ocupacion')}
                            value = {ocupacion}  
                            onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <Text style={loginStyles.label}>Lugar Nacimiento</Text>
                        <TextInput
                            placeholder='Ingrese su lugar de nacimiento'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                            
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'lugar_nacimiento')}
                            value = {lugar_nacimiento}  
                            onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <Text style={loginStyles.label}>Residencia</Text>
                        <TextInput
                            placeholder='Ingrese su residencia'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
            
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'residencia')}
                            value = {residencia}  
                            onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <Text style={loginStyles.label}>Domicilio</Text>
                        <TextInput
                            placeholder='Ingrese su domicilio'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                    
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'domicilio')}
                            value = {domicilio}  
                            onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <Text style={loginStyles.label}>Telefono</Text>
                        <TextInput
                            placeholder='Ingrese su telefono'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                            
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'telefono')}
                            value = {telefono}  
                            onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        {/*ESTADO */}
                        {/* IMAGEN */ }
                        <Text style={[
                            loginStyles.label,
                            {marginBottom: 20}
                        ]}>Imagen</Text>
                        <Button
                            title='Seleccionar de galería'
                            onPress={selectImage}
                        />
                        <Text></Text>
                        <Button
                            title='Tomar foto'
                            onPress={takePicture}
                        />
                        <Image 
                            style={{
                                alignSelf: 'center',
                                width: 100,
                                height: 100,
                                marginVertical: 30
                            }}
                            source ={{uri : image}}
                            
                        >
                            
                        </Image>


                        <Text style={loginStyles.label}>Username</Text>
                        <TextInput
                            placeholder='Ingrese su nombre de Usuario'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                        
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'username')}
                            value = {username}  
                            onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <Text style={loginStyles.label}>Email</Text>
                        <TextInput
                            placeholder='Ingrese su email'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                            keyboardType='email-address'
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'email')}
                            value = {email}  
                            onSubmitEditing={onRegister}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <Text style={loginStyles.label}>Contraseña</Text>
                        <TextInput
                            placeholder='Ingrese su contraseña'
                            placeholderTextColor = 'rgba(255,255,255,0.4)'
                            
                            underlineColorAndroid="white"
                            style = {[
                                        loginStyles.inputField,
                                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                                    ]}
                            selectionColor='white'
                            onChangeText={ (value) => onChange(value, 'password')}
                            value = {password}     
                            secureTextEntry
                            onSubmitEditing={onRegister}  
                        />

                        {/*Button Login */}
                        <View 
                            style = {loginStyles.buttonContainer}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style = {loginStyles.button}
                                onPress = {onRegister}
                            >
                                <Text style = {loginStyles.buttonText}>Registrarse</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {loginStyles.newUserContainer}>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress ={()=>{navigation.replace('LoginScreen')}}
                                    >
                                        <Text style = {loginStyles.buttonText}>¿Ya tienes una cuenta?</Text>
                                    </TouchableOpacity>
                        </View>
                    </View>
                    
            </ScrollView>
            
            </KeyboardAvoidingView>
           
        
        </>
        )

}
