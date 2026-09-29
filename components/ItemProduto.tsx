import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Produto } from '../types/produto';
import { formatarPreco } from '../utils/formatador';

interface ItemProdutoProps {
  produto: Produto;
}

/**
 * Componente que exibe um item da lista de produtos.
 * Atende ao RF3: exibe nome, preço formatado com vírgula e navega para detalhes com toque.
 */
export function ItemProduto({ produto }: ItemProdutoProps) {
  const router = useRouter();

  const handlePress = () => {
    // Passa apenas o identificador pela rota dinâmica (RT1)
    router.push({
      pathname: '/produtos/[id]',
      params: { id: produto.id },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressionado,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Produto ${produto.nome}, Preço ${formatarPreco(produto.preco)}, Situação ${produto.ativo ? 'Ativo' : 'Inativo'}`}
    >
      <View style={styles.conteudo}>
        <View style={styles.infoPrincipal}>
          <Text style={styles.nome} numberOfLines={2}>
            {produto.nome}
          </Text>
          <View style={styles.badgeSituacao}>
            <Text style={[styles.textoSituacao, produto.ativo ? styles.textoAtivo : styles.textoInativo]}>
              {produto.ativo ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
        </View>
        <Text style={styles.preco}>
          {formatarPreco(produto.preco)}
        </Text>
      </View>
      <Text style={styles.setaIndicadora}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pressionado: {
    backgroundColor: '#F1F5F9',
    opacity: 0.85,
  },
  conteudo: {
    flex: 1,
    paddingRight: 10,
  },
  infoPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
  },
  badgeSituacao: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  textoSituacao: {
    fontSize: 12,
    fontWeight: '600',
  },
  textoAtivo: {
    color: '#15803D',
  },
  textoInativo: {
    color: '#B91C1C',
  },
  preco: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0284C7',
  },
  setaIndicadora: {
    fontSize: 22,
    color: '#94A3B8',
    marginLeft: 6,
  },
});
