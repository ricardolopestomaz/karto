# Karto - Catálogo de Produtos para Pequenos Comerciantes

Projeto desenvolvido para a **Avaliação Individual P1** da disciplina **Desenvolvimento Webmobile (GRA.0734)**.
- **Curso:** Bacharelado em Ciência da Computação - Universidade Federal do Tocantins (UFT - Câmpus Palmas)
- **Docente:** Jackson Gomes de Souza
- **Aluno:** Ricardo Lopes Tomaz

---

## 1. Descrição do Projeto

O **Karto** é um aplicativo mobile desenvolvido com **React Native**, **Expo (SDK 57)** e **TypeScript**, utilizando o **Expo Router** com navegação em **Stack**. O objetivo é permitir que pequenos comerciantes consultem e gerenciem os produtos que oferecem, podendo cadastrá-los, visualizar detalhes e alternar sua situação entre **ativo** e **inativo**.

O aplicativo utiliza uma arquitetura baseada em **Context API** (`ProdutosProvider`), centralizando a lista de produtos no topo da árvore de componentes, mantendo os dados em memória durante toda a execução.

---

## 2. Tecnologias Utilizadas

- **React Native (v0.86.3)**: Framework para construção de interfaces nativas.
- **Expo (SDK 57)**: Plataforma e ecossistema de ferramentas para React Native.
- **Expo Router (v57)**: Roteamento baseado em arquivos (*filesystem-based routing*) com pilha de navegação nativa (`Stack`).
- **TypeScript**: Tipagem estática para maior robustez, manutenibilidade e segurança do código.
- **React Context API**: Gerenciamento de estado global compartilhado e imutável.
- **React Native Safe Area Context**: Gerenciamento de áreas seguras da tela (*notches*, barras de status).

---

## 3. Instruções de Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior instalada).
- Gerenciador de pacotes `npm` ou `yarn`.
- Aplicativo **Expo Go** instalado no smartphone físico (Android ou iOS) OU emulador configurado (Android Studio ou Xcode) OU navegador web.

### Passo a passo
1. Navegue até o diretório do projeto:
   ```bash
   cd c:\Users\srric\Documents\prova\Karto
   ```

2. Instale as dependências do projeto (caso necessário):
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```

4. Para testar:
   - **Android / iOS:** Leia o QR Code exibido no terminal utilizando o aplicativo **Expo Go** ou a câmera do celular.
   - **Navegador Web:** Pressione `w` no terminal para abrir o aplicativo no navegador.
   - **Emulador Android:** Pressione `a` no terminal.
   - **Simulador iOS (macOS):** Pressione `i` no terminal.

---

## 4. Plataforma Testada

- **Ambiente de Desenvolvimento:** Windows 11 (PowerShell) / Node.js v20.
- **Plataformas Testadas:**
  - Expo Go no Android / Emulador Android.
  - Navegador Web (Google Chrome) via `npx expo start --web`.
  - Verificação de tipos TypeScript via `npx tsc --noEmit`.

---

## 5. Limitações Conhecidas (Conforme Escopo da Avaliação)

Seguindo estritamente as diretrizes da **Seção 2 (Escopo do aplicativo)** do documento da avaliação:
1. **Persistência em memória:** Não há persistência em disco, `AsyncStorage`, banco de dados ou API externa. Os produtos permanecem disponíveis durante a navegação na mesma sessão; fechar ou recarregar a aplicação (*reload*) restaura o estado inicial da lista (que começa vazia).
2. **Edição e Exclusão:** Edição de nome ou preço e exclusão de produtos não fazem parte do escopo exigido e foram deliberadamente omitidos para não penalizar a pontuação do escopo principal.
3. **Autenticação, Vendas e Estoque:** Fora de escopo conforme especificação do trabalho.

---

## 6. Verificação de Tipos TypeScript

O projeto foi submetido à verificação estrita do compilador TypeScript:
```bash
npx tsc --noEmit
```

**Resultado:**
- **Status:** Sucesso (Exit code 0).
- **Erros encontrados:** 0 erros.
- Toda a base de código está estritamente tipada com interfaces bem definidas (`Produto`, `DadosCadastroProduto`, `ProdutosContextType`).

---

## 7. Conferência dos Cenários de Teste (Tabela 2 do PDF)

| Cenário | Descrição do Teste | Resultado Esperado | Implementação e Arquivo |
| :--- | :--- | :--- | :--- |
| **1. Partes vazias** | Iniciar app com lista vazia | Apresenta mensagens explicativas em "Produtos ativos" e "Produtos inativos". | [`components/SecaoProdutos.tsx`](./components/SecaoProdutos.tsx) e [`app/index.tsx`](./app/index.tsx) |
| **2. Cadastro ativo** | Cadastrar "Arroz 1 kg", preço 7,50, ativo | Aparece uma vez em ativos como `R$ 7,50` e limpa o formulário. | [`app/cadastrar.tsx`](./app/cadastrar.tsx) e [`utils/formatador.ts`](./utils/formatador.ts) |
| **3. Cadastro inativo** | Cadastrar "Café 250 g", preço 12.90, inativo | Aparece somente em inativos como `R$ 12,90`. | [`app/cadastrar.tsx`](./app/cadastrar.tsx) |
| **4. Entrada inválida** | Nome vazio ou espaços; Preço vazio, abc, 0, -5, 12abc, 12,345 | Recusa a submissão, exibe mensagem descritiva de erro e preserva os campos preenchidos. | [`app/cadastrar.tsx`](./app/cadastrar.tsx) nas funções `validarNome` e `validarPreco` |
| **5. Desativação** | Abrir "Arroz 1 kg" nos detalhes e clicar em "Desativar produto" | A situação muda para "Inativo", o botão muda para "Ativar produto", e ao voltar à home ele passa para "Produtos inativos". | [`app/produtos/[id].tsx`](./app/produtos/[id].tsx) e `alternarSituacaoProduto` no [`context/ProdutosContext.tsx`](./context/ProdutosContext.tsx) |
| **6. Reativação** | Abrir "Arroz 1 kg" novamente e clicar em "Ativar produto" | Volta para ativos. "Café 250 g" permanece inativo inalterado. | [`context/ProdutosContext.tsx`](./context/ProdutosContext.tsx) |
| **7. Identidade e navegação** | Cadastrar outro "Arroz 1 kg" com preço 9 | Ambos possuem o mesmo nome mas IDs distintos. Alternar a situação de um não afeta o outro. | Identificador único gerado por `gerarIdentificador()` em [`context/ProdutosContext.tsx`](./context/ProdutosContext.tsx) |
| **8. ID inexistente** | Acessar rota com ID ausente (ex: `/produtos/teste-invalido`) | Apresenta "Produto não encontrado", tela continua utilizável e exibe botão para voltar ao início. | [`app/produtos/[id].tsx`](./app/produtos/[id].tsx) |
| **9. Retorno sem histórico** | Abrir detalhe diretamente sem histórico | Botão de retorno verifica `router.canGoBack()` e redireciona com segurança para `/`. | [`app/produtos/[id].tsx`](./app/produtos/[id].tsx) na função `handleRetorno` |

---

## 8. Respostas às Quatro Perguntas da Seção 9 (Explicação Individual)

As respostas abaixo apontam pontualmente as funções, arquivos e conceitos da implementação:

### Pergunta 1: Onde o provider está montado? Por que essa posição permite compartilhar a lista entre cadastro, tela inicial e detalhe?
- **Onde está montado:** O `ProdutosProvider` está montado no arquivo [`app/_layout.tsx`](./app/_layout.tsx), envolvendo o componente `<Stack />` raiz.
- **Por quê:** No React, o estado provido por um `Context.Provider` fica disponível para todos os componentes descendentes na árvore de renderização. Ao envelopar o `<Stack />` raiz no `_layout.tsx`, qualquer rota gerenciada pelo Expo Router (`app/index.tsx`, `app/cadastrar.tsx` e `app/produtos/[id].tsx`) é filha direta do provider, compartilhando a mesma instância de estado e suas funções sem necessidade de *prop drilling* ou de passar dados via parâmetros de navegação.

### Pergunta 2: Quais dados ficam no estado local, quais ficam no provider e quais são derivados? Indiquem exemplos do aplicativo.
- **Estado Local (`useState` no componente):**
  - Ficam na tela de formulário [`app/cadastrar.tsx`](./app/cadastrar.tsx): `nome` (string), `preco` (string de entrada), `ativo` (booleano), `erroNome`, `erroPreco` e `tentouSubmeter`. Esses dados pertencem ao ciclo de vida do formulário e não devem poluir o estado global enquanto o usuário ainda está editando.
- **Estado no Provider (`context/ProdutosContext.tsx`):**
  - `produtos` (`useState<Produto[]>([])`): a lista central com a fonte única da verdade contendo todos os produtos cadastrados com identificador estável gerado no cadastro.
- **Dados Derivados (`useMemo` a partir da lista no provider):**
  - `produtosAtivos` (`produtos.filter(p => p.ativo)`) e `produtosInativos` (`produtos.filter(p => !p.ativo)`), calculados dinamicamente no [`context/ProdutosContext.tsx`](./context/ProdutosContext.tsx) sem duplicar arrays no estado, evitando inconsistências.

### Pergunta 3: Como a rota identifica o produto? Expliquem por que o detalhe consulta o contexto em vez de receber uma cópia dos dados.
- **Identificação da Rota:** O produto é identificado através da rota dinâmica com parâmetro de caminho [`app/produtos/[id].tsx`](./app/produtos/[id].tsx). O identificador é extraído pelo hook `useLocalSearchParams<{ id: string }>()`.
- **Por que consulta o contexto em vez de receber uma cópia:** 
  1. **Evitar dessincronização de estado (*Single Source of Truth*):** Se os dados fossem passados serializados nos parâmetros de rota, a tela de detalhes teria uma cópia estática (*snapshot*). Ao alterar a situação ou se houvesse mutações, a tela de detalhes e a lista principal poderiam divergir.
  2. **Consistência em acessos diretos:** Se o usuário recarregar a rota ou acessá-la diretamente por URL (como no cenário de retorno sem histórico ou id inexistente), passar apenas o `id` permite que o componente busque a informação atualizada diretamente na fonte da verdade (`obterProdutoPorId(id)`).

### Pergunta 4: Qual função ativa ou desativa um produto? Expliquem a atualização sem mutação e o que acontece com os produtos ao recarregar o aplicativo.
- **Função Responsável:** A função `alternarSituacaoProduto(id: string)`, localizada no arquivo [`context/ProdutosContext.tsx`](./context/ProdutosContext.tsx) e consumida na tela [`app/produtos/[id].tsx`](./app/produtos/[id].tsx).
- **Atualização Sem Mutação (Imutabilidade):**
  A função utiliza o callback do `setProdutos` recebendo `prevProdutos` e o método `.map()`:
  ```ts
  setProdutos((prevProdutos) =>
    prevProdutos.map((item) => {
      if (item.id === id) {
        return { ...item, ativo: !item.ativo }; // Cria um NOVO objeto com a propriedade alterada
      }
      return item; // Mantém a referência dos demais
    })
  );
  ```
  Isso não altera (*muta*) o array existente nem altera o objeto em memória diretamente, gerando uma nova referência de array e um novo objeto para o item modificado. Isso permite ao React detectar a mudança por comparação rasa (*shallow compare*) e disparar a re-renderização precisa das telas.
- **Ao recarregar o aplicativo:** Como a lista está armazenada exclusivamente na memória RAM da aplicação via `useState` no React e não utiliza persistência em disco (`AsyncStorage`, SQLite, etc.), recarregar (*reload*) ou reiniciar o aplicativo limpa a memória e restaura o estado inicial `[]` (lista vazia), conforme especificado no escopo do projeto.

---

## 9. Fontes Consultadas

- Documentação Oficial do Expo Router: [https://docs.expo.dev/router/introduction/](https://docs.expo.dev/router/introduction/)
- Documentação Oficial do React (Context API & Immutability): [https://react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context)
- Documentação do React Native (Components & APIs): [https://reactnative.dev/docs/components-and-apis](https://reactnative.dev/docs/components-and-apis)
