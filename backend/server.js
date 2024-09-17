const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session'); // Adicionar express-session para gerenciar as sessões
const { authenticateToken } = require('./middleware'); // Importar o middleware JWT

// Importar as rotas
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');

// Configuração do app
const app = express();
const port = process.env.PORT || 3000;

// Configuração da sessão
app.use(session({
  secret: 'seu_segredo_seguro', // Defina uma chave secreta segura
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Servir arquivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, '../frontend'), {
  extensions: ['js', 'css', 'png', 'jpg'],
  index: false // Desativa a capacidade de servir index.html automaticamente
}));

// Conectar ao MongoDB
const mongoUri = 'mongodb+srv://lucasps6saraiva:vEZ8IrKk15orPlHV@nuvem.ayeyy.mongodb.net/?retryWrites=true&w=majority&appName=Nuvem';
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err.message));

// Rotas protegidas para servir os arquivos HTML (addCar.html, addUser.html)
app.get('/addCar', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'addCar.html'));
});

app.get('/addUser', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'addUser.html'));
});

// Rota de login (aberta para todos)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Usar as rotas
app.use('/users', userRoutes);
app.use('/cars', carRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
