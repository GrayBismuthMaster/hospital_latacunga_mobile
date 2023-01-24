import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MenuItem } from '../interfaces/appInterfaces';

interface Props {
    menuItem : MenuItem
}

export const FlatListMenuItem = ({menuItem}:Props) => {
    const navigation = useNavigation();
    //ICONS EN BASE A LA PARTE DEL CUERPO SELECCIONADO
    if(menuItem.icon === 'Cabeza'){
        menuItem.icon = 'face-retouching-natural';
    }
    console.log(menuItem._id)
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            onPress = { () =>{
                (navigation as any).navigate(menuItem.route,{
                    state : {historiaClinicaId: menuItem._id}
                }
                )
            }}
        >
            <View style = {styles.container}>
                <Icon
                    name = {menuItem.icon}
                    color='gray'
                    size = {30} 
                >

                </Icon>
                <Text style = {styles.itemText}>
                    {menuItem.name}
                </Text>
                <Icon
                    name = 'chevron-right'
                    color = 'gray'
                    size={30}
                >

                </Icon>
            </View>
        </TouchableOpacity>
    
    )
    
};

const styles = StyleSheet.create({
    container : {
        flexDirection : 'row',
        justifyContent : 'space-between',
    },
    itemText : {
        marginLeft : 5
    }
});    