import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { View, Text, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
export const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView
        style={{
            flex: 1,
            flexDirection : 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginVertical : heightScreen * 0.035,
        }}
    >
        <TouchableOpacity
            activeOpacity={0.6}
            onPress = { () =>{
                navigation.navigate('Reserva de Citas'
                )
            }}
        >
            <View style = {styles.card}>
                <Image
                    source={{uri : 'https://images.pexels.com/photos/7595265/pexels-photo-7595265.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'}}
                    style={{height:'50%', width:'30%'}}
                />
                <Text>Reserva de Citas</Text>
            </View>
            
        </TouchableOpacity>
        
        <TouchableOpacity
            activeOpacity={0.6}
            onPress = { () =>{
                navigation.navigate('Historial de visitas'
                )
            }}
        >
            <View style = {styles.card}>
                    <Image
                        source={{uri : 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'}}
                        style={{height:'50%', width:'30%'}}
                    />
                <Text>Estadísticas de visitas al consultorio</Text>
             </View>
       
        </TouchableOpacity>
        
        <TouchableOpacity
            activeOpacity={0.6}
            onPress = { () =>{
                navigation.navigate('Perfil Usuario'
                )
            }}
        >
            <View style = {styles.card}>
                    <Image
                        source={{uri : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'}}
                        style={{height:'50%', width:'30%'}}
                    />
                <Text>Perfil del Usuario</Text>
            </View>

        </TouchableOpacity>
         
        {/* <TouchableOpacity
            activeOpacity={0.6}
            onPress = { () =>{
                navigation.navigate('Avance del tratamiento'
                )
            }}
        >
            <View style = {styles.card}>
                    <Image
                        source={{uri : 'https://images.pexels.com/photos/8090147/pexels-photo-8090147.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'}}
                        style={{height:'50%', width:'30%'}}
                    />
                <Text>Avances del paciente en el tratamiento</Text>
            </View>
        </TouchableOpacity> */}
        
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    card : {
        
            width : widthScreen*.6,
            height : heightScreen*.2,
            backgroundColor : '#c475964c',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius : 10,
            shadowColor: "#714a4a",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,

            elevation: 8,

        
    }
})