const router = require('express').Router();
const controller = require('../controllers/clienteController');
router.get('/', controller.listar);
router.get('/:id', controller.consultar);
router.post('/', controller.cadastrar);
router.put('/:id', controller.alterar);
router.delete('/:id', controller.excluir);
module.exports = router;
