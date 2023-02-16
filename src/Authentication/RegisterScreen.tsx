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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Formik } from 'formik';
import {UsuariosData} from '../data/UsuariosData';
import { FieldFormik } from '../components/FormikFields/FieldFormik';
import { formatTitle } from '../utils';
import HospitalLatacungaApi from '../api/HospitalLatacungaApi';
import { useS3Upload } from '../hooks/useS3Upload';
interface Props extends NativeStackScreenProps<RootStackParams,'LoginScreen'>{};

export const RegisterScreen = ({navigation} : Props) => {
    
    //CUSTOM HOOK PARA S3 UPLOAD
    const { s3State, setS3State, formatFilename, uploadToS3, getBlob} = useS3Upload();
    //FIN CUSTOM HOOK

    //CONTEXT
    const {signUp} = useContext(AuthContext);


    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState('Empty');
    //SEX PICKER 
    const [sex, setSex] = useState('M');
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

        launchImageLibrary((options as any),response => {
            if(response.errorCode){
                console.log(response.errorMessage);
            } else if (response.didCancel){
                console.log('Selección de usuario cancelada');
            } else {
                const path = (response as any).assets[0].uri;
                console.log('respuesta desde foto',response.assets);
                setImage(path);
                setFullImageData((response as any).assets[0]);
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

        launchCamera((options as any), response =>{
            if(response.errorCode){
                console.log(response.errorMessage);
            } else if (response.didCancel){
                console.log('Selección de usuario cancelada');
            } else {
                const path = (response as any).assets[0].uri;
                setImage(path);
                setFullImageData((response as any).assets[0]);
                    
                // setFileName(e.target.files[0].name);
                // setS3State({...s3State, file : e.target.files[0], name : e.target.files[0].name});
                // formikProps.form.setFieldValue('imagen', e.target.files[0])
            }
        })

    }
    

    return (
            <>
            {/*BACKGROUND */}
            <Formik
                initialValues={
                    {
                        primer_nombre : '',
                        segundo_nombre : '',
                        apellido_paterno : '',
                        apellido_materno : '',
                        cedula_identidad : '',
                        email : '',
                        username : '',
                        password : '',
                        telefono : ''
                    }
                }
                onSubmit = {(values, {resetForm} )=>{
                    //IMAGE URI, VALUES TEXT, 
                    console.log('valores del form',values);
                    console.log('datos imagen', fullImageData);
                    console.log('sexo', sex);
                    console.log('fecha_nacimeinto', date);

                    const {
                        primer_nombre,
                        segundo_nombre,
                        apellido_paterno,
                        apellido_materno,
                        cedula_identidad,
                        email,
                        username,
                        password,
                        telefono
                    } = values;
                    
                    HospitalLatacungaApi.post('/uploads/signS3',{
                        fileName :formatFilename(fullImageData.fileName),
                        fileType : fullImageData.type
                    }).then(async (res)=>{
                        console.log("respues",res);
                        const { signedRequest, url } = res.data;
                        // const body = await getBlob(fullImageData.uri);
                        const resUpload = await uploadToS3(fullImageData.uri, signedRequest);
                        console.log("RESPUESTA DE S3", resUpload, "URL", url);
                            
                            
                            await signUp({
                                primer_nombre,
                                segundo_nombre,
                                apellido_paterno,
                                apellido_materno,
                                cedula_identidad,
                                email,
                                username,
                                password,
                                telefono,
                                imagen : url, 
                                sexo  : sex, 
                                fecha_nacimiento : date,
                                estado : true,
                                id_rol : '2'
                            });
                            await navigation.navigate('LoginScreen');
                            Keyboard.dismiss();
                    })
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <KeyboardAvoidingView
                        style = {{flex: 1, backgroundColor:'#5856D6'}}
                        behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <ScrollView>
                                <View style = {loginStyles.formContainer}>
                                    {/* <Text style={loginStyles.title}>Registro</Text> */}
                                    {
                                        UsuariosData.map((valores:any, index : number)=>{
                                            return (
                                                <FieldFormik
                                                    name = {valores.name}
                                                    nombre = {formatTitle(valores.name)}
                                                    type = {valores.type}
                                                    key = {index}
                                                />
                                            )
                                        })
                                    }
                                    {/*SEXO*/}
                                
                                    <Text style={loginStyles.label}>Sexo</Text>
                                    <Picker
                                        selectedValue={sex}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setSex(itemValue)
                                        }
                                        style={loginStyles.label}    
                                    >
                                        <Picker.Item label="Masculino" value="M" />
                                        <Picker.Item label="Femenino" value="F" />
                                    </Picker>
                                    {/* FIN SEXO  */}

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
                                            mode={"date"}
                                            display="default"
                                            onChange={onChangeDate}
                                            // dayOfWeekFormat='long'
                                        />
                                    )}
                                    {/* FIN FECHA DE NACIMIENTO  */}
                                    {/* IMAGEN  */}

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
                                            source ={{uri :image ?  image : ''}}
                                            
                                        />
                                    {/* FIN IMAGEN  */}
                                    
                                    <Button
                                        disabled = {image  ? image.length === 0  ? true : false: true} 
                                        onPress={handleSubmit} 
                                        title="Submit" 
                                    />
                                </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                )}
            </Formik>
        </>
        )
}
