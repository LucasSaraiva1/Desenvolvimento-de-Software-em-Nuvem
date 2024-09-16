const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session'); 
const { authenticateToken } = require('./middleware'); 

// Importar as rotas
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');

// Configuração do app
const app = express();
const port = process.env.PORT || 3000;

// Middleware de sessão
app.use(session({
  secret: 'seu_segredo_seguro', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
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
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
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

// Rota para fazer logoff
app.get('/logoff', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao fazer logoff.');
        }
        res.redirect('/'); 
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
