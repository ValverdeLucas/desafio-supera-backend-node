import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './sqlite/connection';
import * as EmailValidator from 'email-validator';

const app = express();

var regexTelefone = new RegExp('^\\([1-9]{2}\\) 9[0-9]{4}\-[0-9]{4}$');
const MAX_LIMIT = 100;

function validatePositiveInteger(value: number): boolean {
    return Number.isInteger(value) && value > 0;
}

interface UserRouteRequest extends express.Request {
    query: {
        limit: string;
        filterType: string;
        filterValue: string;
        page: string;
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

function buildSafeQuery(query: string, params: any[]) {
    return db.raw(query, params);
}

app.get("/users/all", async (req: Request, res: Response) => {
    try {

        const result = await db.raw(`
            SELECT * FROM usuarios`);
        res.status(200).json(result);

    } catch (error: any) {
        console.error("Erro ao buscar todos os usuários:", error);
        res.status(500).json({ error: "Erro ao buscar todos os usuários" });
    }
});

app.get("/users/page=:page", async (req: UserRouteRequest, res: Response) => {
    try {

        let page = parseInt(req.params.page, 10);
        let limit = parseInt(req.query.limit || "5", 10);

        if (!validatePositiveInteger(page) || !validatePositiveInteger(limit)) {
            return res.status(400).json({ error: "Página e Limite devem ser números inteiros positivos" });
        }

        if (limit > MAX_LIMIT) {
            return res.status(400).json({ error: `Limite máximo permitido é ${MAX_LIMIT}` });
        }

        const offset = (page - 1) * limit;
        const result = await buildSafeQuery('SELECT * FROM usuarios ORDER BY id ASC LIMIT ? OFFSET ?', [limit, offset]);
        const totalCount = await buildSafeQuery('SELECT COUNT(*) as total FROM usuarios', []);
        const total = totalCount[0]?.total ?? 0;
        const totalPages = Math.ceil(total / limit);

        if (page > totalPages) {
            return res.status(404).json({ error: `Página ${page} não encontrada` });
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
        res.status(500).json({ error: "Erro ao buscar usuários paginados" });
    }
});

app.get("/users/search", async (req: UserRouteRequest, res: Response) => {
    try {
        const { filterType, filterValue, page = "1", limit = "5" } = req.query;

        if (!filterType || !filterValue) {
            return res.status(400).json({ error: "Parâmetros obrigatórios faltando" });
        }

        const allowedFilters = ["nome", "email", "perfil"];
        const filterTypeLower = filterType.toLowerCase().trim();

        if (!allowedFilters.includes(filterTypeLower)) {
            return res.status(400).json({ error: "Tipo de filtro inválido" });
        }

        const filterValueLower = filterValue.toLowerCase().trim();

        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        const offset = (pageInt - 1) * limitInt;

        const result = await db.raw(`
            SELECT * FROM usuarios 
            WHERE LOWER(${filterTypeLower}) LIKE ? 
            ORDER BY id ASC 
            LIMIT ? OFFSET ?
        `, [`%${filterValueLower}%`, limitInt, offset]);

        const totalCount = await db.raw(`
            SELECT COUNT(*) as total 
            FROM usuarios 
            WHERE LOWER(${filterTypeLower}) LIKE ?
        `, [`%${filterValueLower}%`]);

        const total = totalCount[0]?.total ?? 0;
        const totalPages = Math.ceil(total / limitInt);

        res.status(200).json({
            users: result,
            pagination: {
                currentPage: pageInt,
                totalPages,
                totalItems: total,
                itemsPerPage: limitInt
            }
        });

    } catch (error: any) {
        console.error("Erro ao buscar usuários filtrados:", error);
        res.status(500).json({ error: "Erro ao buscar usuários filtrados" });
    }
});

app.get("/users/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id
        const result = await buildSafeQuery('SELECT * FROM usuarios WHERE id = ?', [id]);
        res.status(200).send(result)

    } catch (error: any) {
        console.error(`Erro ao buscar usuário com id ${req.params.id}:`, error);
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
})

app.post("/users", async (req: Request, res: Response) => {
    try {

        const userData = {
            nome: req.body.nome,
            email: req.body.email,
            perfil: req.body.perfil,
            telefone: req.body.telefone === '' ? null : req.body.telefone,
            idade: req.body.idade !== undefined ? req.body.idade : null
        };

        if (!userData.nome || !userData.email || !userData.perfil) {
            return res.status(400).send("Nome, Email ou Perfil precisam ser preenchidos")
        }

        if (userData.nome.length < 3 || userData.nome.length > 100) {
            return res.status(400).send("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!")
        }

        if (!EmailValidator.validate(userData.email)) {
            return res.status(400).send("Email inválido!")
        }

        if (userData.telefone && !regexTelefone.test(userData.telefone)) {
            return res.status(400).send("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX")
        }

        await buildSafeQuery('INSERT INTO usuarios (nome, email, perfil, telefone, idade) VALUES (?, ?, ?, ?, ?)', [userData.nome, userData.email, userData.perfil, userData.telefone || null, userData.idade || null]);

        res.status(201).send("Cadastro de usuário realizado com sucesso")

    } catch (error: any) {

        console.error("Erro ao cadastrar usuário:", error)
        res.status(500).json({ error: "Ocorreu um erro interno ao cadastrar o usuário" })

    }
})

app.put("/users/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id

        const userData = {
            nome: req.body.nome,
            email: req.body.email,
            perfil: req.body.perfil,
            telefone: req.body.telefone === '' ? null : req.body.telefone,
            idade: req.body.idade !== undefined ? req.body.idade : null
        };

        const [usuario] = await buildSafeQuery('SELECT * FROM usuarios WHERE id = ?', [id]);

        if (usuario) {

            if (userData.nome && (userData.nome.length < 3 || userData.nome.length > 100)) {
                return res.status(400).send("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!")
            }

            if (userData.telefone && !regexTelefone.test(userData.telefone)) {
                return res.status(400).send("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX")
            }

            if (userData.email && !EmailValidator.validate(userData.email)) {
                return res.status(400).send("Email inválido!")
            }

            await buildSafeQuery(`
                UPDATE usuarios 
                SET nome = ?, email = ?, perfil = ?, telefone = ?, idade = ?
                WHERE id = ?
            `, [userData.nome || usuario.nome, userData.email || usuario.email, userData.perfil || usuario.perfil, userData.telefone || usuario.telefone, userData.idade || usuario.idade, id]);

            res.status(200).json({ message: "Cadastro de usuário atualizado com sucesso" });
        } else {
            res.status(404).json({ error: "Usuário não encontrado" });
        }
    } catch (error: any) {
        console.error(`Erro ao atualizar usuário com id ${req.params.id}:`, error);
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
})

app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const result = await buildSafeQuery('DELETE FROM usuarios WHERE id = ?', [id]);
        res.status(200).send(result)
    } catch (error: any) {
        const id = req.params.id
        console.error(`Erro ao deletar usuário com id ${id}:`, error);
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
})