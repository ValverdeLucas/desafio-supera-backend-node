"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var connection_1 = require("./sqlite/connection/connection");
var EmailValidator = require("email-validator");
var app = (0, express_1.default)();
var regexTelefone = new RegExp('^\\([1-9]{2}\\) 9[0-9]{4}\-[0-9]{4}$');
function validatePositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}
var MAX_LIMIT = 100;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, function () {
    console.log("Servidor rodando na porta 3003");
});
app.get("/users/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, connection_1.db.raw("\n            SELECT * FROM usuarios")];
            case 1:
                result = _a.sent();
                res.status(200).json(result);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                if (req.statusCode === 200) {
                    res.status(500);
                }
                if (error_1 instanceof Error) {
                    res.send(error_1.message);
                }
                else {
                    res.send("Erro inesperado!");
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/users/page/:page", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, offset, result, totalCount, total, totalPages, error_2, statusCode, errorMessage;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                page = parseInt(req.params.page, 10);
                limit = parseInt(req.query.limit || "5", 10);
                if (!validatePositiveInteger(page) || !validatePositiveInteger(limit)) {
                    throw new Error("Página e Limite devem ser números inteiros positivos");
                }
                if (limit > MAX_LIMIT) {
                    throw new Error("Limite m\u00E1ximo permitido \u00E9 ".concat(MAX_LIMIT));
                }
                offset = (page - 1) * limit;
                return [4 /*yield*/, connection_1.db.raw("\n            SELECT * FROM usuarios \n            ORDER BY id ASC\n            LIMIT ".concat(limit, " OFFSET ").concat(offset))];
            case 1:
                result = _c.sent();
                return [4 /*yield*/, connection_1.db.raw('SELECT COUNT (*) as total FROM usuarios')];
            case 2:
                totalCount = _c.sent();
                total = (_b = (_a = totalCount[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0;
                totalPages = Math.min(Math.max(Math.ceil(total / limit), 1), Number.MAX_SAFE_INTEGER);
                if (page > totalPages) {
                    throw new Error("P\u00E1gina ".concat(page, " n\u00E3o encontrada"));
                }
                res.status(200).json({
                    users: result,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalItems: total,
                        itemsPerPage: limit
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _c.sent();
                console.error("Erro ao buscar usuários paginados:", error_2);
                statusCode = 500;
                errorMessage = "Ocorreu um erro interno ao buscar os usuários";
                if (error_2 instanceof Error) {
                    if (error_2.message.includes("Página")) {
                        statusCode = 404;
                        errorMessage = error_2.message;
                    }
                    else if (error_2.message.includes("Limite") || error_2.message.includes("Página")) {
                        statusCode = 400;
                        errorMessage = error_2.message;
                    }
                }
                res.status(statusCode).json({ error: errorMessage });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/users/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, connection_1.db.raw("SELECT * FROM usuarios WHERE id = ".concat(id))];
            case 1:
                result = _a.sent();
                res.status(200).send(result);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                if (req.statusCode === 200) {
                    res.status(500);
                }
                if (error_3 instanceof Error) {
                    res.send(error_3.message);
                }
                else {
                    res.send("Erro inesperado!");
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, nome, email, perfil, telefone, idade, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, nome = _a.nome, email = _a.email, perfil = _a.perfil, telefone = _a.telefone, idade = _a.idade;
                if (!nome || !email || !perfil) {
                    res.status(400).send("Nome, Email ou Perfil precisam ser preenchidos");
                    throw new Error("Nome, Email ou Perfil precisam ser preenchidos");
                }
                if (nome.length < 3 || nome.length > 100) {
                    res.status(400).send("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!");
                    throw new Error("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!");
                }
                if (!EmailValidator.validate(email)) {
                    res.status(400).send("Email inválido!");
                    throw new Error("Email inválido!");
                }
                if (!regexTelefone.test(telefone)) {
                    res.status(400).send("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX");
                    throw new Error("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX");
                }
                return [4 /*yield*/, connection_1.db.raw("INSERT INTO usuarios (nome, email, perfil, telefone, idade)\n            VALUES(\"".concat(nome, "\", \"").concat(email, "\", \"").concat(perfil, "\", \"").concat(telefone, "\", ").concat(idade, ")\n            "))];
            case 1:
                _b.sent();
                res.status(201).send("Cadastro de usuário realizado com sucesso");
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                if (req.statusCode === 200) {
                    res.status(500);
                }
                if (error_4 instanceof Error) {
                    res.send(error_4.message);
                }
                else {
                    res.send("Erro inesperado!");
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put("/users/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, nome, email, perfil, telefone, idade, usuario;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, nome = _a.nome, email = _a.email, perfil = _a.perfil, telefone = _a.telefone, idade = _a.idade;
                return [4 /*yield*/, connection_1.db.raw("SELECT * FROM usuarios WHERE id = ".concat(id))];
            case 1:
                usuario = (_b.sent())[0];
                if (!usuario) return [3 /*break*/, 3];
                if (nome && (nome.length < 3 || nome.length > 100)) {
                    res.status(400).send("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!");
                    throw new Error("Nome inválido! É necessário que o nome tenha entre 3 e 100 caracteres!");
                }
                if (telefone && !regexTelefone.test(telefone)) {
                    res.status(400).send("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX");
                    throw new Error("Telefone inválido, insira um número no formato: (XX) XXXXX-XXXX");
                }
                if (email && !EmailValidator.validate(email)) {
                    res.status(400).send("Email inválido!");
                    throw new Error("Email inválido!");
                }
                return [4 /*yield*/, connection_1.db.raw("UPDATE usuarios SET nome = \"".concat(nome || usuario.nome, "\", email = \"").concat(email || usuario.email, "\", perfil = \"").concat(perfil || usuario.perfil, "\", telefone = \"").concat(telefone || usuario.telefone, "\", idade = ").concat(idade || usuario.idade, " WHERE id = ").concat(id, "\n        "))];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                res.status(200).send("Cadastro de usuário atualizado com sucesso");
                try {
                }
                catch (error) {
                    if (req.statusCode === 200) {
                        res.status(500);
                    }
                    if (error instanceof Error) {
                        res.send(error.message);
                    }
                    else {
                        res.send("Erro inesperado!");
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
