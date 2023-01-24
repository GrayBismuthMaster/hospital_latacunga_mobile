import React, { useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const useAnimation = () => {
  
    const opacity = useRef(new Animated.Value(0.2)).current;
    const position = useRef(new Animated.Value(0)).current;
  
    const fadeIn = ()=>{
        Animated.timing(opacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start(/*CALLBACK LUEGO QUE TERMINA */);
      
    }
    const fadeOut = () => {
        Animated.timing(
            opacity,{
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }
        )
    }
    const startMovingPosition = (initPosition : number, duration : number = 300) =>{
        position.setValue(initPosition);

        Animated.timing(position, {
            toValue: 0,
            duration,
            useNativeDriver: true,
            easing : Easing.bounce
        }).start();  
    }
     
    return {
        opacity,
        position,
        startMovingPosition,
        fadeIn,
        fadeOut
    }
};
