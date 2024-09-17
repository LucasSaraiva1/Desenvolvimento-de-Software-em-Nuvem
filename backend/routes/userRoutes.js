const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken'); // Importar JWT
const User = require('../models/User');
const { authenticateToken } = require('../middleware'); // Importar o middleware

const secretKey = 'seu_segredo_jwt'; // Defina uma chave secreta segura

// Rota para criar um usuário (apenas usuários autenticados podem acessar)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { nome, senha, email } = req.body;
        const novoUsuario = new User({ nome, senha, email });
        await novoUsuario.save();
        res.status(201).send(novoUsuario);
    } catch (error) {
        res.status(400).send('Erro ao criar usuário.');
    }
});

// Rota para listar todos os usuários (apenas usuários autenticados)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const usuarios = await User.find();
        res.status(200).send(usuarios);
    } catch (error) {
        res.status(500).send('Erro ao buscar usuários.');
    }
});

// Rota de login (aberta para todos)
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verifique se o e-mail existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Usuário não encontrado.');
        }

        // Verificar se a senha está correta
        if (senha !== user.senha) {
            return res.status(400).send('Senha incorreta.');
        }

        // Login bem-sucedido: Gerar o token JWT
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        // Armazenar o token JWT na sessão
        req.session.token = token;

        // Retornar uma mensagem de sucesso
        res.status(200).send('Login bem-sucedido.');
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).send('Erro no servidor.');
    }
});

// Rota para exibir a página de adicionar usuário (protegida pelo middleware)
router.get('/addUser', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'addUser.html')); // Certifique-se de que o caminho esteja correto
});

// Rota para exibir a página de adicionar/consultar carros (protegida pelo middleware)
router.get('/addCar', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'addCar.html')); // Certifique-se de que o caminho esteja correto
});

// Rota de logoff (Com JWT, basta o cliente remover o token)
router.get('/logoff', (req, res) => {
    // Destruir a sessão
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao fazer logoff.');
        }
        res.status(200).send('Logoff bem-sucedido.');
    });
});

module.exports = router;
