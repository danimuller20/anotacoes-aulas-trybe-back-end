# Principais comandos

####Compreender o que é uma query SQL e quais são seus tipos de comando
* Gerar valores com **SELECT**;
```sql
SELECT now();
SELECT 20 * 2;
SELECT 18 AS idade;
SELECT 'Rafael', 'Martins', 25, 'Desenvolvedor Web';
```
* Selecionar colunas individualmente com **SELECT**;
```sql
SELECT * FROM sakila.city;
SELECT city FROM sakila.city;
SELECT first_name, last_name FROM sakila.customer;
```
* Renomear e gerar colunas em uma consulta com **AS**;
```sql
SELECT 'Rafael' AS nome, 'Martins' AS sobrenome, 25 AS idade, 'Desenvolvedor Web' AS 'Área de atuação';
```
* Concatenar colunas e valores com **CONCAT**;
```sql
SELECT CONCAT(first_name, ' ', last_name) AS 'Nome Completo' FROM sakila.actor;
```
* Remover dados duplicados em uma consulta com **DISTINCT**;
_CREATE TABLE_:
```sql
CREATE DATABASE `Escola`;
CREATE TABLE IF NOT EXISTS Escola.Alunos (
    `Nome` VARCHAR(7) CHARACTER SET utf8,
    `Idade` INT
);
INSERT INTO Escola.Alunos VALUES
    ('Rafael', 25),
    ('Amanda', 30),
    ('Roberto', 45),
    ('Carol', 19),
    ('Amanda', 25);
```

_DISTINCT_
```SQL
SELECT DISTINCT Nome FROM Escola.Alunos;
SELECT DISTINCT Idade FROM Escola.Alunos;
SELECT DISTINCT Nome, Idade FROM Escola.Alunos;
```
* Contar a quantidade de resultados em uma consulta com **COUNT**;
```sql
SELECT COUNT(password) FROM sakila.staff;
SELECT COUNT(*) FROM sakila.staff;
SELECT COUNT(email) FROM sakila.staff;
SELECT  COUNT(picture) FROM sakila.staff;
```
* Limitar a quantidade de resultados em uma consulta com **LIMIT**;
```sql
SELECT COUNT(*) FROM sakila.rental;
SELECT * FROM sakila.rental;
SELECT * FROM sakila.rental LIMIT 10;
```
* Pular resultados em uma consulta com **OFFSET**;
OFFSET: Quantidade de linhas puladas:
```sql
SELECT * FROM sakila.rental LIMIT 10 OFFSET 3;
```
* Ordenar os resultados de uma consulta com **ORDER BY**;
```SQL
SELECT * FROM sakila.actor
ORDER BY first_name;

SELECT * FROM sakila.actor
ORDER BY first_name DESC;
```

* Filtrar resultados de consultas com o **WHERE**;

```sql
SELECT * FROM sakila.actor
WHERE last_name = 'DAVIS';

SELECT * FROM sakila.actor
WHERE actor_id = 101;
```

* Utilizar operadores **booleanos** e **relacionais** em consultas;
```sql
SELECT * FROM sakila.film
WHERE length > 50
ORDER BY length;

SELECT * FROM sakila.film
WHERE title <> 'ALIEN CENTER'
AND replacement_cost > 20;

SELECT * FROM sakila.film
WHERE rating = 'G'
OR rating = 'PG'
OR rating = 'PG-13';

SELECT * FROM sakila.rental
WHERE return_date IS NULL;

SELECT * FROM sakila.staff
WHERE active IS TRUE;

SELECT * FROM sakila.address
WHERE address2 IS NOT NULL;

SELECT * FROM sakila.film
WHERE title NOT LIKE 'academy%';

SELECT * FROM sakila.payment
WHERE (amount = 0.99 OR amount = 2.99) AND staff_id = 2;
```

Operadores booleanos:
```sql
=   IGUAL
>   MAIOR QUE
<   MENOR QUE
>=  MAIOR QUE OU IGUAL
<=  MENOR QUE OU IGUAL
<>  DIFERENTE DE
AND OPERADOR LÓGICO E
OR  OPERADOR LÓGICO OU
NOT NEGAÇÃO
IS  COMPARA COM VALORES BOOLEANOS (TRUE, FALSE, NULL)
```

* Criar consultas mais dinâmicas e maleáveis com **LIKE**;
```sql
SELECT * FROM sakila.film
WHERE title LIKE '___GON%' AND description LIKE '%DOCUMENTARY%';

SELECT * FROM sakila.film
WHERE title LIKE '%ACADEMY' OR title LIKE 'MOSQUITO%';

SELECT * FROM sakila.film
WHERE description LIKE '%MONKEY%' AND description LIKE '%SUMO%';
```

* Fazer consultas que englobam uma faixa de resultados com **IN** e **BETWEEN**;

```sql
SELECT * FROM sakila.rental
WHERE customer_id IN (269, 239, 126, 399, 142);

SELECT * FROM sakila.address 
WHERE district IN ('QLD', 'Nagasaki', 'California', 'Attika', 'Mandalay', 'Nantou', 'Texas');

SELECT rental_id, rental_date FROM sakila.rental
WHERE rental_date
BETWEEN '2005-05-27' AND '2005-07-17';

SELECT title, release_year, rental_duration FROM sakila.film
WHERE rental_duration
BETWEEN 3 AND 6
ORDER BY title, rental_duration;
```

* Encontrar e separar resultados que incluem datas;

```sql
SELECT * FROM sakila.payment
WHERE DATE(payment_date) = '2005-07-31';

SELECT * FROM sakila.payment
WHERE payment_date LIKE '2005-07-31%';

SELECT * FROM sakila.payment
WHERE payment_date LIKE '2005-08-20 00:30:52';

SELECT * FROM sakila.payment
WHERE DATE(payment_date) = '2005-07-28' AND HOUR(payment_date) >= 22
```
* Funções de data e horário:
```sql
SELECT DATE(payment_date) FROM sakila.payment; -- YYYY-MM-DD
SELECT YEAR(payment_date) FROM sakila.payment; -- Ano
SELECT MONTH(payment_date) FROM sakila.payment; -- Mês
SELECT DAY(payment_date) FROM sakila.payment; -- Dia
SELECT HOUR(payment_date) FROM sakila.payment; -- Hora
SELECT MINUTE(payment_date) FROM sakila.payment; -- Minuto
SELECT SECOND(payment_date) FROM sakila.payment; -- Segundo
SELECT UUID() -- Gera chaves automáticas
```
# Tipos de Query

####DDL : Data Definition Language - todos os comandos que lidam com o esquema, a descrição e o modo como os dados devem existir em um banco de dados:

* CREATE : Para criar bancos de dados, tabelas, índices, views, procedures, functions e triggers
* ALTER : Para alterar a estrutura de qualquer objeto
* DROP : Permite deletar objetos
* TRUNCATE : Apenas esvazia os dados dentro de uma tabela, mas a mantém no banco de dados

####DML : Data Manipulation Language - Comandos que são usados para manipular dados. São utilizados para armazenar, modificar, buscar e excluir dados em um banco de dados. Os comandos e usos mais comuns nesta categoria são:

* SELECT : usado para buscar dados em um banco de dados
* INSERT : insere dados em uma tabela;

```sql
INSERT INTO sakila.actor (first_name, last_name)
	SELECT first_name, last_name FROM sakila.staff;

INSERT INTO sakila.staff (first_name, last_name, address_id, email, store_id, username, `password`)
VALUES ('Maria', 'Sousa', '1', 'Maria.sousa@sakilastaff.com', '1', 'Maria', UUID());

INSERT INTO sakila.staff (first_name, last_name, address_id, email, store_id, username, `password`) VALUES
('José', 'Silva', '2', 'Jose.silva@sakilastaff.com', '2', 'José', UUID()),
('Amanda', 'Otto', '5', 'Amanda.otto@sakilastaff.com', '1', 'Amanda', UUID());

INSERT INTO sakila.actor (first_name, last_name)
SELECT first_name, last_name FROM sakila.customer
LIMIT 5;

INSERT INTO sakila.category (name) VALUES
('Fiction'),
('Romance '),
('Adventure');

INSERT INTO sakila.store (manager_staff_id, address_id)
VALUES ('5', '3');
```

* UPDATE : altera dados dentro de uma tabela

Uma curiosidade sobre o UPDATE e o DELETE no MySQL Server é que, por padrão, existe uma configuração chamada safe updates mode que só vai te permitir executá-los caso eles incluam quais IDs devem ser modificados. Então, caso você tente fazer a query abaixo, ela não funcionaria por não incluir o ID.

```sql
UPDATE sakila.staff
SET first_name = 'Rannveig'
WHERE first_name = 'Ravein';
```

Para evitar essa restrição, rode o seguinte comando em uma janela de query dentro do MySQL Workbench sempre que abri-lo para desabilitar essa funcionalidade, antes de executar seus comandos de UPDATE ou DELETE:

```sql
SET SQL_SAFE_UPDATES = 0;
```

Habilita o --safe-update: 

```sql
SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000;
```

Update:

```sql
UPDATE sakila.actor
SET first_name = 'JULES'
WHERE first_name = 'JULIA';

UPDATE sakila.category
SET name = 'Science Fiction'
WHERE name = 'Sci-Fi';

UPDATE sakila.film
SET replacement_cost = '25.00'
WHERE length > '100' AND rating IN ('G', 'PG', 'PG-13') AND replacement_cost > '20'

UPDATE sakila.actor 
SET 
    first_name = (CASE actor_id
        WHEN 1 THEN 'JOE'
        WHEN 2 THEN 'DAVIS'
        WHEN 3 THEN 'CAROLINE'
        ELSE first_name
    END);

UPDATE sakila.film 
SET 
    rental_rate = (CASE
        WHEN length < '100' THEN '10.00'
        WHEN length > '100' THEN '20.00'
        ELSE rental_rate
    END);

```



* DELETE : exclui dados de uma tabela

```SQL
DELETE FROM sakila.film_actor
WHERE actor_id IN (8, 103, 181);

DELETE FROM sakila.actor
WHERE first_name = 'MATTHEW';

--

DELETE FROM sakila.film_text
WHERE description LIKE '%saga%';

```

TRUNCATE remove dados de maneira mais performática:

```sql
TRUNCATE sakila.film_actor;

TRUNCATE sakila.film_category;
```


####DCL : Data Control Language - Focado mais nos comandos que concedem direitos, permissões e outros tipos de controle ao sistema de banco de dados.

* GRANT : concede acesso a um usuário
* REVOKE : remove acessos concedidos através do comando GRANT

####TCL : Transactional Control Language - Lida com as transações dentro de suas pesquisas.

* COMMIT : muda suas alterações de temporárias para permanentes no seu banco de dados
* ROLLBACK : desfaz todo o impacto realizado por um comando
* SAVEPOINT : define pontos para os quais uma transação pode voltar. É uma maneira de voltar para pontos específicos de sua query
* TRANSACTION : comandos que definem onde, como e em que escopo suas transações são executadas

sqLigth