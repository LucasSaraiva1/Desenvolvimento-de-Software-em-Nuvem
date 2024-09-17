const jwt = require('jsonwebtoken');
const secretKey = 'seu_segredo_seguro'; // Coloque sua chave secreta aqui

const authenticateToken = (req, res, next) => {
    // Obter o token da sessão
    const token = req.session.token; // Token armazenado na sessão

    if (!token) {
        // Se não houver token, redireciona para a página de login
        return res.redirect('/'); // Redireciona para a página de login
    }

    // Verificar o token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            // Se o token for inválido ou expirado, redireciona para login
            return res.redirect('/'); // Redireciona para a página de login
        }

        // Se o token for válido, anexamos os dados do usuário ao req
        req.user = user;
        next(); // Prosseguir para a próxima função de middleware
    });
};

module.exports = { authenticateToken };
