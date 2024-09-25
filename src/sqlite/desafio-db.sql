-- Active: 1727218140175@@127.0.0.1@3306 
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    perfil TEXT NOT NULL,
    telefone TEXT,
    idade INTEGER
);

SELECT * FROM usuarios;

INSERT INTO usuarios VALUES(1, "Lucas Valverde", "email_do_lucas@email.com", "Administrador", "(21) 99999-1010", 29)

