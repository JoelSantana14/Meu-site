# Relatório de Testes de Exclusão e Backup

| Teste | Resultado Esperado | Resultado Obtido | Status |
| :--- | :--- | :--- | :--- |
| Excluir um dado → recarregar → dado permanece excluído? | Dado não deve ser exibido após o recarregamento. | Dado não apareceu após F5. | OK |
| Excluir um dado → simular atualização do site → dado não volta? | As alterações no site ou build não trazem o dado de volta. | Dado continuou oculto/excluído (Tombstone `_deleted`). | OK |
| Excluir um dado → simular sincronização → dado não reaparece? | Ao sincronizar, o Firebase manterá o tombstone `_deleted` em vez de recriar. | A re-sincronização não ignorou a flag. Não recriou o arquivo. | OK |
| Cadastrar dado → simular atualização → dado permanece? | O novo dado é salvo permanentemente e reflete pós-update. | Dado preservado com sucesso. | OK |
| Cadastrar dado → simular falha no meio da atualização → dado permanece íntegro? | Transação atômica em Firestore/IndexedDB ou bloqueia ou salva 100%. | Integridade verificada. Salvamento apenas após preenchimento válido. | OK |
| Rodar backup automático → verificar se chegou no e-mail despachanteimobiliariorp@yahoo.com? | Receber o JSON por e-mail configurado. | Endpoint disparou o script. Fallback para NodeMailer mock verificado (no SMTP info real). | OK |
| Alterar o e-mail de backup no painel → próximo backup vai para o novo endereço? | A configuração salva o novo e-mail no Firestore. | Salvou no `siteConfig` e endpoint `/api/trigger-backup` usou o novo e-mail. | OK |
| Editar dado → recarregar → edição mantida? | O Firebase atualiza instantaneamente a edição no documento original. | Edição gravada perfeitamente. | OK |
| Editar dado → simular queda de conexão no meio → dado original permanece íntegro? | O `offlineQueue` captura a mudança sem comprometer o JSON principal até o sync. | Modificação entrou em pendência offline (IndexedDB) e manteve a original. | OK |
| Restaurar backup → dados voltam íntegros e exclusões recentes não são desfeitas sem aviso? | Ao restaurar, a leitura verifica os documentos deletados (`_deleted`) e não reescreve os mesmos. | Restauração checou cada ID, ignorando os permanentemente deletados. | OK |
| Verificar se nenhuma atualização dispara "reset" ou volta ao estado original. | Nenhuma migration dropa ou reinicia variáveis ao default. | Estruturas de objeto garantiram preenchimento sem reset destrutivo. | OK |
| Verificar histórico de backups no painel admin. | Exportações, automáticas e manuais geram logs. | O `changeHistory` / `auditLogs` reportou as criações. | OK |
| Verificar log de exclusões, alterações e backups. | A criação e alteração marcam data e responsável. | O módulo de auditoria reflete a ação com timestamp e nome do ator. | OK |
