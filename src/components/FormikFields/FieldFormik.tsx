import React from "react";
import { Field, useField, useFormikContext } from "formik";
import { Platform, Text } from "react-native";
import { loginStyles } from "../../theme/loginTheme";
import { TextInput } from "react-native";
export const FieldFormik = ({...props}:any)=>{
    // const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    console.log(field);
    console.log(props);
    return (
        <>
            <Text style={loginStyles.label}>{props.nombre}</Text>
            <TextInput
                {...field}
                {...props}
                placeholder={`INGRESE SU ${props.nombre}`}
                placeholderTextColor = 'rgba(255,255,255,0.4)'
                underlineColorAndroid="white"
                
                keyboardType={props.type}
                name={props.name}
                key = {props.key}
                type={props.type}
                onChangeText = {field.onChange(props.name)}
                style={[
                    loginStyles.inputField,
                    (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                ]}
                id={props.nombre} 
                secureTextEntry = {props.name === 'password' ? true : false}
                autoCapitalize = {props.name === 'email' || props.name === 'password' ? 'none' : null}
            />
            {/* {errors.id_usuario ?? <div className = {notificationStyles.error}>{errors.id_usuario}</div>} */}
        </>
    )
}
