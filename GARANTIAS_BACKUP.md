# Garantias de Segurança, Integridade e Backup de Dados - ImobiPro

Este documento descreve as políticas e mecanismos implementados para garantir a segurança dos dados, evitar perdas acidentais e manter a integridade do sistema em casos de exclusão, atualizações ou desastres.

## 1. Onde os dados são salvos
O sistema utiliza uma arquitetura de dupla camada de persistência:
- **Banco de Dados Principal na Nuvem (Google Firestore):** Todos os dados (imóveis, leads, usuários, configurações) são salvos de forma distribuída e resiliente na nuvem do Google Cloud.
- **Armazenamento Offline (IndexedDB Local):** Os dados são sincronizados no dispositivo do usuário, permitindo o funcionamento e acesso mesmo sem internet.

## 2. Como o sistema garante que exclusões são permanentes
As exclusões no sistema utilizam a técnica de **Tombstone** (marcador de exclusão / *Soft Delete* Permanente).
- Ao excluir um dado (imóvel, cliente, etc.), em vez de o registro ser apagado fisicamente, o sistema atualiza o documento adicionando uma flag `_deleted: true` e `deletedAt`.
- **Efeito:** O dado excluído deixa de ser carregado nas listagens, relatórios e no site público instantaneamente.
- **Prevenção de "Ressurreição":** Como o registro ainda existe (com a flag de excluído) no banco de dados central, se um dispositivo tentar enviar uma versão antiga deste dado ou o sistema tentar sincronizar de um modo offline, a versão antiga é bloqueada ou atualizada para "excluído", garantindo que um dado deletado não retorne. 
- Toda exclusão gera um log permanente de auditoria.

## 3. Como o sistema evita perda em atualizações (Proteção contra Updates)
- **Snapshot Pré-Restauração:** Antes de qualquer restauração de backup manual, o sistema tira automaticamente uma fotografia (*snapshot* de emergência) do estado atual.
- **Preservação de Campos:** Mudanças na estrutura de dados (schema) mantêm os campos antigos.
- **Sincronização Segura:** O sistema não possui *scripts* automáticos que limpam ou resetam bancos de dados (ex: retorno ao padrão de fábrica).

## 4. Como funciona o backup automático diário
O servidor conta com uma rotina que funciona ininterruptamente em background (CRON).
- **Frequência:** Todos os dias às **02:00 da manhã**, o sistema gera automaticamente um backup unificado (formato `.json`).
- **Conteúdo:** O arquivo contém todo o banco (imóveis, leads, clientes, visitas, chat, html blocks, etc.).
- **Auditoria:** O backup automático gera um log na tela de auditoria. 
- **Envio Automático:** O sistema anexa este arquivo JSON e envia imediatamente por e-mail para o administrador.

## 5. Como alterar o e-mail de destino do backup
O e-mail padrão configurado é `despachanteimobiliariorp@yahoo.com`, mas você tem total liberdade para alterá-lo a qualquer momento.
1. Acesse o painel de **Configurações do Site**.
2. Na aba **Geral**, encontre o campo "E-mail para Backup Automático".
3. Altere para o e-mail desejado e clique em "Salvar Configurações".
O próximo backup já será encaminhado para o novo endereço, sem necessidade de editar o código do sistema.

## 6. Como restaurar um backup
1. Acesse a aba **Segurança & Backup** nas Configurações do Site.
2. Na caixa roxa, clique no botão **Selecionar Arquivo .json** e escolha o arquivo de backup recebido no seu e-mail.
3. Confirme o alerta do navegador para iniciar a restauração.
4. **Nota Importante:** Ao restaurar, o sistema vai ignorar a recriação de registros que foram excluídos permanentemente de forma intencional *após* a data daquele backup, evitando que o lixo volte ("ressurreição acidental").

## 7. O que fazer se um dado sumir ou uma exclusão for revertida
Caso note algum comportamento anômalo ou tenha deletado algo por engano que precisa ser recuperado emergencialmente:
1. Vá até **Ações & Logs** e verifique o Histórico para ver quem excluiu ou alterou.
2. Acesse suas configurações de **Segurança & Backup** e restaure um dos arquivos de backup mais recentes que possui no e-mail.
3. Alternativamente, entre em contato com o suporte ou equipe técnica solicitando o "un-delete", pois como foi usado *Soft Delete*, o documento continua existindo na nuvem para restauração técnica se estritamente necessário e comandado por um administrador no banco diretamente.

---
*Relatório gerado automaticamente durante a entrega da feature.*
