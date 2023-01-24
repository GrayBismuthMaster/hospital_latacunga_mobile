import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import React, {useContext, useState, useEffect} from 'react'
import { StyleSheet,SafeAreaView, View, Text,  ImageBackground, TouchableOpacity, Dimensions, TextInput, useWindowDimensions, Platform, KeyboardAvoidingView, Keyboard, Alert } from 'react-native'
import { ScreenStackProps } from 'react-native-screens'
import { Background } from '../components/Background'
import { Logo } from '../components/Logo'
import { AuthContext } from '../context/AuthContext'
import { useForm } from '../hooks/useForm'
import { RootStackParams } from '../Navigation/StackNavigator'
import { loginStyles } from '../theme/loginTheme'

interface Props extends NativeStackScreenProps<RootStackParams,'LoginScreen'>{};

export const LoginScreen = ({navigation} : any) => {
    /*
    const [nombreUsuario, onChangeNombreUsuario] = useState("")
    const [contrasenia, onChangeContrasenia] = useState("")
    const {width,height} = useWindowDimensions();
     const navigation = useNavigation<NativeStackNavigationProp<any,any>>();
   
    */
   
    const {signIn, errorMessage, removeError} = useContext(AuthContext);

    //USEFORM
    const {email, password, onChange} = useForm({
        email : '',
        password : '',
    })

    useEffect(() => {
        if(errorMessage.length ===0) return;
        Alert.alert(
            'Login incorrecto', 
            errorMessage,
            [
                {
                    text:'OK',
                    onPress : removeError
                }
            ]
            )
        return () => {
            
        }
    }, [errorMessage])


    const onLogin = () =>{
        console.log({email, password})
        Keyboard.dismiss();
        const obj = {
            email,
            password
        }
        signIn(obj)
    }

    return (
            <>
                {/*BACKGROUND */}
                <Background/>
                <KeyboardAvoidingView
                    style = {{flex: 1}}
                    behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style = {loginStyles.formContainer}>
                        {/* Keyboard avoid view*/}
                        <Logo/>
                        <Text style={loginStyles.title}>Login</Text>
                        
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
                             onSubmitEditing={onLogin}
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
                             onSubmitEditing={onLogin}  
                        />

                        {/*Button Login */}
                        <View 
                            style = {loginStyles.buttonContainer}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style = {loginStyles.button}
                                onPress = {onLogin}
                            >
                                <Text style = {loginStyles.buttonText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {loginStyles.newUserContainer}>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress ={()=>{navigation.replace('RegisterScreen')}}
                                    >
                                        <Text style = {loginStyles.buttonText}>Nueva Cuenta</Text>
                                    </TouchableOpacity>
                        </View>
                    </View>
                    
                </KeyboardAvoidingView>
               
            </>
        )
}
  
