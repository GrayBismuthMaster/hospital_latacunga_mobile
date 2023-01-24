import React from 'react';
import { styles } from '../theme/appTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

interface HeaderTitleProps {
    title: string;
    children : JSX.Element | JSX.Element[] 
}
export const HeaderTitle = ({title, children}: HeaderTitleProps) => {
    
    const {top} = useSafeAreaInsets();
    return(
        <View style = {{
            marginTop : top+20,
            marginBottom : 20
        }}>
            <Text style = {styles.title}>
                {title}
            </Text>
            {children}
        </View>
    );
};
