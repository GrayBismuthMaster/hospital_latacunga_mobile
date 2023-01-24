import React, { useContext } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatListMenuItem } from '../../components/FlatListMenuItem';
import { MenuItem } from '../../interfaces/appInterfaces';
import { styles } from '../../theme/appTheme';
import { useHistoriasClinicas } from '../../hooks/useHistoriasClinicas';
import { AuthContext } from '../../context/AuthContext';
import { LoadingScreen } from '../Navigation/LoadingScreen';
import { HeaderTitle } from '../../components/HeaderTitle';
export const AvancesScreen = () => {
    
    const {user} = useContext(AuthContext)
    const {_id}:any = user;
    const {historiasClinicas, isLoading} = useHistoriasClinicas({_id});
    console.log('historias clincas desde avances screen')
    console.log(historiasClinicas);
    const menuItems = historiasClinicas ?Object.values(historiasClinicas).map((historiaClinica:any)=>{
        return {
            _id : historiaClinica._id,
            name : historiaClinica.diagnostico,
            icon : historiaClinica.parte_cuerpo_seleccionado,
            route : 'Galeria'
        }
      }) : [];    
      console.log(menuItems);
    /*
    const menuItems: MenuItem[] = [
        {
            _id :'1',
            name : 'Animation 101',
            icon : 'book-online',
            
        },
        {
            _id :'2',
            name : 'Animation 102',
            icon : 'calendar-today',
            
        }
      ]
      */
        const {top} = useSafeAreaInsets();
        if(isLoading){
            return (
                <LoadingScreen/>
            )
        }else{
            const renderListHeader = () =>{
                return (
                    <HeaderTitle title = 'Avances'>
                        <Text style = {[{...styles.subtitle,marginVertical: 20}] }>
                            Escoja su diagnóstico
                        </Text>
                    </HeaderTitle>
                        
                    
                )
            }
      
            const itemSeparator = () =>{
                return(
                    <View style= {{
                        borderBottomWidth : 1,
                        opacity: 0.4,
                        marginVertical : 8
                    }}>
      
                    </View>
                )
            }
            return (
                <SafeAreaView style = {styles.globalMargin}>
                    <FlatList
                        data={menuItems}
                        renderItem = { ({item}) => <FlatListMenuItem menuItem = {item}/>}
                        keyExtractor = { (item) => item.name}
                        ListHeaderComponent = {renderListHeader}
                        ItemSeparatorComponent={itemSeparator}
                        
                    />
                </SafeAreaView>
            );
        }
          
};
