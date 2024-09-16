// middleware.js
const authenticateToken = (req, res, next) => {
    // Supondo que você esteja usando sessão para gerenciar a autenticação
    if (req.session && req.session.userId) {
        // Se o usuário estiver autenticado, prossiga
        return next();
    }
    // Se não estiver autenticado, redireciona para a página de login
    return res.redirect('/');
};

module.exports = { authenticateToken };
