export interface LoginResponse {
    datosUsuario : Usuario ; 
    token: string;
}

export interface Usuario {
    id : string;
    primer_nombre : string;
    segundo_nombre : string;
    apellido_paterno : string;
    apellido_materno : string;
    cedula_identidad : string;
    fecha_nacimiento : string;
    sexo : string;
    telefono : string;
    estado : string;
    imagen : string;
    username : string;
    email : string;
    role : Role;
}

export interface LoginData {
    email : string;
    password : string
}



export interface RegisterData {
    primer_nombre : string;
    segundo_nombre : string;
    apellido_paterno : string;
    apellido_materno : string;
    cedula_identidad : string;
    email : string;
    username : string;
    password : string;
    telefono : string;
    imagen : string;
    sexo : string;
    fecha_nacimiento : Date;
    id_rol : string;
    estado : boolean
}


/*
    INTERFAZ DE TRATAMIENTO
*/

export interface IdUsuario {
    _id: string;
    nombre: string;
    imagen: string;
}

export interface IdHistoriaClinica {
    _id: string;
    motivo_consulta: string;
    diagnostico: string;
    id_usuario: IdUsuario;
}

export interface Tratamiento {
    _id: string;
    nombre: string;
    descripcion: string;
    foto: string;
    fechaActual: Date;
    id_historia_clinica: IdHistoriaClinica;
}

/*
    INTERFACES DE HISTORIA CLINICA
*/

export interface HistoriaClinica {
    _id: string;
    motivo_consulta: string;
    antecedentes_patologicos_personales: string;
    antecedentes_patologicos_familiares: string;
    medicacion_actual_continua: string;
    tratamientos_anteriores: string;
    examen_fisico: string;
    diagnostico: string;
    tratamiento_actual: string;
    parte_cuerpo_seleccionado: string;
    id_usuario: string;
    createdAt: Date;
    updatedAt: Date;
}

/*
    INTERFACES DE MENU 
*/
export interface MenuItem {
    _id : string;
    name: string;
    icon: string;
    route : string;
}

/*
    INTERFACES DE CITAS
*/
export interface IdUsuario {
    _id: string;
    nombre: string;
}

export interface Profesional {
    id : string;
    nombre_profesional:string;
    apellido_profesional:string;
    cedula_profesional:string;
    telefono_profesional:string;
    direccion_profesional:string;
    correo_profesional:string;
    imagen_profesional:string;
    estado_profesional:boolean;
    especialidad : Especialidad
}

export interface Especialidad {
    id: string;
    nombre_especialidad: string;
    estado_especialidad : boolean;
    consultorio : Consultorio
}

export interface IdConsultorio {
    _id: string;
    nombre_consultorio: string;
}

export interface ReservaCita {
    motivo_reserva: string;
    id: string;
    fecha_hora_inicio_reserva: string;
    fecha_hora_fin_reserva: string;
    estado_reserva: string;
    id_usuario: IdUsuario;
    id_profesional: Profesional;
    id_consultorio: IdConsultorio;
}

//CONSULTORIOS
export interface IdProfesionalGenerar {
    _id: string;
    nombre_profesional: string;
    apellido_profesional: string;
    cedula_profesional: string;
    telefono_profesional: string;
    direccion_profesional: string;
    correo_profesional: string;
    imagen_profesional: string;
    estado_profesional: string;
}

export interface IdEspecialidadGenerar {
    _id: string;
    nombre_especialidad: string;
    id_profesional: Profesional[];
    estado_especialidad: string;
}

export interface Consultorio{
    id : string;
    nombre_consultorio: string;
    descripcion_consultorio : string;
    imagen_consultorio : string;
    direccion_consultorio: string;
    horario_atencion_consultorio: string;
    estado_consultorio: boolean;
}
export enum EstadoReserva {
    COMPLETADO="ACEPTADO",
    PENDIENTE="PENDIENTE",
    CANCELADO="CANCELADO"
}
export interface Role {
    id:string
    nombreRol:string
}