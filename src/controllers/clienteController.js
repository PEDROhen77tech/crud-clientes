const Cliente = require('../models/clienteModel');
const valido = ({nome, email} = {}) => typeof nome === 'string' && nome.trim().length > 0 && typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const idValido = req => /^\d+$/.test(req.params.id) && Number.isSafeInteger(Number(req.params.id));
class ClienteController {
  static async listar(req, res, next) { try { res.json(await Cliente.listar()); } catch(e) { next(e); } }
  static async consultar(req, res, next) { try {
    if (!idValido(req)) return res.status(400).json({erro:'ID invalido'});
    const cliente = await Cliente.consultar(Number(req.params.id));
    if (!cliente) return res.status(404).json({erro:'Cliente nao encontrado'});
    res.json(cliente);
  } catch(e) { next(e); } }
  static async cadastrar(req, res, next) { try {
    if (!valido(req.body)) return res.status(400).json({erro:'Informe nome e email valido'});
    res.status(201).json(await Cliente.cadastrar(req.body.nome.trim(), req.body.email.trim()));
  } catch(e) { next(e); } }
  static async alterar(req, res, next) { try {
    if (!idValido(req)) return res.status(400).json({erro:'ID invalido'});
    if (!valido(req.body)) return res.status(400).json({erro:'Informe nome e email valido'});
    const cliente = await Cliente.alterar(Number(req.params.id), req.body.nome.trim(), req.body.email.trim());
    if (!cliente) return res.status(404).json({erro:'Cliente nao encontrado'});
    res.json(cliente);
  } catch(e) { next(e); } }
  static async excluir(req, res, next) { try {
    if (!idValido(req)) return res.status(400).json({erro:'ID invalido'});
    if (!await Cliente.excluir(Number(req.params.id))) return res.status(404).json({erro:'Cliente nao encontrado'});
    res.json({mensagem:'Cliente excluido com sucesso'});
  } catch(e) { next(e); } }
}
module.exports = ClienteController;
