const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Car = require('../models/Car');

// Configuração do Multer para upload de imagem
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Diretório onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Renomeia o arquivo para evitar conflitos
  }
});

const upload = multer({ storage: storage });

// Rota para adicionar um carro com upload de imagem
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const { nome, estoque, ano, modelo } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nome || !estoque || !ano || !modelo || !imagem) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const novoCarro = new Car({
      nome,
      estoque,
      ano,
      modelo,
      imagem
    });

    await novoCarro.save();
    res.status(201).send(novoCarro);
  } catch (error) {
    console.error('Erro ao criar carro:', error);
    res.status(500).send('Erro ao criar carro.');
  }
});

// Rota para listar todos os carros
router.get('/', async (req, res) => {
  try {
    const carros = await Car.find();
    res.status(200).send(carros);
  } catch (error) {
    res.status(500).send('Erro ao buscar carros.');
  }
});

// Rota para remover um carro
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const carro = await Car.findByIdAndDelete(id);
    if (!carro) {
      return res.status(404).send('Carro não encontrado.');
    }
    res.status(200).send({ message: 'Carro removido com sucesso.' });
  } catch (error) {
    res.status(500).send('Erro ao remover carro.');
  }
});

// Rota para editar um carro
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, estoque, ano, modelo } = req.body;
    const carro = await Car.findByIdAndUpdate(id, { nome, estoque, ano, modelo }, { new: true });
    if (!carro) {
      return res.status(404).send('Carro não encontrado.');
    }
    res.status(200).send(carro);
  } catch (error) {
    res.status(500).send('Erro ao editar carro.');
  }
});

// Rota para atualizar o estoque de um carro
router.patch('/:id/estoque', async (req, res) => {
  try {
    const { id } = req.params;
    const { estoque } = req.body;
    const carro = await Car.findByIdAndUpdate(id, { estoque }, { new: true });
    if (!carro) {
      return res.status(404).send('Carro não encontrado.');
    }
    res.status(200).send(carro);
  } catch (error) {
    res.status(500).send('Erro ao atualizar o estoque.');
  }
});

module.exports = router;
