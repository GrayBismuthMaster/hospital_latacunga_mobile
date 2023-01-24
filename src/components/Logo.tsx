import React from 'react'
import { Image, View } from 'react-native'

export const Logo = () => {
    return (
        <View 
            style={{
                alignItems: 'center'
            }}
        >
            <Image
                source={require('../assets/Login/logoHospitalLatacunga.jpg')}
                style={{
                    width: 110,
                    height: 100
                }}
            />
        </View>
    )
}
