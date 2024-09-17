const jwt = require('jsonwebtoken');
const secretKey = 'seu_segredo_seguro'; // Coloque sua chave secreta aqui

const authenticateToken = (req, res, next) => {
    // Obter o token do cabeçalho 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Se não houver token, redireciona para a página de login
        return res.redirect('/');
    }

    // Verificar o token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            // Se o token for inválido ou expirado
            return res.redirect('/');
        }

        // Se o token for válido, anexamos os dados do usuário ao req
        req.user = user;
        next(); // Prosseguir para a próxima função de middleware
    });
};

module.exports = { authenticateToken };
