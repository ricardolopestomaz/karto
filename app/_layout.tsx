import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ProdutosProvider } from '../context/ProdutosContext';

/**
 * Layout Raiz da aplicação Karto.
 * Atende aos requisitos:
 * - RT1: Utiliza navegação com Stack sem abas/Tabs.
 * - RT2: Monta uma ÚNICA instância do ProdutosProvider envolvendo o Stack,
 *        cobrindo todas as telas da aplicação.
 */
export default function RootLayout() {
  return (
    <ProdutosProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0284C7',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#F8FAFC',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Karto - Produtos',
          }}
        />
        <Stack.Screen
          name="cadastrar"
          options={{
            title: 'Cadastrar Produto',
          }}
        />
        <Stack.Screen
          name="produtos/[id]"
          options={{
            title: 'Detalhes do Produto',
          }}
        />
      </Stack>
    </ProdutosProvider>
  );
}
