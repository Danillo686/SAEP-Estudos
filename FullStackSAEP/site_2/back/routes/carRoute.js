const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController.js');

router.get('/carros', carController.verCarros);
router.post('/cadastro', carController.cadastrarCliente)
router.post('/carros', carController.cadastrarCarro)
router.get('/cliente', carController.verClientes)
router.get('/carros/:id', carController.getID)
router.delete('/carros/:id', carController.deletarCarro)
module.exports = router;