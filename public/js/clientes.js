const lista = document.getElementById('lista');
const modal = document.getElementById('modal');
const form = document.getElementById('form');
const mensagem = document.getElementById('mensagem');
let idEditando = null;
let clientesAtuais = [];

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || 'Falha na requisição');
  return dados;
}

function criarCelula(linha, texto) {
  const td = document.createElement('td');
  td.textContent = String(texto ?? '');
  linha.appendChild(td);
  return td;
}

async function carregar() {
  mensagem.textContent = '';
  try {
    const dados = await requisicao('/clientes');
    clientesAtuais = Array.isArray(dados) ? dados : [];
    document.getElementById('total').textContent = clientesAtuais.length;
    lista.replaceChildren();
    if (!clientesAtuais.length) {
      const tr = document.createElement('tr');
      const td = criarCelula(tr, 'Nenhum cliente cadastrado.');
      td.colSpan = 4;
      lista.appendChild(tr);
      return;
    }
    for (const cliente of clientesAtuais) {
      const tr = document.createElement('tr');
      criarCelula(tr, cliente.id);
      criarCelula(tr, cliente.nome);
      criarCelula(tr, cliente.email);
      const td = document.createElement('td');
      const editar = document.createElement('button');
      editar.textContent = 'Editar';
      editar.onclick = () => abrirEdicao(cliente);
      const excluir = document.createElement('button');
      excluir.textContent = 'Excluir';
      excluir.className = 'delete';
      excluir.onclick = () => excluirCliente(cliente);
      td.append(editar, excluir);
      tr.appendChild(td);
      lista.appendChild(tr);
    }
  } catch (erro) {
    mensagem.textContent = erro.message;
  }
}

function abrirNovo() {
  idEditando = null;
  form.reset();
  document.getElementById('tituloModal').textContent = 'Novo cliente';
  modal.showModal();
}
function abrirEdicao(cliente) {
  idEditando = cliente.id;
  document.getElementById('nome').value = cliente.nome;
  document.getElementById('email').value = cliente.email;
  document.getElementById('tituloModal').textContent = 'Editar cliente';
  modal.showModal();
}
async function excluirCliente(cliente) {
  if (!confirm(`Excluir o cliente ${cliente.nome}?`)) return;
  try {
    await requisicao(`/clientes/${encodeURIComponent(cliente.id)}`, { method: 'DELETE' });
    await carregar();
  } catch (erro) { mensagem.textContent = erro.message; }
}
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const botao = document.getElementById('salvar');
  botao.disabled = true;
  try {
    await requisicao(idEditando == null ? '/clientes' : `/clientes/${encodeURIComponent(idEditando)}`, {
      method: idEditando == null ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: document.getElementById('nome').value.trim(), email: document.getElementById('email').value.trim() })
    });
    modal.close();
    await carregar();
  } catch (erro) { alert(erro.message); }
  finally { botao.disabled = false; }
});
document.getElementById('novo').onclick = abrirNovo;
document.getElementById('fechar').onclick = () => modal.close();
document.getElementById('cancelar').onclick = () => modal.close();
carregar();
