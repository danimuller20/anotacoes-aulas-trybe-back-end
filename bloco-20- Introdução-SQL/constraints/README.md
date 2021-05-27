# Restrições

São regras para limitar os tipos de dados que podem ser inseridos em uma determinada coluna de uma determinada tabela, essas regras são aplicadas atravÉs da criação de uma nova tabeLa com o comando **CREATE TABLE** ou na alteração da estrutura dessa tabela com o comando **ALTER TABLE**.

As **constrains** mais utilizadas são:

* **NOT NULL**: garante que ao inserir um novo valor dentro de uma tabela ou atualizar um valor já existente aquela coluna não aceitara valores nulos como entrada;

* **UNIQUE**: garante que não haja valores repetidos em uma mesma coluna da tabela;

* **PRIMARY KEY**: declara que aquela coluna é um identificador único de um registro dentro de uma tabela, ela trás com ela automáticamente as **constraints**, **not null** e a  **unique**. Uma tabela deve ter apenas uma única **primary key**

* **FOREIGN KEY**: usada para referenciar uma **primary key** de uma outra tabela é ela que garante que exista um relacionamento entre duas tabelas;

* **DEFAULT**: define um valor padrão para uma determinada coluna caso nenhum valor seja atribuído;

#### Para acessar o banco de dados

```sh
 sudo mysql -u root -p 
```
* Mostra os banco de dados que estão por default dentro da instalação:
```sh
mysql> SHOW DATABASES; 
```

* Para sair do mysql:

```sh
mysql> exit
```

* Criar usuário:

```sh
mysql> CREATE USER 'nomeDoUsuário'@'localhost' IDENTIFIED BY 'algumaSenha';
```

* Permitir acesso a todas as tabelas:
```sh
mysql> GRANT ALL PRIVILEGES ON *.* TO 'nomeDoUsuário'@'localhost';
```

* Reiniciar os privilégios:
```sh
mysql> FLUSH PRIVILEGES;
```

* Após sair do mysql, agora o acesso pode ser feito pelo usuário criado:
```sh
mysql -u danimuller20 -p  
```

* Verificar o status do mysql:
```sh
sudo systemctl status mysql
```

* Caso esteja desativado:
```sh
systemctl start mysql
```

* Para (parar) desativar:
```sh
systemctl stop mysql
```

* Para sair, aperte ctrl+c.

* Para evitar que mysql ínicialize junto com o computador:
```sh
sudo systemctl disable mysql
```

* Para que mysql ínicialize junto com o computador:
```sh
sudo systemctl enable mysql
```

### Principais comandos

1 - O comando USE serve pra definir a referência do banco de dados que será utilizado na query:

```sh
USE nome_do_banco_de_dados_que_quero_conectar;
-- EX: USE trybe;
```

1.1 - Uma outra forma de fazer referência ao banco, sem ter que rodar o USE é no formato banco_de_dados.tabela :

```sh
SELECT * FROM banco_de_dados.tabela;
-- EX: SELECT * FROM trybe.students;
```

2 - Para retornar todas as tabelas inicializadas no seu server:

```sh
SHOW TABLES;
```

3 - Visualizar estrutura de uma tabela:

```sh
DESCRIBE nome_da_tabela;
-- EX: DESCRIBE students;
```

4 - Criar um banco de dados:

```sh
CREATE DATABASE nome_do_banco_de_dados;
-- EX: CREATE DATABASE trybe;
```