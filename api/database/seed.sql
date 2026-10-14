-- Dados fictícios para o ambiente de desenvolvimento.
-- Pode ser executado mais de uma vez: esvazia as tabelas antes de inserir.

TRUNCATE users, sessions, customers, invoices RESTART IDENTITY;

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Usuário Administrador', 'admin@gefina.com.br', 'placeholder', 'admin'),
  ('Ana Bessa', 'ana.bessa@gefina.com.br', 'placeholder', 'user'),
  ('Carlos Daniel', 'carlos.daniel@gefina.com.br', 'placeholder', 'user'),
  ('Eder Fagundes', 'eder.fagundes@gefina.com.br', 'placeholder', 'user'),
  ('Gustavo Hebe', 'gustavo.hebe@gefina.com.br', 'placeholder', 'user');

-- Oito clientes de Ana Bessa, sete de Carlos Daniel,
-- seis de Eder Fagundes e três de Gustavo Hebe.

INSERT INTO customers (user_id, name, email) VALUES
  (2, 'Alvorada Engenharia', 'contato@alvoradaengenharia.com.br'),
  (2, 'Bandeirante Logística', 'contato@bandeirantelogistica.com.br'),
  (2, 'Construtora Meridiano', 'contato@meridiano.com.br'),
  (2, 'Delta Mineração', 'contato@deltamineracao.com.br'),
  (2, 'Estação Alimentos', 'contato@estacaoalimentos.com.br'),
  (2, 'Fonte Clara', 'contato@fonteclara.com.br'),
  (2, 'Gráfica Aurora', 'contato@graficaaurora.com.br'),
  (2, 'Horizonte Seguros', 'contato@horizonteseguros.com.br'),
  (3, 'Ilha Verde', 'contato@ilhaverde.com.br'),
  (3, 'Jacarandá Móveis', 'contato@jacarandamoveis.com.br'),
  (3, 'Lumina Energia', 'contato@luminaenergia.com.br'),
  (3, 'Montanha Transportes', 'contato@montanhatransportes.com.br'),
  (3, 'Norte Têxtil', 'contato@nortetextil.com.br'),
  (3, 'Oficina Paulista', 'contato@oficinapaulista.com.br'),
  (3, 'Pedra Alta', 'contato@pedraalta.com.br'),
  (4, 'Quadrante Arquitetura', 'contato@quadrantearquitetura.com.br'),
  (4, 'Raiz Agropecuária', 'contato@raizagropecuaria.com.br'),
  (4, 'Sertão Cerâmica', 'contato@sertaoceramica.com.br'),
  (4, 'Tramontana Metais', 'contato@tramontanametais.com.br'),
  (4, 'União Farmacêutica', 'contato@uniaofarmaceutica.com.br'),
  (4, 'Vale Fértil', 'contato@valefertil.com.br'),
  (5, 'Xavante Papelaria', 'contato@xavantepapelaria.com.br'),
  (5, 'Zênite Consultoria', 'contato@zeniteconsultoria.com.br'),
  (5, 'Âncora Naval', 'contato@ancoranaval.com.br');

-- Oitenta e uma faturas pagas, com emissão ao longo do último ano.

INSERT INTO invoices (customer_id, amount, status, issue_date, due_date, created_at)
SELECT
  1 + n % 20,
  5000 + (n * 97391) % 7995000,
  'paid',
  CURRENT_DATE - n * 4,
  CURRENT_DATE - n * 4 + 15 + n % 46,
  CURRENT_DATE - n * 4 + n % 5
FROM generate_series(1, 81) AS n;

-- Sessenta e três faturas pendentes com vencimento futuro.

INSERT INTO invoices (customer_id, amount, status, issue_date, due_date, created_at)
SELECT
  1 + n % 20,
  5000 + (n * 61843) % 7995000,
  'pending',
  CURRENT_DATE - n % 10,
  CURRENT_DATE + 5 + n % 50,
  CURRENT_DATE - n % 10
FROM generate_series(1, 63) AS n;

-- Trinta e seis faturas pendentes com vencimento transcorrido.

INSERT INTO invoices (customer_id, amount, status, issue_date, due_date, created_at)
SELECT
  1 + n % 20,
  5000 + (n * 34567) % 7995000,
  'pending',
  CURRENT_DATE - 60 - n * 3,
  CURRENT_DATE - 30 - n * 3,
  CURRENT_DATE - 60 - n * 3 + n % 4
FROM generate_series(1, 36) AS n;
