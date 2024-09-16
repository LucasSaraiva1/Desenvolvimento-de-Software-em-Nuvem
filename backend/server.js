const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session'); // Adicionando express-session para gerenciar sessões
const { authenticateToken } = require('./middleware'); // Importar o middleware

// Importar as rotas
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');

// Configuração do app
const app = express();
const port = process.env.PORT || 3000;

// Middleware de sessão
app.use(session({
  secret: 'seu_segredo_seguro', // Utilize uma string segura em produção
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Defina como 'true' se estiver usando HTTPS
}));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Servir arquivos estáticos (CSS, JS, imagens), mas não arquivos HTML diretamente
app.use(express.static(path.join(__dirname, '../Frontend'), {
  extensions: ['js', 'css', 'png', 'jpg'], // Serve apenas arquivos de mídia e estilo
  index: false // Desativa a capacidade de servir index.html automaticamente
}));

// Conectar ao MongoDB
const mongoUri = 'mongodb+srv://lucasps6saraiva:vEZ8IrKk15orPlHV@nuvem.ayeyy.mongodb.net/?retryWrites=true&w=majority&appName=Nuvem';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err.message));

// Rotas protegidas para servir os arquivos HTML (addCar.html, addUser.html)
app.get('/addCar', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'addCar.html'));
});

app.get('/addUser', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'addUser.html'));
});

// Rota de login (aberta para todos)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});

// Usar as rotas
app.use('/users', userRoutes);
app.use('/cars', carRoutes);
app.use('/uploads', express.static('uploads'));

// Rota para fazer logoff
app.get('/logoff', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao fazer logoff.');
        }
        res.redirect('/'); // Redireciona para a página de login (index.html)
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
