import React from 'react';
import {Text} from 'react-native';
import Picker from '@react-native-picker/picker';
interface Props {
    title : string;
    selectedValue : string;
    onChange : (arg0 : string, arg1 : number)=>void;
    pickerLabel : string;
    items : []
}
export const PickerLabel = ({title, selectedValue, onChange, pickerLabel, items}:Props)=>{
    
    return(
        <>
            <Text style = {{
                marginVertical: 4,
                fontWeight: 'bold',
                color:'black',
                fontSize: 18,
            }}>{title}</Text>                    
            <Picker
                selectedValue={selectedValue}
                style={{ 
                    height: 50, 
                    width: 190, 
                    backgroundColor : 'rgba(0,0,0,0.7)' 
                }}
                onValueChange={(itemValue : string, itemIndex : number) => onChange(itemValue, itemIndex)}
                
            >
                <Picker.Item label={pickerLabel} value="0" />
                {
                    Object.values(items).map((data:any) => (
                        <Picker.Item label={`${data.direccion_consultorio}`} value={{id_consultorio : data.id}} />
                    ))
                }
            </Picker>
        </>
    )
}