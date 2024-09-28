import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './sqlite/connection';
import * as EmailValidator from 'email-validator';

const app = express();

var regexTelefone = new RegExp('^\\([1-9]{2}\\) 9[0-9]{4}\-[0-9]{4}$');

function validatePositiveInteger(value: number): boolean {
    return Number.isInteger(value) && value > 0;
}

const MAX_LIMIT = 100;

interface UserRouteRequest extends express.Request {
    query: {
        limit: string;
    };
    params: {
        page: string;
    }
}

app.use(express.json());
app.use(cors());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});


app.get("/users/all", async (req: Request, res: Response) => {

    try {

        const result = await db.raw(`
            SELECT * FROM usuarios`);
        res.status(200).json(result);

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

app.get("/users/page:page", async (req: UserRouteRequest, res: Response) => {
    try {

        let page = parseInt(req.params.page, 10);
        let limit = parseInt(req.query.limit || "5", 10);

        if (!validatePositiveInteger(page) || !validatePositiveInteger(limit)) {
            throw new Error("Página e Limite devem ser números inteiros positivos");
        }

        if (limit > MAX_LIMIT) {
            throw new Error(`Limite máximo permitido é ${MAX_LIMIT}`);
        }

        const offset = (page - 1) * limit;

        const result = await db.raw(`
            SELECT * FROM usuarios 
            ORDER BY id ASC
            LIMIT ${limit} OFFSET ${offset}`);

        const totalCount = await db.raw('SELECT COUNT (*) as total FROM usuarios');
        const total = totalCount[0]?.total ?? 0;
        const totalPages = Math.min(Math.max(Math.ceil(total / limit), 1), Number.MAX_SAFE_INTEGER);

        if (page > totalPages) {
            throw new Error(`Página ${page} não encontrada`);
        }

        res.status(200).json({
            users: result,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit
            }
        });

    } catch (error: any) {

        console.error("Erro ao buscar usuários paginados:", error);

        let statusCode = 500;
        let errorMessage = "Ocorreu um erro interno ao buscar os usuários";

        if (error instanceof Error) {
            if (error.message.includes("Página")) {
                statusCode = 404;
                errorMessage = error.message;
            } else if (error.message.includes("Limite") || error.message.includes("Página")) {
                statusCode = 400;
                errorMessage = error.message;
            }
        }

        res.status(statusCode).json({ error: errorMessage });
    }
});

app.get("/users/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id
        const result = await db.raw(`SELECT * FROM usuarios WHERE id = ${id}`)
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

})

app.post("/users", async (req: Request, res: Response) => {

    try {

        const { nome, email, perfil, telefone, idade } = req.body

        if (!nome || !email || !perfil) {
            res.status(400).send("Nome, Email ou Perfil precisam ser preenchidos")
            throw new Error("Nome, Email ou Perfil precisam ser preenchidos")
        }

        if (nome.length < 3 || nome.length > 100) {
            res.status(400).send("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!")
            throw new Error("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!")
        }

        if (!EmailValidator.validate(email)) {
            res.status(400).send("Email inválido!")
            throw new Error("Email inválido!")
        }

        if (!regexTelefone.test(telefone)) {
            res.status(400).send("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX")
            throw new Error("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX")
        }

        await db.raw(`INSERT INTO usuarios (nome, email, perfil, telefone, idade)
            VALUES("${nome}", "${email}", "${perfil}", "${telefone}", ${idade})
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

        if (nome && (nome.length < 3 || nome.length > 100)) {
            res.status(400).send("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!")
            throw new Error("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!")
        }

        if (telefone && !regexTelefone.test(telefone)) {
            res.status(400).send("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX")
            throw new Error("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX")
        }

        if (email && !EmailValidator.validate(email)) {
            res.status(400).send("Email inválido!")
            throw new Error("Email inválido!")
        }

        await db.raw(`UPDATE usuarios SET nome = "${nome || usuario.nome}", email = "${email || usuario.email}", perfil = "${perfil || usuario.perfil}", telefone = "${telefone || usuario.telefone}", idade = ${idade || usuario.idade} WHERE id = ${id}
        `)
    }

    res.status(200).send("Cadastro de usuário atualizado com sucesso")

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