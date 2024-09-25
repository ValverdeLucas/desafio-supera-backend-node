import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './sqlite/connection';

const app = express();

app.use(express.json());
app.use(cors());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get("/users", async (req: Request, res: Response) => {
    try {

        const result = await db.raw(`SELECT * FROM usuarios`)
        res.status(200).send(result)

    } catch (error: any) {

        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado!")
        }
    }
});

app.get("/users/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id
        const result = await db.raw(`SELECT * FROM usuarios WHERE id = ${id}`)
        res.status(201).send(result)

    } catch (error: any) {

        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado!")
        }
    }

})

app.post("/users", async (req: Request, res: Response) => {

    try {

        const { id, nome, email, perfil, telefone, idade } = req.body

        if (!id || !nome || !email || !perfil) {
            res.status(400)
            throw new Error("ID, Nome, Email ou Perfil inválido")
        }

        await db.raw(`INSERT INTO usuarios
            VALUES(${id}, "${nome}", "${email}", "${perfil}", "${telefone}", ${idade})
            `)

        res.status(201).send("Cadastro de usuário realizado com sucesso")

    } catch (error: any) {

        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado!")
        }
    }
})

app.put("/users/:id", async (req: Request, res: Response) => {

    const id = req.params.id

    const { nome, email, perfil, telefone, idade } = req.body

    const [usuario] = await db.raw(`SELECT * FROM usuarios WHERE id = ${id}`)

    if (usuario) {
        await db.raw(`UPDATE usuarios SET nome = "${nome || usuario.nome}", email = "${email || usuario.email}", perfil = "${perfil || usuario.perfil}", telefone = "${telefone || usuario.telefone}", idade = ${idade || usuario.idade} WHERE id = ${id}
        `)
    }

    res.status(201).send("Cadastro de usuário atualizado com sucesso")

    try {

    } catch (error: any) {

        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado!")
        }
    }
})