import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
// TROQUE pela URL publica da sua API no Render (sem barra no final).
const API_URL = 'https://SEU-SERVICO.onrender.com';
export default function App() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  async function carregar() {
    setCarregando(true); setErro('');
    try {
      const resposta = await fetch(`${API_URL}/clientes`);
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      setClientes(await resposta.json());
    } catch (e) { setErro(`Nao foi possivel carregar: ${e.message}`); }
    finally { setCarregando(false); }
  }
  useEffect(() => { carregar(); }, []);
  return <View style={styles.tela}>
    <Text style={styles.titulo}>Clientes</Text>
    <Text style={styles.subtitulo}>Lista carregada pela API REST</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando && !clientes.length ? <ActivityIndicator /> : null}
    <FlatList data={clientes} keyExtractor={item => String(item.id)}
      refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar} />}
      ListEmptyComponent={!carregando ? <Text>Nenhum cliente cadastrado.</Text> : null}
      renderItem={({item}) => <View style={styles.cartao}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text>{item.email}</Text><Text style={styles.id}>ID: {item.id}</Text>
      </View>} />
  </View>;
}
const styles = StyleSheet.create({
  tela: { flex:1, padding:24, paddingTop:60, backgroundColor:'#f5f7fa' },
  titulo: { fontSize:30, fontWeight:'bold', color:'#172b4d' },
  subtitulo: { marginBottom:20, color:'#63748a' },
  cartao: { padding:18, backgroundColor:'white', borderRadius:12, marginBottom:12 },
  nome: { fontSize:18, fontWeight:'bold', marginBottom:4 },
  id: { color:'#63748a', marginTop:6, fontSize:12 },
  erro: { color:'#c62828', marginBottom:12 }
});
