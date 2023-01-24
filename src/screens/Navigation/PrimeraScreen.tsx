import React from 'react'
import {View, Text, Button} from 'react-native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { styles } from '../../theme/appTheme'
import { useNavigation } from '@react-navigation/native'

export const PrimeraScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any,any>>();
    return (
        <View style={styles.globalMargin}>
            <Text>Primera Screen</Text>
            <Button
                title="Go to Second Screen"
                onPress = { ()=> navigation.navigate("SegundaScreen")}
            />
        </View>
    )
}
