/**
 * Definições de tipos para o domínio de Produtos da aplicação Karto.
 * Atende aos requisitos RT3 (Código e interface) e RF1 (Dados do produto).
 */

export interface Produto {
  /** Identificador estável gerado no momento do cadastro */
  id: string;
  /** Nome do produto (pelo menos 1 caractere não vazio) */
  nome: string;
  /** Preço numérico em reais (valor positivo, até duas casas decimais) */
  preco: number;
  /** Situação do produto: true = Ativo, false = Inativo */
  ativo: boolean;
}

export interface DadosCadastroProduto {
  nome: string;
  preco: number;
  ativo: boolean;
}

export interface ProdutosContextType {
  /** Lista completa de produtos armazenada em memória */
  produtos: Produto[];
  /** Lista derivada contendo apenas produtos com situacao ativo === true */
  produtosAtivos: Produto[];
  /** Lista derivada contendo apenas produtos com situacao ativo === false */
  produtosInativos: Produto[];
  /** Cadastra um novo produto gerando um identificador estável único */
  adicionarProduto: (dados: DadosCadastroProduto) => Produto;
  /** Alterna a situação de um produto entre ativo e inativo de forma imutável */
  alternarSituacaoProduto: (id: string) => void;
  /** Busca um produto específico pelo identificador no estado atual */
  obterProdutoPorId: (id: string) => Produto | undefined;
}
