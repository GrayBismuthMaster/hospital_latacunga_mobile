import React from 'react'
import { Image, View } from 'react-native'
interface Props {
    foto : string
}
export const FotoPerfil = ({foto} :Props) => {
    return (
        <View 
            style={{
                alignItems: 'center'
            }}
        >
            <Image
                source={{uri: foto}}
                style={{
                    width: 110,
                    height: 100
                }}
            />
        </View>
    )
}
