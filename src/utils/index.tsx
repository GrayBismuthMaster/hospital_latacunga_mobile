export const calcularEdad = (fecha:Date)=> {
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
}
export const formatTitle = (keys:any)=>{
    return keys.replace(/_/gi,' ').toUpperCase();
}
export const formatearHorasFecha = (fecha:Date, hora: Date)=>{

    let setHora = new Date(fecha.setHours(hora.getHours()));
    let setMinutes = new Date(setHora.setMinutes(hora.getMinutes()));
    let setSeconds = new Date(setMinutes.setSeconds(hora.getSeconds()));
    return setSeconds;
}