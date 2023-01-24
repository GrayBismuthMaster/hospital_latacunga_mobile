import React from 'react';
import { Text, View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryGroup } from 'victory-native';

export const Estadisticas = () => {
    const data = {
        planned : [null, {x : 'Semana 1', y: 20}],
        actual : [
            {x : 'Semana 1', y: 50},
            {x : 'Semana 2', y: 80},
        ]
    }

    return (
        <View style={{flex:1, width: '100%', height : '100%'}}>
            <VictoryChart>
                <VictoryGroup offset={40}>
                    <VictoryBar data = {data.actual}/>
                    <VictoryBar data = {data.planned}/>
                </VictoryGroup>
            </VictoryChart>
        </View>
    );
};
