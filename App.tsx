
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from './src/context/AuthContext'
import { StackNavigator } from './src/Navigation/StackNavigator'
import React from 'react';
import { ReservaCitaProvider } from './src/context/ReservaCitaContext';

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <ReservaCitaState>
          <StackNavigator/>
        </ReservaCitaState>
      </AppState>
    </NavigationContainer>
  );
}
const AppState = ({children}:any) =>{
  return(
    <AuthProvider>
      {children}
    </AuthProvider>
  )  
}
const ReservaCitaState = ({children}: any)=>{
  return(
    <ReservaCitaProvider>
      {children}
    </ReservaCitaProvider>
  )
}
export default App;
