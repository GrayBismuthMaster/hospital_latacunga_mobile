import React, {useState } from "react";
import {Platform, Text, TouchableOpacity} from 'react-native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatearFecha } from "../utils/formatearFecha";

interface Props {
    title : string;
    dateTime : Date;
    setDateTime : (arg0 : any)=>any
    modeParent : string;
}
export const DateTimePickerComponent = ({title, setDateTime, dateTime, modeParent}:Props)=>{
    
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState("");
    const [dateText, setDateText] = useState("");
    const [dateTimeText, setDateTimeText] = useState("");

    const showMode = (currentMode : any) =>{
        setShow(true);
        setMode(currentMode);
      }
      //CAMBIO DE FECHA PARA EL TEXT

      {/* DATE TIME PICKER*/}
      const onChangeDate = (event : any, selectedDate : any) => {
        const currentDate = selectedDate || dateTime;
        setShow(Platform.OS === 'ios');
        setDateTime(currentDate);
        let tempDate = format(new Date (currentDate), 'MM-dd-yyyy');
        setDateTimeText(tempDate );
      }

        {/* START TIME PICKER */}
        const onChangeTime = (event : any, selectedTime : any) => {
            
            setShow(false);
            const fTimeAMPM = formatearFecha(selectedTime);
            // console.log(fTimeAMPM);
            // setShowStartTime(Platform.OS === 'ios');
            setDateTime(selectedTime);
            setDateTimeText(fTimeAMPM);
        }

    return(
        <>
            <Text style = {{
                marginVertical: 4,
                fontWeight: 'bold',
                color:'black',
                fontSize: 18,
            }}>{title}</Text>
            <TouchableOpacity 
                style={{
                    backgroundColor : 'rgba(0,0,0,0.4)',
                    width : '50%',
                    justifyContent : 'center',
                    alignItems : 'center',
                }}
                onPress={() => showMode(modeParent)}
            >
                <Text style = {{
                    marginTop: 10,
                    color:'rgba(255,255,255,0.9)',
                    fontSize: 15,
                }}>{ dateTimeText} </Text>
                {
                    show && (
                                <DateTimePicker
                                    timeZoneOffsetInMinutes={0}
                                    value={dateTime}
                                    mode={mode}
                                    display="default"
                                    onChange={mode === 'date'? onChangeDate : onChangeTime}
                                    dayOfWeekFormat='long'
                                />
                    )
                }
            </TouchableOpacity>
        </>
    )
}