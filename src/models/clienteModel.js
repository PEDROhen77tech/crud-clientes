// Modo local em memoria para testes. Configure FIREBASE_DATABASE_URL e
// FIREBASE_SERVICE_ACCOUNT_JSON para persistir dados no Firebase no Render.
const admin = require('firebase-admin');
let db = null;
if (process.env.FIREBASE_DATABASE_URL && process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  const credential = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!admin.apps.length) admin.initializeApp({
    credential: admin.credential.cert(credential),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  db = admin.database().ref('clientes');
}
const clientes = new Map();
let proximoId = 1;
class ClienteModel {
  static async listar() {
    if (db) {
      const snap = await db.once('value');
      return Object.values(snap.val() || {}).sort((a,b) => a.id-b.id);
    }
    return [...clientes.values()];
  }
  static async consultar(id) {
    if (db) return (await db.child(String(id)).once('value')).val();
    return clientes.get(id) || null;
  }
  static async cadastrar(nome, email) {
    // IDs gerados por timestamp + numero aleatorio para evitar colisao entre instancias.
    const id = db ? Number(`${Date.now()}${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`) : proximoId++;
    const cliente = { id, nome, email };
    if (db) await db.child(String(id)).set(cliente);
    else clientes.set(id, cliente);
    return cliente;
  }
  static async alterar(id, nome, email) {
    if (!await this.consultar(id)) return null;
    const cliente = { id, nome, email };
    if (db) await db.child(String(id)).set(cliente);
    else clientes.set(id, cliente);
    return cliente;
  }
  static async excluir(id) {
    if (!await this.consultar(id)) return false;
    if (db) await db.child(String(id)).remove();
    else clientes.delete(id);
    return true;
  }
}
module.exports = ClienteModel;
