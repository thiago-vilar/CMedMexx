# CMedMexx

## Sobre o Projeto
O CMedMexx é um sistema de gerenciamento de consultas médicas que permite a pacientes agendarem, cancelarem ou reagendarem consultas com médicos, além de permitir que médicos gerenciem suas agendas. O sistema é projetado para proporcionar uma experiência intuitiva aos usuários e uma gestão eficiente e interativa para clínicas e hospitais.

## Entidades Principais
- **Paciente**: Usuários que procuram atendimento médico.
- **Médico**: Profissionais de saúde que fornecem consultas.
- **Sala de Atendimento**: Locais físicos onde as consultas são realizadas.
- **Funcionário de Hospital**: Usuários cadastrados que disponibilizam ou alugam salas para os médicos realizarem os atendimentos.

## Funcionalidades Principais
1. **Disponibilização de Salas de Atendimento**: Funcionários de hospitais ou clínicas podem disponibilizar ou alugar salas para os médicos.
2. **Visualização de Horários**: Pacientes podem consultar os dias e horários disponíveis em um calendário interativo, apresentado de forma responsiva com informações sobre o hospital, o médico e o horário disponível.
3. **Agendamento de Consultas**: Pacientes podem escolher um médico e agendar uma consulta.
4. **Gestão de Agendas**: Médicos recebem solicitações de consulta e podem gerenciar suas agendas.
5. **Manutenção de Consultas**: Médicos podem confirmar ou cancelar consultas.
6. **Prevenção de Conflitos de Horário**: O sistema evita sobreposições no agendamento.
7. **Notificações de Consulta**: Pacientes recebem confirmações e lembretes diretamente no sistema.

## Regras de Negócio
- Consultas são agendadas conforme a disponibilidade e os horários de funcionamento.
- Pacientes devem receber lembretes antes das consultas.

## Segurança
- Acesso restrito a pacientes registrados para reserva de horários.
- Cadastramento criptografado com tokens JWT.

## Interface de Usuário
- Interface intuitiva com visualização de horários em calendário.
- Opções claras para agendamento, cancelamento e reagendamento de consultas.

## Relatórios
- Relatórios detalhados sobre disponibilidade de salas, aluguéis, agendamentos e confirmações.

## Tecnologias Utilizadas
- **Frontend**: REACTJS 18
- **Backend**: .NET 8 (C#)
- **Banco de Dados**: PostgreSQL 16

## Arquitetura do Projeto
- **Frontend**: Aplicação Single Page Application (SPA).
- **Backend**: API RESTful.

## Como Contribuir
Para contribuir para o projeto CMedMexx, siga as diretrizes disponíveis nos documentos de contribuição.

## Licença
Este projeto é licenciado sob a Licença XYZ. Veja o arquivo `LICENSE` para mais detalhes.

## Contato
- **Email**: [oceanocabral@gmail.com](mailto:oceanocabral@gmail.com)
- **GitHub**: [thiago-vilar](https://github.com/thiago-vilar/CMedMexx)
