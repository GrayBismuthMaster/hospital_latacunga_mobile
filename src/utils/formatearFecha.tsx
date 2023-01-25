export const formatearFecha = (selectedTime:Date)=>{
    //console.log(selectedTime)
    //JUEGO DE CEROS EN HORAS
    const horas = new Date(selectedTime).getUTCHours() <10 ? '0'+ new Date(selectedTime).getUTCHours() : new Date(selectedTime).getUTCHours();
    const minutos = new Date(selectedTime).getUTCMinutes() <10 ? '0'+ new Date(selectedTime).getUTCMinutes() : new Date(selectedTime).getUTCMinutes();
    const segundos = new Date(selectedTime).getUTCSeconds() <10 ? '0'+ new Date(selectedTime).getUTCSeconds() : new Date(selectedTime).getUTCSeconds();
    const fTime = horas + ':' + minutos + ':' + segundos;
    //JUEGO DE CEROS PARA AM O PM
    const ampm = new Date(selectedTime).getUTCHours() <12 ? 'AM' : 'PM';
    const fTimeAMPM = fTime + ' ' + ampm;
    return fTimeAMPM;
}