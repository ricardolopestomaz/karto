import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProdutos } from '../context/ProdutosContext';
import { SecaoProdutos } from '../components/SecaoProdutos';

/**
 * Tela Inicial do Karto.
 * Atende ao RF3 (Lista na tela inicial):
 * - Apresenta produtos divididos em "Produtos ativos" e "Produtos inativos".
 * - Cada produto aparece em apenas uma das partes.
 * - Mensagens explicativas para seções vazias.
 * - Navegação para cadastro e para detalhes de cada produto.
 */
export default function TelaInicial() {
  const router = useRouter();
  const { produtosAtivos, produtosInativos } = useProdutos();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollConteudo}
        showsVerticalScrollIndicator={true}
      >
        {/* Cabeçalho da Lista e Ação de Cadastro */}
        <View style={styles.topoContainer}>
          <View>
            <Text style={styles.subtituloApp}>Catálogo Comercial</Text>
            <Text style={styles.descricaoApp}>
              Consulte e gerencie a situação de seus produtos.
            </Text>
          </View>

          {/* Botão de navegação para a tela de cadastro (RF2 & RT1) */}
          <Pressable
            style={({ pressed }) => [
              styles.botaoCadastrar,
              pressed && styles.botaoCadastrarPressionado,
            ]}
            onPress={() => router.push('/cadastrar')}
            accessibilityRole="button"
            accessibilityLabel="Ir para tela de cadastro de produto"
          >
            <Text style={styles.textoBotaoCadastrar}>+ Cadastrar Produto</Text>
          </Pressable>
        </View>

        {/* Seção 1: Produtos Ativos (RF3) */}
        <SecaoProdutos
          titulo="Produtos ativos"
          produtos={produtosAtivos}
          mensagemVazia="Nenhum produto ativo cadastrado no momento."
        />

        {/* Seção 2: Produtos Inativos (RF3) */}
        <SecaoProdutos
          titulo="Produtos inativos"
          produtos={produtosInativos}
          mensagemVazia="Nenhum produto inativo no momento."
        />
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
  topoContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  subtituloApp: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  descricaoApp: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  botaoCadastrar: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  botaoCadastrarPressionado: {
    backgroundColor: '#0369A1',
    opacity: 0.9,
  },
  textoBotaoCadastrar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
