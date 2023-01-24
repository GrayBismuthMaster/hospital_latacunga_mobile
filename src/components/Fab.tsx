import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, TouchableNativeFeedback, Platform} from 'react-native'

interface Props {
    title : string
    position : 'right' | 'left'
    onPress : () => void
}

export const Fab = ({title, onPress, position}:Props) => {
    const ios  = ()=>{
        return (
        <TouchableOpacity
            style={[
                styles.fabLocation,
                (position === 'left') ? styles.left : styles.right
            ]}
            
            onPress={ onPress }
        >
            <View style={styles.fab}>
                <Text
                    style={styles.fabText}
                >
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
        )
    }
    const android = ()=>{
        return(
            <View
                style={[
                    styles.fabLocation,
                    (position === 'left') ? styles.left : styles.right
                ]}
            >
                <TouchableNativeFeedback
                                onPress={ onPress }
                                background = {TouchableNativeFeedback.Ripple("#28425B", false, 30)}


                                    /*
                                        position =='right' ? styles.fabLocationRight : styles.fabLocationLeft
                                    */
                                
                            >
                                <View style={styles.fab}>
                                    <Text
                                        style={styles.fabText}
                                    >
                                        {title}
                                    </Text>
                                </View>
                </TouchableNativeFeedback>
            </View>
        )
    
    }
    return (Platform.OS === 'ios') ? ios() : android();
}

const styles = StyleSheet.create({
    fabLocation : {
        position: 'absolute',
        bottom: 5
    },
    right :{
        right: 5
    },
    left :{
        left: 5
    },
    fab:{
        backgroundColor: '#5856D6',
        width: 60,
        height: 60,
        borderRadius: 100,
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    fabText:{
        color: "white",
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf : 'center',
    }
})
