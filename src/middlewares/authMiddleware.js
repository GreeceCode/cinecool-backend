
function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        
        const userRol = req.headers['x-user-rol'];

        if (!userRol || !rolesPermitidos.includes(userRol)) {
            return res.status(403).json({ 
                message: 'Acceso denegado: No tienes los permisos necesarios para realizar esta acción.' 
            });
        }

        next();
    };
}

module.exports = { verificarRol };