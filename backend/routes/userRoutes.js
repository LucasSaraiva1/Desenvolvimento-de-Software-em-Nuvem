const express = require('express');
const router = express.Router();
const path = require('path'); // Importar o módulo 'path' para servir arquivos estáticos
const User = require('../models/User');
const { authenticateToken } = require('../middleware'); // Importar o middleware

// Verificar se a sessão está ativa
router.get('/check-session', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendStatus(200); // Sessão ativa
  } else {
    res.sendStatus(401); // Não autorizado
  }
});

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

      // Login bem-sucedido: Crie a sessão para o usuário
      req.session.userId = user._id;

      // Redirecionar para a página home
      res.redirect('/build/home.html'); // Redireciona para home.html na pasta Frontend
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).send('Erro no servidor.');
    }
});

// Rota para exibir a página de adicionar usuário (protegida pelo middleware)
router.get('/addUser', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'addUser.html'));
});

// Rota para exibir a página de adicionar/consultar carros (protegida pelo middleware)
router.get('/addCar', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'addCar.html'));
});

// Rota de logoff
router.get('/logoff', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao fazer logoff.');
        }
        res.redirect('/'); // Redireciona para a página de login (index.html)
    });
});

module.exports = router;
