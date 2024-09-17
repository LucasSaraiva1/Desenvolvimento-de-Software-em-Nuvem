const jwt = require('jsonwebtoken');
const secretKey = 'seu_segredo_seguro'; // Coloque sua chave secreta aqui

const authenticateToken = (req, res, next) => {
    // Obter o token do cabeçalho 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Se não houver token, envia uma resposta 401 Unauthorized
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    // Verificar o token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            // Se o token for inválido ou expirado, envia uma resposta 403 Forbidden
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }

        // Se o token for válido, anexamos os dados do usuário ao req
        req.user = user;
        next(); // Prosseguir para a próxima função de middleware
    });
};

module.exports = { authenticateToken };
