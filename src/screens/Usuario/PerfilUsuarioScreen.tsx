import React, { useContext, useEffect, useState } from 'react';
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
    
    useEffect(() => {
        console.log('usuario desde context',user);
      return () => {
        
      };
    }, [])
    const {top} = useSafeAreaInsets();
    const [editState, setEditState] = useState({
        edit : false
    })
    
    /*DESDE REGISTER SCREEN */

    const {email, nombre, cedula_identidad, telefono, estado,  username,onChange} = useForm({
        email : user.email,
        nombre : `${user.primer_nombre} ${user.apellido_paterno}`,
        cedula : user.cedula_identidad,
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
                                onChangeText={ (value) => onChange(value, 'cedula_identidad')}
                                value = {cedula_identidad}  
                                onSubmitEditing={onEdit}
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
                                
                            />


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
