export class Diagnostico {
    enfermedadCronica: string;
    alcohol: string;
    tabaco: string;
    alimentacion: string;
    habitos: string;
}

export class Paciente {
    id: number;
    nombre: string;
    apellido: string;
    sexo: string;
    peso: number;
    fechaNacimiento: string;
    telefono: string;
    email: string;
    diagnostico: Diagnostico = new Diagnostico();
}
