import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SettingsScreen } from '../screens/Navigation/SettingsScreen';
import { StackNavigator } from './StackNavigator';
import { useWindowDimensions } from 'react-native';

const Drawer = createDrawerNavigator();

export const  HomeNavigator= () => {
    const {width} = useWindowDimensions();
  return (
    <Drawer.Navigator
        drawerType={width >= 768 ? 'permanent' : 'front'}
    >
      <Drawer.Screen name="StackNavigator" options={{title:'Principal'}} component={StackNavigator} />    
      <Drawer.Screen name="Settings" options={{title:'Configuraciones'}} component={SettingsScreen} />
    </Drawer.Navigator>
  );
}