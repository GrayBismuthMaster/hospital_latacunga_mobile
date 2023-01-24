import React from 'react';
import { View, Alert, TouchableOpacity, Text } from 'react-native';
import { styles } from '../theme/appTheme';

interface Props { 
    alertTitle: string;
    message : string;
    buttons : Array<{
      text    : string,
      onPress : () => void
    }>
    buttonText : string;
}

export const CustomAlert = ({alertTitle, message , buttons, buttonText} : Props) => {
    console.log('entra')
    const Alerta = ()=>{
        Alert.alert(
        alertTitle,
        message,
        buttons
        /*
        [
            {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
        */
     
    )};
      return(
        <TouchableOpacity
            style={styles.menuButton}
            onPress = {Alerta}
        >   
        <Text style={styles.ButtonSuccess}>
            {buttonText}
        </Text>
    
    </TouchableOpacity>
      )
};
