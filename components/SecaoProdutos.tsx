import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Produto } from '../types/produto';
import { ItemProduto } from './ItemProduto';

interface SecaoProdutosProps {
  titulo: string;
  produtos: Produto[];
  mensagemVazia: string;
}

/**
 * Componente que renderiza uma seção da lista ("Produtos ativos" ou "Produtos inativos").
 * Atende ao RF3:
 * - Apresenta o título da seção.
 * - Renderiza cada produto com seu identificador como chave (RT3).
 * - Exibe mensagem explicativa caso não existam itens na seção.
 */
export function SecaoProdutos({ titulo, produtos, mensagemVazia }: SecaoProdutosProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.contador}>({produtos.length})</Text>
      </View>

      {produtos.length === 0 ? (
        <View style={styles.caixaVazia}>
          <Text style={styles.textoVazio}>{mensagemVazia}</Text>
        </View>
      ) : (
        produtos.map((produto) => (
          <ItemProduto key={produto.id} produto={produto} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  contador: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  caixaVazia: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoVazio: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
