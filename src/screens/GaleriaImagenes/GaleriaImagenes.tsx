import React, { useContext, useEffect, useRef, } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View, Animated  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


import { CarouselImages } from '../../components/CarouselImages';
import { GradientBackground } from '../../components/GradientBackground';
import { AuthContext } from '../../context/AuthContext';
import { useTratamientos } from '../../hooks/useTratamientos';
import { loginStyles } from '../../theme/loginTheme';
import { LoadingScreen } from '../Navigation/LoadingScreen';
const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
export const GaleriaImagenes = ({route, navigation} :any) => {

    const {historiaClinicaId} = route.params.state;
    console.log('desde galeria imagenes')
    console.log(route.params.state.historiaClinicaId);
    const {tratamientos, isLoading} = useTratamientos({historiaClinicaId});
    console.log('tratamientos obtenidos del hook')
    console.log(tratamientos);
    if(isLoading){
        return (
            <LoadingScreen/>
        )
    }else{
        
        return (
            <GradientBackground>
                    <ScrollView style = {
                        styles.mainContainer
                        }
                    >
                            <CarouselImages
                                items={tratamientos}
                                height={heightScreen}
                                width={widthScreen}
                            />
                            
                            <TouchableOpacity
                            
                                activeOpacity={0.8}
                                style = {[loginStyles.button, {backgroundColor: '#a6007d5b', width : '27%', alignSelf : 'center', justifyContent :'center'} ]}
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                    <Text style = {loginStyles.buttonText}>Volver</Text>
                                
                            </TouchableOpacity>
                    </ScrollView>
                
            </GradientBackground>
                
            
        );
    }
   
};

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1
    }
})