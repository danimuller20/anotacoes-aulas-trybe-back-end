#  MongoDB - Introdução
[Link para a instalação](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

**Instalar e conectar-se ao MongoDB**;
* Importando a chave pública utilizada pelo gerenciamento de pacotes:
```sh
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```

* Crie o arquivo de lista ( list file ) para o MongoDB (Ubuntu 18.04):
```sh
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```

* Atualize o banco de dados local de pacotes:
```sh
sudo apt-get update
```

* Instale os pacotes do MongoDB:
```sh
sudo apt-get install -y mongodb-org
```

Instalar o mongosh
```sh
sudo apt-get install -y mongodb-mongosh
```

**Executar o mongoDB**

* Iniciar serviço do MongoDB:
```sh
sudo service mongod start 
```

* Verificar o status do serviço do MongoDB:
```sh
sudo service mongod status
```

* Parar o serviço do mongoDB:
```sh
sudo service mongod stop
```

* Reiniciar a instância:
```sh
sudo service mongod restart
```

* Inicializar junto com o sistema: 
```sh
sudo systemctl enable mongod.service
```

* Parar a inicialização com o sistema:
```sh
sudo systemctl disable mongod.service
```

**Desinstalando o MongoDB**

* Parar a instância do mongodb:
```sh
sudo service mongod stop
```

* Remover todos os pacotes instalados:
```sh
sudo apt-get purge mongodb-org*
```

* Remover os arquivos de dependências que não são mais necessários e as versões antigas dos arquivos de pacotes:
```sh
sudo apt-get autoremove
```

* Remover os arquivos do mongodb que podem ter ficado para trás.
```sh
sudo rm -rf /var/log/mongodb
```

**Os pacotes instalados:**

1 - **mongodb-org-server:** esse pacote contém o que podemos chamar de "servidor" do MongoDB . Contém todos os recursos necessários para que uma instância do banco seja executada;
2 - **mongodb-org-shell:** o shell é onde você se conecta com o MongoDB através do terminal. É uma interface que suporta JavaScript e é super completa para administração de instâncias e clusters;
3 - **mongodb-org-mongos:** pronuncia-se "Mongo S" e só se faz necessário em ambientes Shard . Não entraremos em detalhes sobre ele agora;
4 - **mongodb-org-tools:** esse pacote contém algumas ferramentas nativas do MongoDB. Como por exemplo:
* **mongodump:** ferramenta para extrair dados no formato **BSON** (falaremos dele mais adiante). Em alguns ambientes, pode fazer parte da estratégia de backup;
* **mongorestore:** ferramenta para restaurar backups gerados pelo mongodump;
* **mongoimport:** ferramenta para importar arquivos JSON , CSV ou TSV para uma instância do MongoDB;
```sh
mongoimport --db <nome_da_db> --collection <nome_da_collection> <caminho_do_arquivo>
```
* **mongoexport:** exporta dados de uma instância do MongoDB para arquivos **JSON** ou **CSV**.

## ❗Informação importante ❗
Por padrão, o MongoDB só permite conexões locais. Ou seja, apenas de clients que estejam rodando na mesma máquina onde a instância estiver sendo executada. Para alterar essa configuração e permitir conexões remotas, veja sobre [IP Binding](https://docs.mongodb.com/manual/core/security-mongodb-configuration/) na documentação.

### Conectando ao mongoDB

* Conectar no mongo
```sh
mongo
```

*Conectar com uma porta específica:
```sh
mongo --port 19000
```

* Mostrar tabelas:
```js
show dbs
```

* Sair:
```js
exit
```

**Listar Bancos de Dados, Coleções e Documentos**;

* Quando vamos fazer um insert, o **MongoDB** cuida disso para você: criando o banco e a coleção (caso não existam previamente) juntos com o documento inserido. Tudo isso em uma mesma operação.
```js
use nomeDoBanco
db.nomeDaColecao.insertOne( { x: 1 })
```
_A função **insertOne()** cria tanto o banco de dados nomeDoBanco , como a coleção nomeDaColecao , caso eles não existam. Se existirem, apenas mapeia o documento a se__r inserido dentro deles e, por fim, executa a operação._

* Coleções:
    * Os documentos no MongoDB são armazenados dentro das coleções . Lembrando que uma coleção é equivalente à uma tabela dos bancos de dados relacionais.
  * Criando uma coleção:
    Se uma coleção não existe, o MongoDB cria essa coleção no momento do primeiro **insert**;
    ```js
    db.nomeDaColecao1.insertOne({ x: 1 })
    db.nomeDaColecao2.createIndex({ y: 1 })
    ```
    _Tanto as operações **insertOne()** e **createIndex()** criam uma nova coleção (caso ela não exista)._

* Criação explícita:

    * Caso queira especificar algum parâmetro basta utilizar o método **db.createCollection()** para criar uma coleção e especificar uma série de parâmetros, como o tamanho máximo do documento ou as regras de validação para os documentos:
    ```js
    db.createCollection( "nomeDaColecao", { collation: { locale: "pt" } } );
    ```
  Pode ser feito modificações nos parâmetros de uma coleção através do [collMod](https://docs.mongodb.com/manual/reference/command/collMod/#dbcmd.collMod).
  [Documentação](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection) do método db.createCollection().

* Documentos:
    * Documentos são equivalentes aos registros ou linhas de uma tabela nos bancos de dados relacionais, cada atributo (campo) é equivalente a uma coluna de uma linha da tabela;

* Validação de documentos
    * Aplicar uma validação com o [Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/) para que cada operação de escrita em sua coleção respeite uma estrutura;

* (Binary JSON) BSON Types
    * Por mais que o **insert** ocorra recebendo um documento JSON, internamente, o MongoDB armazena os dados em um formato chamado **BSON** (ou **Binary JSON**). Esse formato é uma extensão do **JSON** e permite que você tenha mais tipos de dados armazenados no **MongoDB** , não somente os tipos permitidos pelo **JSON**.

**Inserir documentos no banco de dados usando o insert()**;

* **insertOne()**: Inseri um dado de cada vez
  * Criar documento na coleção products:
  ```js
  use products
  ```
  * Banco de dados sample com id automático
  ```js
  db.sample.insertOne({"productName": "Caixa", "price": 20})
  ```

  * Banco de dados sample com id manual, (não recomendado):
  ```js
  db.sample.insertOne({_id: 1, "productName": "Bola", "price": 10})
  ```
* **insertMany()**: inseri vários dados de uma só vez.
```js
db.sample.insertMany([
    { "productName": "Lapis", "stock": 10, "price": 20,"status":"A"},
    { "productName": "Tesoura", "price": 5, "status": "B" },
    { "productName": "Borracha", "price": 15, "status": "A" }
])
```
**Pesquisar documentos no banco de dados usando o find()**
* Esse método recebe dois parâmetros:
    * **query** (opcional):
      * Tipo: documento;
      * Descrição: especifica os filtros da seleção usando os query operators . Para retornar todos os documentos da coleção, é só omitir esse parâmetro ou passar um documento vazio ({}).
  * **projection** (opcional):
    * Tipo: documento;
    * Descrição: especifica quais atributos serão retornados nos documentos selecionados pelo parâmetro query . Para retornar todos os atributos desses documentos, é só omitir esse parâmetro.
    ___
* **find()**: seleciona os documentos de uma coleção
Ao executar o método find() , o MongoDB Shell itera automaticamente o cursor para exibir os 20 primeiros documentos. Digite **it** para continuar a iteração. Assim, mais 20 documentos serão exibidos até o final do cursor.
O método find() , quando utilizado sem parâmetros, retorna todos os documentos da coleção juntamente com todos os seus campos.

```js
db.bios.find()
```

* Query por igualdade
  * Retorna os documentos da coleção bios em que o atributo _id é igual a 5 :
```js
db.bios.find( { _id: 5 } )
```

  * Retorna todos os documentos da coleção bios em que o campo last do subdocumento name é igual a "Hopper": 
```js
db.bios.find( { "name.last": "Hopper" } )
```

**Projetando somente os atributos requeridos:**
* Através do segundo parâmetro do método find() , podemos especificar quais atributos serão retornados. O exemplo abaixo retorna todos os documentos da coleção bios , trazendo apenas o atributo name de cada documento:
```js
db.bios.find({}, { name: 1 })
```

**Projeção (projection)**:
```js
{ "atributo1": <valor>, "atributo2": <valor> ... }
```
O valor pode ser uma das seguintes opções:
* 1 ou true para incluir um campo nos documentos retornados;
* 0 ou false para excluir um campo;
* Uma expressão usando [Projection Operators](https://docs.mongodb.com/manual/reference/operator/projection/).

Podemos optar em exibir no resultado da consulta apenas certos atributos.
A projeção é sempre o segundo parâmetro do método find().

Considerando a seguinte coleção:
```js
db.movies.insertOne(
    {
        "title" : "Forrest Gump",
        "category" : [ "drama", "romance" ],
        "imdb_rating" : 8.8,
        "filming_locations" : [
            { "city" : "Savannah", "state" : "GA", "country" : "USA" },
            { "city" : "Monument Valley", "state" : "UT", "country" : "USA" },
            { "city" : "Los Anegeles", "state" : "CA", "country" : "USA" }
        ],
        "box_office" : {
            "gross" : 557, "opening_weekend" : 24, "budget" : 55
        }
    }
)
```

* Busca por **findOne()**
```js
db.movies.findOne(
    { "title" : "Forrest Gump" },
    { "title" : 1, "imdb_rating" : 1 }
)

//Resultado:

{
    "_id" : ObjectId("5515942d31117f52a5122353"),
    "title" : "Forrest Gump",
    "imdb_rating" : 8.8
}
```

* Percebe se que o atributo _id também foi retornado. Isso acontece porque ele é o único atributo que você não precisa especificar para que seja retornado. O movimento aqui é ao contrário, se você não quiser vê-lo no retorno, é só suprimí-lo da seguinte forma:
  * 0 ou false para excluir um campo (nesse caso omitir o _id0)
```js
db.movies.findOne(
    { "title" : "Forrest Gump" },
    { "title" : 1, "imdb_rating" : 1, "_id": 0 }
)

//Resultado 

{
    "title" : "Forrest Gump",
    "imdb_rating" : 8.8
}
```

**Contar a quantidade de documentos retornados usando o countDocuments()**
* O método **countDocuments()** retorna o número de documentos de uma coleção, e também pode receber um critério de seleção para retornar apenas o número de documentos que atendam a esse critério.
```js
db.movies.countDocuments()
```

**Tipos e comparações**

O **MongoDB** trata alguns tipos de dados como equivalentes para fins de comparação. Por exemplo, tipos numéricos sofrem conversão antes da comparação. No entanto, para a maioria dos tipos de dados, os [operadores de comparação](https://docs.mongodb.com/manual/reference/operator/query-comparison/) realizam comparações apenas em documentos em que o [tipo BSON](https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#bson-types-comparison-order) do atributo destino do documento corresponde ao tipo do operando da query.

Considerando a seguinte coleção
```js
{ "_id": "apples", "qty": 5 }
{ "_id": "bananas", "qty": 7 }
{ "_id": "oranges", "qty": { "in stock": 8, "ordered": 12 } }
{ "_id": "avocados", "qty": "fourteen" }
```

A operação abaixo usa o operador de comparação $gt( greater than , maior que, >) para retornar os documentos em que o valor do atributo qty seja maior do que 4:

```js
db.collection.find( { qty: { $gt: 4 } } )

-- Resultado

{ "_id": "apples", "qty": 5 }
{ "_id": "bananas", "qty": 7 }
```
* O documento com o _id igual a "avocados" não foi retornado porque o valor do campo qty é do tipo string , enquanto o operador $gt é do tipo integer.
* O documento com o _id igual a "oranges" também não foi retornado porque qty é do tipo object.

**Fazer uma paginação simples combinando os métodos limit() e o skip()**
* **limit()**: maximiza a performance e evita que o MongoDB retorne mais resultados do que o necessário para o processamento.
Exemplo:
```js
db.bios.find().limit(5)
```

* **pretty()**: Aplica uma indentação na exibição dos resultados no console, de forma que fica bem melhor de ler.
Exemplo:
```js
db.bios.find().limit(5).pretty()
```

* **skip()**: Controla a partir de que ponto o MongoDB começa a retornar os resultados. Essa abordagem pode ser bastante útil para realizar paginação dos resultados.
O método **skip()** precisa de um **parâmetro numérico** que determinará quantos documentos serão "pulados" antes de começar a retornar.

Pula os dois primeiros documentos e retorna o cursor a partir daí:
```js
db.bios.find().skip(2)
```

Combina os métodos limit() e skip() para criar uma paginação:
```js
db.bios.find().limit(10).skip(5)
```

# Filter Operators

### Utilizar os operadores de comparação
* **Operador $lt:** menor do que (<) o valor especificado:
```js
db.inventory.find({ qty: { $lt: 20 } })
```
Essa query selecionará todos os documentos na coleção inventory cujo valor do campo qty é menor do que 20.

* **Operador $lte:** menor ou igual (<=) ao valor especificado:
```js
db.inventory.find({ qty: { $lte: 20 } })
```
Essa query selecionará todos os documentos na coleção inventory cujo valor do campo qty é menor ou igual a 20.

* **Operador $gt:** maior do que (>) o valor especificado:
```js
db.inventory.find({ qty: { $gt: 20 } })
```

* **Operador $gte:** maior ou igual (>=) ao valor especificado:
```js
db.inventory.find({ qty: { $gte: 20 } })
```
Essa query selecionará todos os documentos na coleção inventory cujo valor do campo qty é maior ou igual a 20.

* **Operador $eq:** igual ao valor especificado:
```js
db.inventory.find({ qty: { $eq: 20 } })
```
A query acima é exatamente equivalente a:
```js
db.inventory.find({ qty: 20 })
```
As duas queries acima selecionam todos os documentos na coleção inventory cujo valor do campo qty é igual a 20.

* **Operador $ne:** não é igual ao valor especificado:
```js
db.inventory.find({ qty: { $ne: 20 } })
```
A query acima retorna os documentos da coleção inventory cujo valor do campo qty é diferente de 20 , incluindo os documentos em que o campo qty não existe.

* **Operador $in:** faz comparações de igualdade com mais de um valor no mesmo campo: 
```js
db.inventory.find({ qty: { $in: [ 5, 15 ] } })
```
A query acima retorna todos os documentos da coleção inventory em que o valor do campo qty é 5 ou 15.

* **Operador $nin:** não é igual ao especificado no array:
```js
db.inventory.find( { qty: { $nin: [ 5, 15 ] } } )
```
Essa query seleciona todos os documentos da coleção inventory em que o valor do campo qty é diferente de 5 e 15. Esse resultado também inclui os documentos em que o campo qty não existe.

### Utilizar os operadores lógicos

* **Operador $not:**
    * O operador $not executa uma operação lógica de NEGAÇÃO no < operador ou expressão > especificado e seleciona os documentos que não correspondam ao < operador ou expressão > . Isso também inclui os documentos que não contêm o campo .
Sintaxe:
```js
{ campo: { $not: { <operador ou expressão> } } }
```
Exemplo: 
```js
db.inventory.find({ price: { $not: { $gt: 1.99 } } })
```
Essa query seleciona todos os documentos na coleção inventory em que o valor do campo price é menor ou igual a 1.99 (em outras palavras, não é maior que 1.99 ), ou em que o campo price não exista.

* **Operador $or:** 
    * Executa a operação lógica OU em um array de uma ou mais expressões e seleciona os documentos que satisfaçam ao menos uma das expressões.
Sintaxe:
```js
{ $or: [{ <expression1> }, { <expression2> }, ... , { <expressionN> }] }
```
Exemplo: 
```js
db.inventory.find({ $or: [{ qty: { $lt: 20 } }, { price: 10 }] })
```
Essa query seleciona todos os documentos da coleção inventory em que o valor do campo qty é menor do que 20 ou o valor do campo price é igual a 10.

* **Operador $nor:**
    * Executa uma operação lógica de NEGAÇÃO , porém, em um array de uma ou mais expressões, e seleciona os documentos em que todas essas expressões falhem , ou seja, seleciona os documentos em que todas as expressões desse array sejam falsas.
Sintaxe:
```js
{ $nor: [ { <expressão1> }, { <expressão2> }, ...  { <expressãoN> } ] }
```

Exemplo: 
```js
db.inventory.find({ $nor: [{ price: 1.99 }, { sale: true }] })
```

Essa query retorna todos os documentos da coleção inventory que:
* Contêm o campo price com valor **diferente de 1.99** e o campo sale com valor **diferente de true**;
* Ou contêm o campo price com valor **diferente de 1.99** e **não contêm o campo sale**;
* Ou **não contêm o campo price** e contêm o campo sale com valor **diferente de true**;
* Ou **não contêm o campo price** e **nem o campo sale**.
____
* **Operador $and:**
    * Executa a operação lógica E num array de uma ou mais expressões e seleciona os documentos que satisfaçam todas as expressões no array. O operador $and usa o que chamamos de avaliação em curto-circuito ( short-circuit evaluation ). Se alguma expressão for avaliada como falsa , o MongoDB não avaliará as expressões restantes, pois a expressão como um todo será falsa independentemente delas.
Sintaxe:
```js
{ $and: [{ <expressão1> }, { <expressão2> } , ... , { <expressãoN> }] }
```
Múltiplas expressões especificando o mesmo campo
Exemplo:
```js
db.inventory.find({
and: [
        { price: { $ne: 1.99 } },
        { price: { $exists: true } }
    ]
})
```
Essa query seleciona todos os documentos da coleção inventory em que o valor do campo price é diferente de 1.99 e o campo price existe.

Múltiplas expressões especificando o mesmo operador
Exemplo:
```js
db.inventory.find({
and: [
        {
or: [
                { price: { $gt: 0.99, $lt: 1.99 } }
            ]
        },
        {
or: [
                { sale : true },
                { qty : { $lt : 20 } }
            ]
        }
    ]
})
```
Essa query seleciona todos os documentos da coleção inventory em que o valor do campo price é maior que 0.99 ou menor que 1.99 , e o valor do campo sale é igual a true ou o valor do campo qty é menor do que 20 . Ou seja, essa expressão é equivalente a (price > 0.99 ou price < 1.99) e (sale = true ou qty < 20).

### Utilizar o operador $exists
* Quando o ```<boolean>``` é verdadeiro ( true ), o operador ```$exists``` encontra os documentos que contêm o campo , incluindo os documentos em que o valor do campo é null . Se o <boolean> é falso ( false ), a query retorna somente os documentos que não contêm o campo.
Sintaxe: 
```js
{ campo: { $exists: <boolean> } }
```
Exemplo: 
```js
db.inventory.find({ qty: { $exists: true } })
```
Essa query retorna todos os documentos da coleção inventory em que o campo qty existe.

Combinando operadores:
```js
db.inventory.find({ qty: { $exists: true, $nin: [ 5, 15 ] } })
```
Essa query seleciona todos os documentos da coleção inventory em que o campo qty existe e seu valor é diferente de 5 e 15.

### Utilizar o método sort()
Usando um valor positivo, **1**, como valor do campo os documentos da query são ordenados de forma **crescente ou alfabética** (Ele também ordena por campos com strings). Em complemento, usando um valor negativo, **-1**, os documentos de saída em **ordem decrescente ou contra alfabética**. Ele pode ser combinado com o um find assim: ```db.example.find({}, { value, name }).sort({ value: -1 }, { name: 1 })```. O sort só pode ser usado se tiver algum resultado de busca antes, como ```db.colecao.find().sort({ "campo": -1})```, mas não ```db.colecao.sort({ campo: 1})```

Sintaxe:
```js
db.colecao.find().sort({ "campo": "1 ou -1"})
```

Exemplo:
```js
db.example.insertMany([
    { "name": "Mandioquinha Frita", "price": 14 },
    { "name": "Litrão", "price": 8 },
    { "name": "Torresmo", "price": 16 }
])
```

```js
db.example.find().sort({ "price": 1 }).pretty()
```
A query acima ordena pelo preço em ordem crescente

```js
// Resultado esperado:
{
    "_id" : ObjectId("5f7dd0582e2738debae74d6c"),
    "name" : "Litrão",
    "price" : 8
}
{
    "_id" : ObjectId("5f7dd0582e2738debae74d6b"),
    "name" : "Mandioquinha Frita",
    "price" : 14
}
{
    "_id" : ObjectId("5f7dd0582e2738debae74d6d"),
    "name" : "Torresmo",
    "price" : 16
}
```

```js
db.example.find().sort({ "price": -1 }, { "name" : 1 }).pretty()
```
A query acima ordena pelo preço em ordem decrescente

```js
// Resultado esperado:
{
    "_id" : ObjectId("5f7dd0582e2738debae74d6d"),
    "name" : "Torresmo",
    "price" : 16
}
{
    "_id" : ObjectId("5f7dd0582e2738debae74d6b"),
    "name" : "Mandioquinha Frita",
    "price" : 14
}
{
    "_id" : ObjectId("5f7dd0582e2738debae74d6c"),
    "name" : "Litrão",
    "price" : 8
}
```

### Remover documentos
Para remover documentos de uma coleção, temos dois métodos que são utilizados para níveis de remoção diferentes: o db.colecao.deleteOne() e o db.colecao.deleteMany() . Os dois métodos aceitam um documento como parâmetro, que pode conter um filtro simples ou até mesmo um conjunto de expressões para atender aos critérios de seleção.

* **db.colecao.deleteOne():** Remove apenas um documento, que deve satisfazer o critério de seleção.

```js
db.inventory.deleteOne({ status: "D" })
```
O exemplo acima remove o primeiro documento da coleção inventory em que o campo status é igual a D :

* **db.colecao.deleteMany():** Remove todos os documentos que satisfaçam o critério de seleção.

```js
db.inventory.deleteMany({ status : "A" })
```
O exemplo acima remove todos os documentos da coleção inventory em que o campo status é igual a A.

```js
db.inventory.deleteMany( {} )
```
Para remover todos os documentos da coleção, basta não passar parâmetros para o método db.colecao.deleteMany():

* **db.dropDatabase():** Apaga a base de dados que está em uso.