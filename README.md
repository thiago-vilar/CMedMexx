# CMedMexx

## Sobre o Projeto
O CMedMexx é um sistema de gerenciamento de consultas médicas que permite a pacientes agendarem, cancelarem ou reagendarem consultas com médicos, além de permitir que médicos gerenciem suas agendas. O sistema é projetado para proporcionar uma experiência intuitiva aos usuárioscom design interativo, além de uma gestão eficiente para clínicas, hospitais, médicos e pacientes.

## Entidades Principais
- **Paciente**: Usuários que procuram atendimento médico.
- **Médico**: Profissionais de saúde que fornecem consultas.
- **Sala de Atendimento**: Locais físicos onde as consultas são realizadas.
- **Funcionário de Hospital**: Usuários cadastrados que disponibilizam ou alugam salas para os médicos realizarem os atendimentos.

## Funcionalidades Principais
1. **Disponibilização de Salas de Atendimento**: Funcionários de hospitais ou clínicas podem disponibilizar ou alugar salas para os médicos.
2. **Médicos Reservam Salas de Atendimento**: Qualquer médico logado no sismema alugar salas e disponibilizar consultas para captação de pacientes.
3. **Visualização de Horários**: Pacientes podem consultar os dias e horários disponíveis em um calendário interativo, apresentado de forma responsiva com informações sobre o hospital, o médico e o horário disponível.
4. **Agendamento de Consultas**: Pacientes podem escolher um médico e agendar uma consulta.
5. **Gestão de Agendas**: Médicos recebem solicitações de consulta e podem gerenciar suas agendas.
6. **Manutenção de Consultas**: Médicos podem confirmar ou cancelar consultas.
7. **Prevenção de Conflitos de Horário**: O sistema evita sobreposições no agendamento.
8. **Notificações de Consulta**: Pacientes recebem confirmações e lembretes diretamente no sistema.

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

## Como Executar
- **Pré-Requisito**: Git, Node.js, .NET Core SDK, PostgreSQL
- **Clonagem do Repositório**: git clone https://github.com/thiago-vilar/CMedMexx.git
- **WebPAI**: cd cd WebAPI
- dotnet restore
- dotnet run
- **Configuração de Banco de Dados**: Este projeto utiliza o Entity Framework para gerenciar o banco de dados através de migrations.
    - Abra o arquivo de configuração appsettings.json localizado no diretório do projeto .NET.
    - Modifique a string de conexão DefaultConnection para apontar para o seu banco de dados PostgreSQL.
    - cd WebAPI/
    - dotnet ef database update
    - dotnet tool install --global dotnet-ef  
- **frontend**: cd frontend
- npm install
- npm start

## Interface de Usuário
Cada perfil de usuário logado no sistema segue uma rota diferente, os usuário podem ser do tipo Funcionário do Hospital/Clínica('hospitalstaff), Médicos('doctor'), Pacientes('patient').
Aqui está uma visão da nossa interface de agendamento e gestão interativa:

http://localhost:3000/HospitalStaffView
![image](https://github.com/thiago-vilar/CMedMexx/assets/104908140/99e03258-129c-41b1-a270-216d8d129e46)
![image](https://github.com/thiago-vilar/CMedMexx/assets/104908140/8bb93d42-c01e-414a-b053-75a3b046dea8)
Imagens do Funcionário do Hospital: disponibilizam salas para alocação, usu dos médicos. Os registros ficam evidenciados no calendário e tmbém aparecem numa lista completa de todas as salas que foram disponibilizadas. Cada Funcionário ('hospitalstaff') só poderá visualizar a própria disponibilidade de salas.

http://localhost:3000/DoctorView
![image](https://github.com/thiago-vilar/CMedMexx/assets/104908140/584cdf22-dd0e-42de-86c0-a7962df8ebe1)
![image](https://github.com/thiago-vilar/CMedMexx/assets/104908140/f74ad3fe-156e-443f-85c3-c388e99197e2)
Imagens do Médido: visão do médico sobre o calendário com todas as salas disponíveis no sistema para alocação. No painel de Cards, abaixo do calendário, a seção SALAS DISPONÍVES PARA ALUGUEL apresentam Cards em branco que são salas disponíveis, em azul estão alugadas por este médico. Na seção AGENDA DE CONSULTAS Cards amarelos representam as consultas agendadas(requisitadas pelo paciente) e Cards verdes são consultas confirmadas pelos médicos.

http://localhost:3000/PatientView
![image](https://github.com/thiago-vilar/CMedMexx/assets/104908140/5c0fef29-13fa-4cb2-93b2-e9a18e952bfd)
![image](https://github.com/thiago-vilar/CMedMexx/assets/104908140/7b5a8f38-d734-4630-b39f-f50298a1c7bd)
![image](https://github.com/thiago-vilar/CMedMexx/assets/104908140/9459cf45-4c32-45d5-9c58-1ee81c2e5706)
![image](https://github.com/thiago-vilar/CMedMexx/assets/104908140/79c74e8f-43ca-4f0e-a1a6-5f438be125cc)
Imagens do Paciente: no painel dos pacientes, o usuário logado pode visualizar no calendário datas de consultas disponíveis e agendar diretamente no calendário ou escolher um Card para solicitar consulta

## Como Contribuir
Para contribuir para o projeto CMedMexx, siga as diretrizes disponíveis nos documentos de contribuição.

## Licença
Este projeto é licenciado sob a Licença XYZ. Veja o arquivo `LICENSE` para mais detalhes.

## Contato
- **Email**: [oceanocabral@gmail.com](mailto:oceanocabral@gmail.com)
- **GitHub**: [thiago-vilar](https://github.com/thiago-vilar)

  
