import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Produto, DadosCadastroProduto, ProdutosContextType } from '../types/produto';

const ProdutosContext = createContext<ProdutosContextType | undefined>(undefined);

/**
 * Gera um identificador único, estável e sequencial/aleatório para o produto no momento do cadastro.
 */
function gerarIdentificador(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

interface ProdutosProviderProps {
  children: ReactNode;
}

/**
 * Provider único para compartilhamento do estado dos produtos na hierarquia do app.
 * Atende ao requisito RT2:
 * - Mantém a única fonte da verdade da lista de produtos em memória.
 * - Realiza atualizações 100% imutáveis baseadas no estado anterior (prev).
 * - Calcula valores derivados (ativos e inativos) diretamente da lista principal.
 */
export function ProdutosProvider({ children }: ProdutosProviderProps) {
  // Estado único em memória: começa vazio conforme RF1 e escopo do aplicativo
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Operação de cadastro: adiciona de forma imutável usando o estado anterior
  const adicionarProduto = (dados: DadosCadastroProduto): Produto => {
    const novoProduto: Produto = {
      id: gerarIdentificador(),
      nome: dados.nome,
      preco: dados.preco,
      ativo: dados.ativo,
    };

    setProdutos((prevProdutos) => [...prevProdutos, novoProduto]);
    return novoProduto;
  };

  // Operação de alteração da situação: atualiza sem mutar o array ou os objetos existentes
  const alternarSituacaoProduto = (id: string) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((item) => {
        if (item.id === id) {
          // Cria um novo objeto com a propriedade ativo invertida (imutabilidade)
          return { ...item, ativo: !item.ativo };
        }
        return item;
      })
    );
  };

  // Consulta por id direto da fonte da verdade
  const obterProdutoPorId = (id: string): Produto | undefined => {
    return produtos.find((item) => item.id === id);
  };

  // Partes derivadas calculadas dinamicamente a partir da mesma lista
  const produtosAtivos = useMemo(() => {
    return produtos.filter((p) => p.ativo);
  }, [produtos]);

  const produtosInativos = useMemo(() => {
    return produtos.filter((p) => !p.ativo);
  }, [produtos]);

  const valorContexto: ProdutosContextType = {
    produtos,
    produtosAtivos,
    produtosInativos,
    adicionarProduto,
    alternarSituacaoProduto,
    obterProdutoPorId,
  };

  return (
    <ProdutosContext.Provider value={valorContexto}>
      {children}
    </ProdutosContext.Provider>
  );
}

/**
 * Hook customizado para consumo seguro do contexto de produtos.
 */
export function useProdutos(): ProdutosContextType {
  const context = useContext(ProdutosContext);
  if (!context) {
    throw new Error('useProdutos deve ser utilizado dentro de um ProdutosProvider');
  }
  return context;
}
