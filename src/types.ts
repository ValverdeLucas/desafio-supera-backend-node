export type TUsuario = {
    id: number,
    nome: string,
    perfil: TIPO_PERFIL,
    telefone: string,
    idade: number
}

export enum TIPO_PERFIL {
    ADMIN = "Administrador",
    USUARIO = "Usuário Comum"
}