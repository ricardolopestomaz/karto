# Histórico da Sessão de IA (AI_SESSION.md)
*Registro dos prompts e interações realizados com a inteligência artificial durante o desenvolvimento do aplicativo Karto.*

---

### Interação 1: Configuração Inicial das Rotas
**Usuário:**
> "Como eu configuro o Expo Router com uma estrutura básica de Stack para ter uma tela inicial, uma tela de cadastro e uma tela de detalhes com parâmetro dinâmico de ID?"

**IA:**
> "Para configurar o Expo Router com Stack, você deve utilizar a estrutura baseada em arquivos dentro da pasta `app/`. 
> 1. No arquivo `app/_layout.tsx`, configure o componente `<Stack />` principal.
> 2. Crie a tela inicial em `app/index.tsx`.
> 3. Crie a tela de cadastro em `app/cadastrar.tsx`.
> 4. Para a tela dinâmica, crie uma pasta chamada `produtos` e dentro dela um arquivo `[id].tsx` (`app/produtos/[id].tsx`). Para ler o parâmetro na tela de detalhes, utilize o hook `useLocalSearchParams<{ id: string }>()`."

---

### Interação 2: Estrutura do Context API para os Produtos
**Usuário:**
> "Preciso criar um Context API simples em TypeScript para guardar a lista de produtos globalmente e permitir adicionar novos itens e alternar a situação deles entre ativo e inativo. Como faço isso sem complicar muito?"

**IA:**
> "Você pode criar um arquivo `context/ProdutosContext.tsx`. Aqui está um modelo simples e direto utilizando o `useState`:
> 
> ```tsx
> import React, { createContext, useContext, useState, ReactNode } from 'react';
> 
> export interface Produto {
>   id: string;
>   nome: string;
>   preco: number;
>   ativo: boolean;
> }
> 
> interface ProdutosContextData {
>   produtos: Produto[];
>   adicionarProduto: (nome: string, preco: number, ativo: boolean) => void;
>   alternarSituacaoProduto: (id: string) => void;
>   obterProdutoPorId: (id: string) => Produto | undefined;
> }
> 
> const ProdutosContext = createContext<ProdutosContextData>({} as ProdutosContextData);
> 
> export function ProdutosProvider({ children }: { children: ReactNode }) {
>   const [produtos, setProdutos] = useState<Produto[]>([]);
> 
>   const adicionarProduto = (nome: string, preco: number, ativo: boolean) => {
>     const novoProduto: Produto = {
>       id: Date.now().toString(),
>       nome,
>       preco,
>       ativo,
>     };
>     setProdutos((prev) => [...prev, novoProduto]);
>   };
> 
>   const alternarSituacaoProduto = (id: string) => {
>     setProdutos((prev) =>
>       prev.map((item) => (item.id === id ? { ...item, ativo: !item.ativo } : item))
>     );
>   };
> 
>   const obterProdutoPorId = (id: string) => {
>     return produtos.find((item) => item.id === id);
>   };
> 
>   return (
>     <ProdutosContext.Provider value={{ produtos, adicionarProduto, alternarSituacaoProduto, obterProdutoPorId }}>
>       {children}
>     </ProdutosContext.Provider>
>   );
> }
> 
> export const useProdutos = () => useContext(ProdutosContext);
> ```
> Basta envolver a sua aplicação com o `<ProdutosProvider>` no seu `_layout.tsx`."

---

### Interação 3: Validação de Entrada de Preço
**Usuário:**
> "Como posso validar no formulário se o preço digitado pelo usuário é um número válido maior que zero, aceitando vírgula ou ponto?"

**IA:**
> "Você pode tratar a string substituindo a vírgula por ponto antes de converter para número com `parseFloat`. Veja esta função simples de validação:
> 
> ```ts
> function validarPreco(valorStr: string): number | null {
>   // Substitui vírgula por ponto para aceitar formato brasileiro
>   const valorNormalizado = valorStr.replace(',', '.');
>   const numero = parseFloat(valorNormalizado);
>   
>   if (isNaN(numero) || numero <= 0) {
>     return null; // Inválido
>   }
>   return numero;
> }
> ```
> No componente de cadastro, se a função retornar `null`, você exibe uma mensagem de erro para o usuário."