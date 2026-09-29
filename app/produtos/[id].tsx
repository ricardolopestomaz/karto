import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProdutos } from '../../context/ProdutosContext';
import { formatarPreco } from '../../utils/formatador';

/**
 * Tela de Detalhes do Produto e Alteração da Situação.
 * Atende aos requisitos:
 * - RF4: Exibe nome, preço formatado e situação ("Ativo" ou "Inativo").
 * - RF4: Botão "Desativar produto" (se ativo) ou "Ativar produto" (se inativo).
 * - RF4: Ação altera imediatamente no contexto compartilhado sem sair da tela.
 * - RF4 / Cenário 8: Caso o id não exista, exibe "Produto não encontrado" com ação para retornar à tela inicial.
 * - RT1 / Cenário 9: Retorno funcional, inclusive se aberto sem histórico anterior.
 * - RT1: Recebe apenas o id pela rota e busca os dados atuais no contexto.
 */
export default function TelaDetalheProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { obterProdutoPorId, alternarSituacaoProduto } = useProdutos();

  // Busca o produto atualizado diretamente no contexto (sem cópia isolada na tela - RT1 & RT2)
  const produto = id ? obterProdutoPorId(id) : undefined;

  // Função de retorno seguro para a tela inicial com ou sem histórico (RT1 & Cenário 9)
  const handleRetorno = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // Tratamento de produto inexistente (RF4 & Cenário 8 & Cenário 9)
  if (!produto) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <Stack.Screen options={{ title: 'Produto Não Encontrado' }} />
        <View style={styles.containerNaoEncontrado}>
          <Text style={styles.iconeAlerta}>⚠️</Text>
          <Text style={styles.tituloNaoEncontrado}>Produto não encontrado</Text>
          <Text style={styles.subtituloNaoEncontrado}>
            O identificador informado não corresponde a nenhum produto cadastrado na lista atual.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.botaoVoltarInicio,
              pressed && styles.botaoVoltarInicioPressionado,
            ]}
            onPress={handleRetorno}
            accessibilityRole="button"
            accessibilityLabel="Retornar à tela inicial"
          >
            <Text style={styles.textoBotaoVoltarInicio}>Voltar para o início</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Alterna a situação no provider sem navegar para fora da tela (RF4)
  const handleAlternarSituacao = () => {
    alternarSituacaoProduto(produto.id);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: produto.nome || 'Detalhes do Produto' }} />
      <ScrollView contentContainerStyle={styles.scrollConteudo}>
        <View style={styles.cardDetalhes}>
          {/* Cabeçalho do Card */}
          <View style={styles.cardHeader}>
            <Text style={styles.tagIdentificador}>ID: {produto.id}</Text>
            <View
              style={[
                styles.badgeStatus,
                produto.ativo ? styles.badgeAtivo : styles.badgeInativo,
              ]}
            >
              <Text
                style={[
                  styles.textoBadgeStatus,
                  produto.ativo ? styles.textoBadgeAtivo : styles.textoBadgeInativo,
                ]}
              >
                {produto.ativo ? '● Ativo' : '○ Inativo'}
              </Text>
            </View>
          </View>

          {/* Nome do Produto */}
          <Text style={styles.rotuloCampo}>Nome do produto</Text>
          <Text style={styles.valorNome}>{produto.nome}</Text>

          {/* Preço do Produto */}
          <Text style={styles.rotuloCampo}>Preço de venda</Text>
          <Text style={styles.valorPreco}>{formatarPreco(produto.preco)}</Text>

          {/* Situação por escrito (RT3 e RF4: compreensível sem depender apenas de cor) */}
          <Text style={styles.rotuloCampo}>Situação cadastral</Text>
          <View style={styles.boxSituacao}>
            <Text style={styles.valorSituacao}>
              Situação atual: <Text style={styles.valorSituacaoDestaque}>{produto.ativo ? 'Ativo' : 'Inativo'}</Text>
            </Text>
            <Text style={styles.descricaoSituacao}>
              {produto.ativo
                ? 'Este produto está listado na seção "Produtos ativos" da tela inicial.'
                : 'Este produto está listado na seção "Produtos inativos" da tela inicial.'}
            </Text>
          </View>

          {/* Botão de Alteração da Situação (RF4) */}
          {/* Se produto ativo: 'Desativar produto' | Se inativo: 'Ativar produto' */}
          <Pressable
            style={({ pressed }) => [
              styles.botaoAcao,
              produto.ativo ? styles.botaoDesativar : styles.botaoAtivar,
              pressed && styles.botaoAcaoPressionado,
            ]}
            onPress={handleAlternarSituacao}
            accessibilityRole="button"
            accessibilityLabel={produto.ativo ? 'Desativar produto' : 'Ativar produto'}
          >
            <Text
              style={[
                styles.textoBotaoAcao,
                produto.ativo ? styles.textoBotaoDesativar : styles.textoBotaoAtivar,
              ]}
            >
              {produto.ativo ? 'Desativar produto' : 'Ativar produto'}
            </Text>
          </Pressable>

          {/* Botão de Retorno à Tela Inicial (RT1 & RF4) */}
          <Pressable
            style={({ pressed }) => [
              styles.botaoRetornar,
              pressed && styles.botaoRetornarPressionado,
            ]}
            onPress={handleRetorno}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a tela inicial"
          >
            <Text style={styles.textoBotaoRetornar}>← Voltar para a lista</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollConteudo: {
    padding: 16,
    paddingBottom: 40,
  },
  cardDetalhes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tagIdentificador: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeAtivo: {
    backgroundColor: '#DCFCE7',
  },
  badgeInativo: {
    backgroundColor: '#FEE2E2',
  },
  textoBadgeStatus: {
    fontSize: 13,
    fontWeight: '700',
  },
  textoBadgeAtivo: {
    color: '#15803D',
  },
  textoBadgeInativo: {
    color: '#B91C1C',
  },
  rotuloCampo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 4,
  },
  valorNome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  valorPreco: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0284C7',
  },
  boxSituacao: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 6,
  },
  valorSituacao: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  valorSituacaoDestaque: {
    fontWeight: '700',
  },
  descricaoSituacao: {
    fontSize: 13,
    color: '#64748B',
  },
  botaoAcao: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderWidth: 1.5,
  },
  botaoDesativar: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  botaoAtivar: {
    backgroundColor: '#F0FDF4',
    borderColor: '#16A34A',
  },
  botaoAcaoPressionado: {
    opacity: 0.8,
  },
  textoBotaoAcao: {
    fontSize: 16,
    fontWeight: '700',
  },
  textoBotaoDesativar: {
    color: '#DC2626',
  },
  textoBotaoAtivar: {
    color: '#16A34A',
  },
  botaoRetornar: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  botaoRetornarPressionado: {
    opacity: 0.7,
  },
  textoBotaoRetornar: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0284C7',
  },
  // Estilos para produto inexistente
  containerNaoEncontrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconeAlerta: {
    fontSize: 56,
    marginBottom: 16,
  },
  tituloNaoEncontrado: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtituloNaoEncontrado: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  botaoVoltarInicio: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  botaoVoltarInicioPressionado: {
    backgroundColor: '#0369A1',
  },
  textoBotaoVoltarInicio: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
