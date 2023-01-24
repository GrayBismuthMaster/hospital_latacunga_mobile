import React, { Children } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Tratamiento } from '../interfaces/appInterfaces';
interface Props { 
    tratamiento : Tratamiento
}
export const AvancePoster = ({tratamiento} : Props) => {
    console.log(tratamiento);
  return(
        <View style = {{
            flex: 1
            
            }}>
                <View style = {styles.imageContainer}>
                    <Image
                        source={{uri: tratamiento.foto}}
                        style = {
                            styles.image
                        }
                    />
                </View>
        </View>
      

  );
};
const styles = StyleSheet.create({
    image : {
        flex: 1,
        borderRadius: 18,
    },
    imageContainer : {
        flex: 1,
        borderRadius : 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.9,
        shadowRadius: 16.00,
        
        elevation: 10,
    },
})