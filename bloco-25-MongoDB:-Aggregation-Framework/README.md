# Aggregation Framework - Parte 1

#### Aggregation Pipeline

Tendo a seguinte operação:
```js
db.orders.aggregate([
  { $match: { status: "A" } },
  { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }
]);
```
Essa operação possui dois estágios:

**Primeiro Estágio:** O estágio ```$match``` filtra os documentos pelo campo ```status```, e passam para o próximo estágio somente os documentos que têm ```status``` igual a ```"A"```.

**Segundo Estágio:** O estágio ```$group``` agrupa os documentos pelo campo ```cust_id``` para calcular a soma dos valores do campo amount para cada ```cust_id``` único

[Aggregation Pipeline Operators](https://docs.mongodb.com/manual/reference/operator/aggregation/#aggregation-expression-operators)

#### Filtrar documentos com o estágio ```$match```

O estágio representado pelo operador ```$match```filtra os documentos da mesma maneira que os filtros no método ```find({ $match })```.

![](./images/match-light.png)

**Igualdade simples:**

```js
db.articles.aggregate(
  [{ $match : { author : "dave" } }]
);
```
A operação citada seleciona todos os documentos em que o campo author seja igual a dave . Note que a sintaxe do filtro é exatamente igual à utilizada como filtro no método find() . A agregação retornará os seguintes documentos:
```js
[
  {
    _id: ObjectId("512bc95fe835e68f199c8686"),
    author: 'dave',
    score: 80,
    views: 100
  },
  {
    _id: ObjectId("512bc962e835e68f199c8687"),
    author: 'dave',
    score: 85,
    views: 521
  }
]
```

**Igualdade complexa:**

É possível, dentro do match, utilizar operadores como or, and, in etc.

```js
db.articles.aggregate(
  [
    {
$match: {
$or: [
          { score: { $gt: 70, $lt: 90 } },
          { views: { $gte: 1000 } }
        ]
      }
    }
  ]
);
```

Nessa operação de agregação, o primeiro e único estágio seleciona todos os documentos da coleção articles em que o score seja maior que 70 e menor que 90 , ou o campo views seja maior ou igual a 1000:

```js
{ "_id" : ObjectId("512bc95fe835e68f199c8686"), "author" : "dave", "score" : 80, "views" : 100 }
{ "_id" : ObjectId("512bc962e835e68f199c8687"), "author" : "dave", "score" : 85, "views" : 521 }
{ "_id" : ObjectId("55f5a192d4bede9ac365b257"), "author" : "ahn", "score" : 60, "views" : 1000 }
{ "_id" : ObjectId("55f5a192d4bede9ac365b258"), "author" : "li", "score" : 55, "views" : 5000 }
{ "_id" : ObjectId("55f5a1d3d4bede9ac365b25b"), "author" : "ty", "score" : 95, "views" : 1000 }   
```

#### Limitar os resultados com ```$limit```

O operador ```$limit``` limita o número de documentos que será passado para o próximo estágio do pipeline. Ele sempre recebe um valor do tipo inteiro e positivo.

Retorna apenas 5 documentos:
```js
db.articles.aggregate(
  [
    { $limit : 5 }
  ]
);
```
**Exercícios de fixação:**

1 - Selecione todas as transações feitas pelo cliente chamado "Dave America":

```js
db.transactions.aggregate( [ { $match: {from: "Dave America"}}]);
```

2 - Selecione todas as transações com o valor entre 700 e 6000, ou que sejam recebidas pela cliente "Lisa Simpson":

```js
db.transactions.aggregate( [ { $match: { $or: [ { value: { $gt: 700, $lt: 6000 } }, { to: "Lisa Simpson" }] } }]);
```

3 - Selecione três transações com o valor acima de 1000:

```js
db.transactions.aggregate( [{ $match: {value: {$gt: 1000}}}, {$limit: 3}]);
```

#### Controlar a exibição de campos com o ```$project```

O operador ```$project``` tem como uma de suas funções passar adiante no pipeline apenas alguns campos dos documentos vindos do estágio anterior, fazendo isso por meio de uma "projeção", como no método ```find({}, { $project })```. Mas aqui temos uma diferença: esses campos podem ser novos, sendo resultado de um cálculo ou de uma concatenação.

Vamos ver alguns exemplos, considerando o documento abaixo: 
```js
db.books.insertOne(
  {
    _id: 1,
    title: "A Fundação",
    isbn: "0001122223334",
    author: { last: "Asimov", first: "Isaac" },
    copies: 5
  }
)
```

**Incluindo campos específicos:**
Inclui apenas os campos _id, title e author no documento de saída:

```js
db.books.aggregate(
  [
    {
$project : {
        title : 1,
        author : 1
      }
    }
  ]
);
```
Resultado:
```js
{
    _id: 1,
    title: 'A Fundação',
    author: { last: 'Asimov', first: 'Isaac' }
  }
```

** Excluindo o campo _id:**
O campo _id é padrão e é o único que necessita de uma negação explícita para que não seja incluído no documento de saída:
```js
db.books.aggregate([
  {
$project : {
      _id: 0,
      title : 1,
      author : 1
    }
  }
]);
```

**Excluindo outros campos:**

Quando você nega um campo específico, todos os outros serão incluídos no documento de saída:

```js
db.books.aggregate([
  {
$project : {
      copies: 0
    }
  }
]);
```

** Excluindo campos em sub-documentos:**
Para documentos embedados, seguimos os mesmos conceitos de dot notation:
```js
db.books.aggregate([
  {
$project : {
      "author.first": 0,
      copies: 0
    }
  }
]);
```

**Incluindo campos calculados:**

Podemos usar uma string iniciada com o caractere ```$``` para indicar que queremos projetar um campo, assim: ```"$nomeDoCampo"```.
A operação a seguir adiciona os novos campos isbn, lastname e copiesSold:

```js
db.books.aggregate([
  {
$project: {
      title: 1,
      isbn: {
        prefix: { $substr: ["$isbn", 0, 3] },
        group: { $substr: ["$isbn", 3, 2] },
        publisher: { $substr: ["$isbn", 5, 4] },
        title: { $substr: ["$isbn", 9, 3] },
        checkDigit: { $substr: ["$isbn", 12, 1] }
      },
      lastName: "$author.last",
      copiesSold: "$copies"
    }
  }
]);
```
resultado:
```js
{
  "_id" : 1,
  "title" : "A Fundação",
  "isbn" : {
    "prefix" : "000",
    "group" : "11",
    "publisher" : "2222",
    "title" : "333",
    "checkDigit" : "4"
  },
  "lastName" : "Asimov",
  "copiesSold" : 5
}
```
❗Lembre-se: esses novos campos são apenas adicionados para a visualização final, não serão salvos no banco❗

#### Fazer agrupamentos com o ```$group```

Este é provavelmente o operador que você mais utilizará nas operações de agregação. Com ele é possível agrupar valores de diversas formas, desde um "distinct" simples até cálculos mais elaborados com a ajuda de outros operadores.

![](./images/group-light1.png)

O principal parâmetro do $group é o ```_id``` (que não tem nada a ver com o campo ```_id``` das coleções). Neste caso, ele é responsável por conter o campo ou os campos que serão utilizados no agrupamento.

![](./images/group-light-specific.png)

No documento de saída, o _id contém um agrupamento exclusivo para cada valor. Esses documentos de saída também podem conter campos calculados , que conterão valores de alguma [expressão de acumulação](https://docs.mongodb.com/manual/reference/operator/aggregation/group/#accumulators-group).

**Operador de Acumulação:**

Operadores de acumulação mais utilizados:

* ```$addToSet```: retorna um array com os valores únicos da expressão para cada grupo;
* ```$avg```: retorna a média de valores numéricos. Valores não numéricos são ignorados;
* ```$first```: retorna um valor do primeiro documento de cada grupo;
* ```$last```: retorna um valor do último documento de cada grupo;
* ```$max```: retorna o maior valor de cada grupo;
* ```$sum```: retorna a soma de valores numéricos. Valores não numéricos são ignorados.

Vamos ver alguns exemplos, considerando o documento abaixo: 

```js
db.sales.insertMany([
{
  _id: 1,
  item: "Código Limpo",
  price: NumberDecimal("10"),
  quantity: NumberInt("2"),
  date: ISODate("2014-03-01T08:00:00Z")
},
{
  _id: 2,
  item: "O Homem e Seus Símbolos",
  price: NumberDecimal("20"),
  quantity: NumberInt("1"),
  date: ISODate("2014-03-01T09:00:00Z")
},
{
  _id: 3,
  item: "Comunicação Não-Violenta",
  price: NumberDecimal("5"),
  quantity: NumberInt( "10"),
  date: ISODate("2014-03-15T09:00:00Z")
},
{
  _id: 4,
  item: "Comunicação Não-Violenta",
  price: NumberDecimal("5"),
  quantity:  NumberInt("20"),
  date: ISODate("2014-04-04T11:21:39.736Z")
},
{
  _id: 5,
  item: "Código Limpo",
  price: NumberDecimal("10"),
  quantity: NumberInt("10"),
  date: ISODate("2014-04-04T21:23:13.331Z")
},
{
  _id: 6,
  item:"A Coragem de Ser Imperfeito",
  price: NumberDecimal("7.5"),
  quantity: NumberInt("5" ),
  date: ISODate("2015-06-04T05:08:13Z")
},
{
  _id: 7,
  item: "A Coragem de Ser Imperfeito",
  price: NumberDecimal("7.5"),
  quantity: NumberInt("10"),
  date: ISODate("2015-09-10T08:43:00Z")
},
{
  _id: 8,
  item: "Código Limpo",
  price: NumberDecimal("10"),
  quantity: NumberInt("5" ),
  date: ISODate("2016-02-06T20:20:13Z")
}
]);
```

**Contando o número de documentos:**
Você pode utilizar o operador $group para contar o número de documentos da coleção sales:

```js
db.sales.aggregate([
  {
$group: {
      _id: null,
      count: { $sum: 1 }
    }
  }
]);
```
 O ```_id``` está setado como null, porque nesse caso queremos todos os documentos. O retorno dessa operação é:

```js
{ "_id" : null, "count" : 8 }
```

**Retornando valores distintos:**
O operador ```$group``` também pode ser utilizado para encontrar os valores distintos de um campo. Por exemplo, se quiser saber todos os valores únicos do campo item e quantos são:

```js
db.sales.aggregate([
  {
$group : {
      _id : "$item",
      count: { $sum: 1}
    }
  }
]);
```
Note que o campo deve ser precedido de ```$```. O resultado da operação é:

```js
{ "_id" : "A Coragem de Ser Imperfeito", "count" : 2 }
{ "_id" : "O Homem e Seus Símbolos", "count" : 1 }
{ "_id" : "Código Limpo", "count" : 3 }
{ "_id" : "Comunicação Não-Violenta", "count" : 2 }
```
**Somando valores:**
Para saber o valor das vendas, você deve utilizar o operador ```$sum```, que, por sua vez, aceita mais modificadores. No exemplo que se segue, multiplica-se o valor do campo price pelo valor do campo quantity:

```js
db.sales.aggregate([
  {
$group : {
      _id : "$item",
      totalSaleAmount: {
$sum: {
$multiply: ["$price", "$quantity"]
        }
      }
    }
  }
]);
```

Resultado:
```js
{ "_id" : "A Coragem de Ser Imperfeito", "totalSaleAmount" : NumberDecimal("112.5") }
{ "_id" : "O Homem e Seus Símbolos", "totalSaleAmount" : NumberDecimal("20") }
{ "_id" : "Código Limpo", "totalSaleAmount" : NumberDecimal("170") }
{ "_id" : "Comunicação Não-Violenta", "totalSaleAmount" : NumberDecimal("150") }
```

**Having (do Mysql), combinando estágios no aggregate:**
Também é possível realizar operações equivalentes ao HAVING do SQL, que nada mais é que um filtro depois de um agrupamento. Por exemplo, se você quiser manter o agrupamento anterior, mas saber apenas as vendas que possuem valores maiores do que 100, é só adicionar mais um estágio no pipeline:

```js
db.sales.aggregate([
  // Primeiro Estágio
  {
$group: {
      _id : "$item",
      totalSaleAmount: {
$sum: {
$multiply: ["$price", "$quantity"]
        }
      }
    }
  },
  // Segundo Estágio
  {
$match: { "totalSaleAmount": { $gte: 100 } }
  }
]);
```

Resultado:
```js
{ "_id" : "A Coragem de Ser Imperfeito", "totalSaleAmount" : NumberDecimal("112.5") }
{ "_id" : "Código Limpo", "totalSaleAmount" : NumberDecimal("170") }
{ "_id" : "Comunicação Não-Violenta", "totalSaleAmount" : NumberDecimal("150") }
```

**Agrupando por null:**

Você pode executar operações matemáticas em todos os documentos de uma coleção. Basta passar ```null``` no ```_id``` e seguir com os operadores de acumulação.

No exemplo a seguir, a operação de agregação retornará um documento com o valor total da venda, a quantidade média de itens vendidos e o total de vendas:

```js
db.sales.aggregate([
  {
$group : {
      _id : null,
      totalSaleAmount: {
$sum: { $multiply: ["$price", "$quantity"] }
      },
      averageQuantity: { $avg: "$quantity" },
      count: { $sum: 1 }
    }
  }
]);
```

Resultado:
```js
{
  "_id" : null,
  "totalSaleAmount" : NumberDecimal("452.5"),
  "averageQuantity" : 7.875,
  "count" : 8
}
```

**Exercícios de fixação:**

1 - Selecione todos os bancos, ou seja, valores do campo bank:
```js
db.transactions.aggregate([ { $group: { _id: "$bank" } }]);
```

2 - Selecione o valor total das transações em cada banco e quantas são:
```js
db.transactions.aggregate([ { $group: { _id: "$bank", totalValueOfAllTransactions: {$sum: "$value"}, count: {$sum: 1 }} }]);
```

3 - Selecione o valor total de transações:
```js
db.transactions.aggregate([ { $group: { _id: null, totalValueOfAllTransactions: {$sum: "$value"}}}]);
```

4 - Selecione os bancos que têm o valor total de transações maior que 1000:
```js
db.transactions.aggregate([ { $group: { _id: "$bank", totalValueOfAllTransactions: {$sum: {$multiply: "$value"}}}}, {$match: {"totalValueOfAllTransactions": {$gt: 1000}}}]);
```

#### Trabalhar com arrays com o ```$unwind```

O operador $unwind "desconstrói" um campo array do documento de entrada e gera como saída um documento para cada elemento do array. Cada documento de saída é o documento de entrada com o valor do campo array substituído por um elemento do array.

Na prática fica mais fácil de entender. Insira o seguinte documento na coleção inventory:

```js
db.inventory.insertOne({ _id: 7, item: "ABC1", sizes: ["S", "M", "L"] });
```

E agora, utilizando o $unwind como um estágio do pipeline :
```js
db.inventory.aggregate([{ $unwind : "$sizes" }]);
```

Resultado:
```js
{ "_id" : 7, "item" : "ABC1", "sizes" : "S" }
{ "_id" : 7, "item" : "ABC1", "sizes" : "M" }
{ "_id" : 7, "item" : "ABC1", "sizes" : "L" }
```
Temos a "expansão" do array sizes, e a saída são três documentos com os valores _id e item preservados.

#### Juntar dados de uma ou mais coleções com o ```$lookup```

O operador ```$lookup``` foi introduzido na versão 3.2 do MongoDB e vem evoluindo desde então. Com ele, é possível juntar documentos de outra coleção (join). Como resultado dessa junção, um elemento do tipo array é adicionado a cada documento da coleção de entrada, contendo os documentos que deram "match" na coleção com a qual se faz o "join".

Existem quatro parâmetros básicos para montar um ```$lookup```:

* ```from```: uma coleção no mesmo database para executar o ```join```;
* ```localField```: o campo da coleção de onde a operação de agregação está sendo executada. Será comparado por igualdade com o campo especificado no parâmetro foreingField;
* ```foreingField```: o campo da coleção especificada no parâmetro from que será comparado com o campo localField por igualdade simples;
* ```as```: o nome do novo array que será adicionado.

**Join com igualdade simples:**

Considere os seguintes documentos nas coleções orders e inventory:
```js
// orders
db.orders.insertMany([
{ _id: 1, item: "almonds", price: 12, quantity: 2 },
{ _id: 2, item: "pecans", price: 20, quantity: 1 },
{ _id: 3 }
]);
```

```js
// inventory
db.inventory.insertMany([
{ _id: 1, sku: "almonds", description: "product 1", instock: 120 },
{ _id: 2, sku: "bread", description: "product 2", instock: 80 },
{ _id: 3, sku: "cashews", description: "product 3", instock: 60 },
{ _id: 4, sku: "pecans", description: "product 4", instock: 70 },
{ _id: 5, sku: null, description: "Incomplete" },
{ _id: 6 }
]);
```

Imagine que você queria retornar em uma única query os documentos correspondentes das duas coleções mencionadas. A primeira coisa é encontrar um campo em comum entre elas. Nesse caso, seriam os campos item (coleção orders) e sku (coleção inventory ). Quando cruzados na operação a seguir, um novo campo, chamado inventory_docs , será adicionado ao resultado final:

```js
db.orders.aggregate([
  {
$lookup: {
      from: "inventory",
      localField: "item",
      foreignField: "sku",
      as: "inventory_docs"
    }
  }
]);
```

Resultado:
```js
{
  "_id" : 1,
  "item" : "almonds",
  "price" : 12,
  "quantity" : 2,
  "inventory_docs" : [
    {
      "_id" : 1,
      "sku" : "almonds",
      "description" : "product 1",
      "instock" : 120
    }
  ]
}
{
  "_id" : 2,
  "item" : "pecans",
  "price" : 20,
  "quantity" : 1,
  "inventory_docs" : [
    {
      "_id" : 4,
      "sku" : "pecans",
      "description" : "product 4",
      "instock" : 70
    }
  ]
}
{
  "_id" : 3,
  "inventory_docs" : [
    {
      "_id" : 5,
      "sku" : null,
      "description" : "Incomplete"
    },
    {
      "_id" : 6
    }
  ]
}
```

**Exercícios de fixação:**

Utilizando o banco de dados agg_example, adicione a seguinte collection e faça os exercícios:
```js
db.clients.insertMany([
  { name: "Dave America", State: "Florida" },
  { name: "Ned Flanders", State: "Alasca" },
  { name: "Mark Zuck", State: "Texas" },
  { name: "Edna Krabappel", State: "Montana" },
  { name: "Arnold Schuz", State: "California" },
  { name: "Lisa Simpson", State: "Florida" },
  { name: "Barney Gumble", State: "Texas" },
  { name: "Homer Simpson", State: "Florida" },
]);
```

1 - Selecione todos os clientes com as suas respectivas transações feitas:
```js
db.clients.aggregate([
  {
$lookup: {
      from: "transactions",
      localField: "name",
      foreignField: "from",
      as: "transactions_docs"
    }
  }
]);
```

2 - Selecione quatro clientes com as suas respectivas transações recebidas:
```js
db.clients.aggregate([
  {
$lookup: {
      from: "transactions",
      localField: "name",
      foreignField: "to",
      as: "transactions_docs"
    }
  },
  {$limit: 4}
]);
```

3 - Selecione todos os cliente do estado da "Florida" e suas respectivas transações recebidas:
```js
db.clients.aggregate([
  {
    $match: {State: "Florida"}
  },
  {
    $lookup: {
      from: "transactions",
      localField: "name",
      foreignField: "to",
      as: "transactions_docs"
    }
  }
]);
```
