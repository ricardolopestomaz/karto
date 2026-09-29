import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProdutos } from '../context/ProdutosContext';

/**
 * Função utilitária para validar o preço de acordo com o RF2 e Cenário 4:
 * - Obrigatório
 * - Numérico
 * - Positivo (sem sinal)
 * - Até 2 casas decimais
 * - Separador pode ser vírgula ou ponto
 * - Cenário 4: 0, -5, abc, 12abc, 12,345 devem ser recusados
 */
export function validarPreco(valorTexto: string): { valido: boolean; mensagem?: string; valorNumerico?: number } {
  const textoLimpo = valorTexto.trim();

  if (!textoLimpo) {
    return { valido: false, mensagem: 'O preço do produto é obrigatório.' };
  }

  // Não permite sinais como '-' ou '+'
  if (textoLimpo.includes('-') || textoLimpo.includes('+')) {
    return { valido: false, mensagem: 'O preço deve ser positivo e não pode conter sinal (+ ou -).' };
  }

  // Rejeita qualquer caractere que não seja número, vírgula ou ponto
  const regexApenasNumerosEVirgulaPonto = /^[0-9.,]+$/;
  if (!regexApenasNumerosEVirgulaPonto.test(textoLimpo)) {
    return { valido: false, mensagem: 'O preço deve conter apenas números, vírgula ou ponto.' };
  }

  // Verifica se há mais de um separador (ponto ou vírgula)
  const ocorrenciasPonto = (textoLimpo.match(/\./g) || []).length;
  const ocorrenciasVirgula = (textoLimpo.match(/,/g) || []).length;
  if (ocorrenciasPonto + ocorrenciasVirgula > 1) {
    return { valido: false, mensagem: 'O preço pode conter apenas um único separador decimal.' };
  }

  // Regex para formato: dígitos com opcional separador (, ou .) e até duas casas decimais
  const regexFormato = /^\d+([.,]\d{1,2})?$/;
  if (!regexFormato.test(textoLimpo)) {
    return { valido: false, mensagem: 'O preço deve ter no máximo duas casas decimais (ex: 12, 12.5 ou 12,50).' };
  }

  const normalizado = textoLimpo.replace(',', '.');
  const numero = parseFloat(normalizado);

  if (isNaN(numero)) {
    return { valido: false, mensagem: 'O preço informado não é um número válido.' };
  }

  // Cenário 4: recusar 0 e valores negativos
  if (numero <= 0) {
    return { valido: false, mensagem: 'O preço deve ser um valor maior que zero.' };
  }

  return { valido: true, valorNumerico: numero };
}

/**
 * Validação do nome do produto (RF2):
 * - Obrigatório
 * - Pelo menos um caractere após remover espaços das extremidades
 */
export function validarNome(nome: string): { valido: boolean; mensagem?: string } {
  const nomeLimpo = nome.trim();
  if (nomeLimpo.length === 0) {
    return { valido: false, mensagem: 'O nome do produto é obrigatório e deve ter pelo menos 1 caractere.' };
  }
  return { valido: true };
}

/**
 * Tela de Cadastro de Produto.
 * Atende ao RF2 (Cadastro de produto) e RT3 (Código e interface):
 * - Campos controlados para nome, preço e controle ativo/inativo.
 * - Começa como ativo por padrão e permite alteração antes do cadastro.
 * - Validação estrita preservando dados digitados em caso de erro.
 * - Botão indisponível até preenchimento correto.
 * - Redirecionamento direto para a tela inicial sem alertas após o sucesso.
 */
export default function TelaCadastro() {
  const router = useRouter();
  const { adicionarProduto } = useProdutos();

  // Estados locais dos campos do formulário (RF2 & RT2)
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [ativo, setAtivo] = useState(true); // Começa como ativo por padrão

  // Estados de erro
  const [erroNome, setErroNome] = useState<string | null>(null);
  const [erroPreco, setErroPreco] = useState<string | null>(null);
  const [tentouSubmeter, setTentouSubmeter] = useState(false);

  // Validação dinâmica
  const validacaoNome = validarNome(nome);
  const validacaoPreco = validarPreco(preco);
  const formularioValido = validacaoNome.valido && validacaoPreco.valido;

  const handleNomeChange = (texto: string) => {
    setNome(texto);
    if (tentouSubmeter) {
      const res = validarNome(texto);
      setErroNome(res.valido ? null : (res.mensagem ?? null));
    }
  };

  const handlePrecoChange = (texto: string) => {
    setPreco(texto);
    if (tentouSubmeter) {
      const res = validarPreco(texto);
      setErroPreco(res.valido ? null : (res.mensagem ?? null));
    }
  };

  const limparFormulario = () => {
    setNome('');
    setPreco('');
    setAtivo(true);
    setErroNome(null);
    setErroPreco(null);
    setTentouSubmeter(false);
  };

  const handleCadastrar = () => {
    setTentouSubmeter(true);

    const checkNome = validarNome(nome);
    const checkPreco = validarPreco(preco);

    setErroNome(checkNome.valido ? null : (checkNome.mensagem ?? null));
    setErroPreco(checkPreco.valido ? null : (checkPreco.mensagem ?? null));

    if (!checkNome.valido || !checkPreco.valido || checkPreco.valorNumerico === undefined) {
      // Preserva dados nos campos e bloqueia cadastro conforme RF2
      return;
    }

    // Cadastro único na lista compartilhada
    adicionarProduto({
      nome: nome.trim(),
      preco: checkPreco.valorNumerico,
      ativo,
    });

    // Limpa o formulário para os valores padrão (RF2)
    limparFormulario();

    // Redireciona diretamente para a tela inicial (RF2)
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollConteudo}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardFormulario}>
            <Text style={styles.tituloCard}>Novo Produto</Text>
            <Text style={styles.instrucoes}>
              Preencha os campos obrigatórios abaixo para cadastrar o item no catálogo.
            </Text>

            {/* Campo Nome do Produto (RF2) */}
            <View style={styles.grupoCampo}>
              <Text style={styles.rotulo}>
                Nome do produto <Text style={styles.obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  erroNome ? styles.inputErro : null,
                ]}
                placeholder="Ex: Arroz 1 kg"
                placeholderTextColor="#94A3B8"
                value={nome}
                onChangeText={handleNomeChange}
                autoCapitalize="sentences"
                accessibilityLabel="Nome do produto"
              />
              {erroNome ? (
                <Text style={styles.textoErro}>{erroNome}</Text>
              ) : null}
            </View>

            {/* Campo Preço do Produto (RF2) */}
            <View style={styles.grupoCampo}>
              <Text style={styles.rotulo}>
                Preço em R$ <Text style={styles.obrigatorio}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  erroPreco ? styles.inputErro : null,
                ]}
                placeholder="Ex: 7,50 ou 12.90"
                placeholderTextColor="#94A3B8"
                value={preco}
                onChangeText={handlePrecoChange}
                keyboardType="numeric"
                autoCapitalize="none"
                accessibilityLabel="Preço do produto"
              />
              <Text style={styles.dicaCampo}>
                Aceita vírgula ou ponto com até duas casas decimais. Não use letras ou sinais.
              </Text>
              {erroPreco ? (
                <Text style={styles.textoErro}>{erroPreco}</Text>
              ) : null}
            </View>

            {/* Controle de Ativo / Inativo (RF2 & RT3) */}
            <View style={styles.grupoSituacao}>
              <View style={styles.infoSituacao}>
                <Text style={styles.rotuloSituacao}>Situação inicial:</Text>
                <Text
                  style={[
                    styles.textoSituacaoDestaque,
                    ativo ? styles.textoAtivo : styles.textoInativo,
                  ]}
                >
                  {ativo ? 'Ativo' : 'Inativo'}
                </Text>
                <Text style={styles.descricaoSituacao}>
                  {ativo
                    ? 'O produto aparecerá na lista de Produtos ativos.'
                    : 'O produto aparecerá na lista de Produtos inativos.'}
                </Text>
              </View>

              <View style={styles.controleSwitch}>
                <Switch
                  value={ativo}
                  onValueChange={setAtivo}
                  trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                  thumbColor={ativo ? '#16A34A' : '#94A3B8'}
                  accessibilityLabel="Alternar situação entre ativo e inativo"
                />
              </View>
            </View>

            {/* Botão Cadastrar Produto (RF2) */}
            <Pressable
              style={({ pressed }) => [
                styles.botaoCadastrar,
                !formularioValido && tentouSubmeter ? styles.botaoDesabilitado : null,
                pressed && styles.botaoPressionado,
              ]}
              onPress={handleCadastrar}
              accessibilityRole="button"
              accessibilityLabel="Cadastrar produto"
            >
              <Text style={styles.textoBotaoCadastrar}>Cadastrar produto</Text>
            </Pressable>

            {/* Botão Cancelar / Voltar */}
            <Pressable
              style={styles.botaoCancelar}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/');
                }
              }}
              accessibilityRole="button"
              accessibilityLabel="Cancelar e voltar para a lista"
            >
              <Text style={styles.textoBotaoCancelar}>Cancelar e voltar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollConteudo: {
    padding: 16,
    paddingBottom: 40,
  },
  cardFormulario: {
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
  tituloCard: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  instrucoes: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  grupoCampo: {
    marginBottom: 18,
  },
  rotulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  obrigatorio: {
    color: '#DC2626',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  inputErro: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  dicaCampo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  textoErro: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
    marginTop: 5,
  },
  grupoSituacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  infoSituacao: {
    flex: 1,
    paddingRight: 10,
  },
  rotuloSituacao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  textoSituacaoDestaque: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 2,
  },
  textoAtivo: {
    color: '#16A34A',
  },
  textoInativo: {
    color: '#DC2626',
  },
  descricaoSituacao: {
    fontSize: 12,
    color: '#64748B',
  },
  controleSwitch: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoCadastrar: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  botaoPressionado: {
    backgroundColor: '#0369A1',
    opacity: 0.9,
  },
  botaoDesabilitado: {
    backgroundColor: '#94A3B8',
  },
  textoBotaoCadastrar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  botaoCancelar: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoBotaoCancelar: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
