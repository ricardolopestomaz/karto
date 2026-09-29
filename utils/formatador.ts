/**
 * Utilitários para formatação e validação de dados da aplicação Karto.
 */

/**
 * Formata um valor numérico para o padrão de moeda brasileiro: "R$ 12,50".
 * Sempre utiliza vírgula como separador de casas decimais e 2 casas decimais.
 */
export function formatarPreco(valor: number): string {
  const fixo = valor.toFixed(2);
  const comVirgula = fixo.replace('.', ',');
  return `R$ ${comVirgula}`;
}
