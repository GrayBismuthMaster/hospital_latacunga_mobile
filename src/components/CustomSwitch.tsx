import React, { useState } from 'react';
import { Switch } from 'react-native';

interface Props {
    isOn : boolean;
    onChange : (value : boolean) => void;
}

export const CustomSwitch = ({isOn, onChange} : Props) => {
    const [isEnabled, setIsEnabled] = useState(isOn);
    const toggleSwitch = () =>{
        setIsEnabled(!isEnabled);
        onChange(!isEnabled);   
    }

    return (
        <Switch 
            trackColor = {{false: '#D9D9DB', true: '#0a7558'}}
            thumbColor = {isEnabled ? '#f4f3f4' : '#f4f3f4'}
            //ios_backgroundColor = '#3e3e3e'
            onValueChange = {toggleSwitch}
            value = {isEnabled}
            
        />
    );
};
