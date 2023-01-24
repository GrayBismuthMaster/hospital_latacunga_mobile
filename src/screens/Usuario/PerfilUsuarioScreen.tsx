import React, { useContext, useState } from 'react';
import { Alert, Button, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomSwitch } from '../../components/CustomSwitch';
import { styles } from '../../theme/appTheme';
import { CustomAlert } from '../../components/CustomAlert';
import { useForm } from '../../hooks/useForm';
import { FotoPerfil } from '../../components/FotoPerfil';
import { AuthContext } from '../../context/AuthContext';
import { loginStyles } from '../../theme/loginTheme';
import DateTimePicker from '@react-native-community/datetimepicker';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import {RNS3} from 'react-native-aws3';
import { Picker } from '@react-native-picker/picker';
import { LoadingScreen } from '../Navigation/LoadingScreen';
import { GradientBackground } from '../../components/GradientBackground';
import dermatologiaApi from '../../api/HospitalLatacungaApi';

export const PerfilUsuario = () => {


    //Context para la foto de perfil 
    const {user, token, logOut} = useContext(AuthContext)
    if(!user){
        return <LoadingScreen/>
    }
    

    const {top} = useSafeAreaInsets();
    const [editState, setEditState] = useState({
        edit : false
    })
    
    /*DESDE REGISTER SCREEN */

    const {email, nombre, cedula, /*fecha_nacimiento,*/  estado_civil, religion, ocupacion, lugar_nacimiento, residencia, domicilio, telefono, estado,  username,onChange} = useForm({
        email : user.email,
        nombre : user.nombre,
        cedula : user.cedula,
        /*fecha_nacimiento : '2018/10/22',*/
        estado_civil: user.estado_civil,
        religion : user.religion,
        ocupacion : user.ocupacion,
        lugar_nacimiento : user.lugar_nacimiento,
        residencia : user.residencia,
        domicilio : user.domicilio,
        telefono : user.telefono,
        estado : '1',
        username : user.username,
    })
    
    //IMAGE
    const [image, setImage]:any =useState();
    const [fullImageData , setFullImageData] : any = useState({});

    //Image
    
    const selectImage = () => {
        const options = {
            title : "Selecciona una imagen",
            storageOptions : {
                skipBackup : true,
                path : 'images',
               // mediaType : 'photo'
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
            includeBase64: true,
            
        }

        launchCamera( options, response =>{
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

    const onEdit = async () =>  {
        if(!image){
            dermatologiaApi.put('usuarios/' + user?._id, {
                nombre,
                cedula,
                estado_civil, 
                religion, 
                ocupacion, 
                lugar_nacimiento, 
                residencia, 
                domicilio, 
                telefono, 
                imagen : user.imagen,
                username,  
                email,
            })
            .then(()=>{
                console.log('entra a dar una buena res je je')
                Alert.alert('Perfil actualizado', 'Se ah actualizado tu perfil con exito', [{text : 'OK'}] )
                    
            })
        } else{
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
            .then((response:any) => {
                if (!response) return <div> Cargando .... </div>
                console.log(response.body.postResponse)
                console.log(response.body.postResponse.location)
                const linkImagen = response.body.postResponse.location;
            
                dermatologiaApi.put('usuarios/' + user?._id, {
                    nombre,
                    cedula,
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
                })
                .then(()=>{
                        console.log('entra a dar una buena res je je')
                        return(
                        
                            <CustomAlert
                                alertTitle = "Alerta buena je je"
                                message = "Esta es una alerta"
                                buttons = {[
                                    {
                                        text: 'Cancelar',
                                        onPress: () => console.log('Cancel Pressed'),
                                    
                                    },
                                    { text: 'OK', onPress: onEdit }
                                ]}
                                buttonText = "Aceptare"
                            />
                        )
                    }
                )
                
                
            })  
        }
       
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

    
    /*
        PRINCIPIOS USEFORM
        const [inputState, setInputState] = useState({
            name : '',
            email : '',
            phone : '',
        })
    */
    const onSwitchChange= (value : boolean, field : string) => {
        setEditState({
            ...editState, 
            [field]: value
        })
    }
    return( 
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView>
                    <View style = {{
                        ...styles.globalMargin,
                        top : top+10,
                    }}>
                        <Text style = {{
                            ...styles.title,
                            color : '#fff',
                            }}>Perfil de Usuario</Text>
                        <View style = {{
                            justifyContent : 'center',
                            alignItems : 'center',
                        }}>
                            <Text style = {{marginTop: 10 ,color: 'white', fontSize : 20}}>Editar</Text>
                            <CustomSwitch isOn={false} onChange={(value) => onSwitchChange(value, 'edit')}/>
                        </View>
                        <View style = {loginStyles.formContainer}>
                            {/* Keyboard avoid view*/}
                            <FotoPerfil foto = {user?.imagen}/>
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
                                onSubmitEditing={onEdit}
                                autoCorrect={false}
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
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
                                onSubmitEditing={onEdit}
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
                            />

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
                                onSubmitEditing={onEdit}
                                autoCapitalize='none'
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
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
                                onSubmitEditing={onEdit}
                                autoCapitalize='none'
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
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
                                onSubmitEditing={onEdit}
                                autoCapitalize='none'
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
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
                                onSubmitEditing={onEdit}
                                autoCapitalize='none'
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
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
                                onSubmitEditing={onEdit}
                                autoCapitalize='none'
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
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
                                onSubmitEditing={onEdit}
                                autoCapitalize='none'
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
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
                                onSubmitEditing={onEdit}
                                autoCapitalize='none'
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
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
                                source ={{uri: image ? image : user.imagen}}
                                
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
                                onSubmitEditing={onEdit}
                                autoCapitalize='none'
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
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
                                onSubmitEditing={onEdit}
                                autoCapitalize='none'
                                autoCorrect={false}
                                
                                selectTextOnFocus = {editState.edit}
                                editable = {editState.edit}
                            />

                            {
                                editState.edit
                                
                                    ? 
                                
                                <CustomAlert
                                    alertTitle = "Alerta"
                                    message = "Esta es una alerta"
                                    buttons = {[
                                        {
                                            text: 'Cancelar',
                                            onPress: () => console.log('Cancel Pressed'),
                                        
                                        },
                                        { text: 'OK', onPress: onEdit }
                                    ]}
                                    buttonText = "Aceptare"
                                />
                                    :
                                    null
                            }  
                            {/* 
                                <View style = {loginStyles.newUserContainer}>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            onPress ={()=>{navigation.replace('LoginScreen')}}
                                        >
                                            <Text style = {loginStyles.buttonText}>¿Ya tienes una cuenta?</Text>
                                        </TouchableOpacity>
                                </View> 
                            */}
                        </View>
                        {/* 
                        <TextInput 
                            style = {styles.inputStyle}
                            placeholder='nombre'
                        />
                        <TextInput 
                            style = {styles.inputStyle}
                        />
                        <TextInput 
                            style = {styles.inputStyle}
                        />
                        <TextInput 
                            style = {styles.inputStyle}
                        />
                        <TextInput 
                            style = {styles.inputStyle}
                        /> */}
                         
                    </View >
                </ScrollView>
                
            </KeyboardAvoidingView>
        </GradientBackground>
        );
};
