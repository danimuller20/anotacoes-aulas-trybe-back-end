# Updates Simples

#### Utilizar o método updateOne()

No exemplo abaixo, o método db.colecao.updateOne() é utilizado para alterar o primeiro documento na coleção inventory em que o campo item seja igual a "paper":

```js
db.inventory.updateOne(
  { item: "paper" },
  { $set: { "size.uom": "cm", status: "P" } }
);
```
Esse métodos pode receber dois parâmetros:
* O primeiro deles é o filtro. Nesse caso, um filtro simples de igualdade, mas outros operadores podem ser utilizados aqui;
* O segundo é a operação de update em si. Nesse caso, foi utilizado o operador de atualização $set para alterar o valor do campo size.uom para cm e o valor do campo status para P.

❗Chamando o método **db.colecao.updateOne()** com o parâmetro de filtro vazio { }, o **resultado é a atualização do primeiro documento presente em colecao**.❗  

#### Utilizar o método updateMany()

No exemplo abaixo, o método db.colecao.updateMany() é utilizado para alterar todos os documentos da coleção inventory em que o valor do campo qty seja menor do que 50 :

```js
db.inventory.updateMany(
  { "qty": { $lt: 50 } },
  { $set: { "size.uom": "in", status: "P" } }
);
```

Se você tiver 10 documentos na coleção inventory em que o valor do campo qty seja menor do que 50 (esse valor foi passado como parâmetro do filtro e utilizou o operador $lt ), todos esses documentos serão alterados em uma única operação.

❗Chamando o método **db.colecao.updateMany()** com o parâmetro de filtro vazio { }, o resultado é a **atualização de todos os documentos presentes em colecao**.❗

#### Utilizar os operadores ```$set, $mul, $inc, $min, $max e $currentDate```

**Operador $set:**
* Alterando campos no primeiro nível (top-level)

```js
db.products.update(
  { _id: 100 },
  { $set: {
      quantity: 500,
      details: { model: "14Q3", make: "xyz" },
      tags: [ "coats", "outerwear", "clothing" ]
    }
  }
);
```
No exemplo acima, vários campos foram agrupados e, com isso, são alterados em um mesmo comando! Assim, você pode alterar vários campos de uma única vez.

* Alterando campos em documentos embedados:

A operação abaixo altera o valor do campo make dentro do subdocumento details em que o campo _id seja igual a 100.

```js
db.products.update(
  { _id: 100 },
  { $set: { "details.make": "zzz" } }
);
```

* Alterando valores em arrays:

A query abaixo tem como critério de seleção o campo _id igual a 100 . Ela altera o segundo elemento (índice 1 ) do array tags e o campo rating no primeiro elemento (índice 0 ) do array ratings.

```js
db.products.update(
  { _id: 100 },
  { $set: {
      "tags.1": "rain gear",
      "ratings.0.rating": 2
    }
  }
);
```

**Operador $mul:**

O operador ```$mul``` multiplica o valor de um campo por um número especificado, persistindo o resultado dessa operação sem a necessidade do operador ```$set```.

* NumberDecimal:

A query abaixo altera esse documento, utilizando o operador ```$mul``` para multiplicar os valores dos campos price e qty :
```js
db.products.update(
  { _id: 1 },
  { $mul: { price: NumberDecimal("1.25"), qty: 2 } }
);
```

O resultado dessa operação é o documento abaixo, em que o novo valor do campo price é o valor original 10.99 multiplicado por 1.25 , e o valor do campo qty , que originalmente era 25 , é multiplicado por 2:

```js
{ "_id": 1, "item": "ABC", "price": NumberDecimal("13.7375"), "qty": 50 }
```
* NumberLong:

A query abaixo faz um update no documento, aplicando o operador $mul no campo price, que não existe neste documento:

```js
db.products.update(
  { _id: 2 },
  { $mul: { price: NumberLong("100") } }
);
```

Como resultado, temos o campo price criado no documento com valor zero do mesmo tipo numérico do multiplicador. Nesse caso, o tipo é NumberLong:

```js
{ "_id": 2, "item": "Unknown", "price": NumberLong(0) }
```
* NumberInt:

A query abaixo faz um update, multiplicando o valor do campo price, que é do tipo NumberLong("10") , por NumberInt(5) :

```js
db.products.update(
  { _id: 3 },
  { $mul: { price: NumberInt(5) } }
);
```

E como resultado temos o seguinte:

```js
{ "_id": 3, "item": "XYZ", "price": NumberLong(50) }
```

[Regras de Conversão de Tipos em Multiplicações.](https://docs.mongodb.com/manual/reference/operator/update/mul/#multiplication-type-conversion)

**Operador $inc:**

Com o operador ```$inc```, você pode incrementar ou decrementar valores em um campo específico, utilizando tanto valores positivos quanto negativos.

Esse operador é bastante útil para fazer alterações em campos numéricos sem a necessidade prévia de uma consulta para retornar o valor atual do campo. Com o $inc , em uma única operação isso é possível!

Na operação de update a seguir, o operador $inc é utilizado para decrementar o valor do campo qty em 2 (incrementa em -2 ) e incrementar o valor do campo metrics.orders em 1:

```js
db.increment.update(
  { sku: "abc123" },
  { $inc: { quantity: -2, "metrics.orders": 1 } }
);
```

O resultado:
```js
{
    _id: 1,
    sku: 'abc123',
    quantity: 8,
    metrics: { orders: 3, ratings: 3.5 }
  }
```

em uma única chamada ao operador ```$inc```, você consegue aumentar e diminuir os valores de campos diferentes.

**Operadores ```$min``` e ```$max```:**

* ```$min```: altera o valor do campo para o valor especificado **se** esse valor especificado é **menor do que** o atual valor do campo;
* ```$max```: faz o mesmo, porém altera o valor do campo **se** o valor especificado é **maior do que** o atual valor do campo.

Ambos podem comparar valores de diferentes tipos, utilizando sempre a [ordem de comparação BSON](https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#faq-dev-compare-order-for-bson-types).

Temos a seguinte collection:
```js
[
  { _id: 1, campo: 25 },
  { _id: 2, campo: 50 },
  { _id: 3, campo: 100 }
]
```

* **$max : "arrasta" os valores para cima:**

Nosso intuito é atingir todos os documentos com o atributo campo que possuem um valor de no máximo 75 . Nesse caso, o operador não só define o escopo máximo, como também o conteúdo que o campo deve passar a ter:

```js
db.collection.updateMany({}, { $max: { campo: 75 } });
// Atualizando todos os valores do atributo "campo"
// para 75 caso sejam menores
```

Resultado:
```js
[
  { _id: 1, campo: 75 }, // valor anterior: 25
  { _id: 2, campo: 75 }, // valor anterior: 50
  { _id: 3, campo: 100 }, // não encontrou no escopo
]
```

* **$min: "arrasta" os valores para baixo:**

Com o operador ```$min``` é praticamente a mesma coisa, porém na direção **inversa**:

```js
db.collection.updateMany({}, { $min: { campo: 42 } });
// Atualizando todos os valores do atributo "campo"
// para 42 caso sejam maiores
```

Resultado:

```js
[
  { _id: 1, campo: 42 }, // valor anterior: 75
  { _id: 2, campo: 42 }, // valor anterior: 75
  { _id: 3, campo: 42 }, // valor anterior: 100
]
```

**Comparando números:**

Temos a seguinte collection de scores:

```js
[ { _id: 1, highScore: 800, lowScore: 200 } ]
```

No documento de exemplo, o valor atual do campo lowscore é 200. A operação abaixo utiliza o ```$min``` para comparar 200 com o valor especificado 150 e altera o valor do campo lowscore para 150 porque 150 é menor do que 200:

```js
db.scores.update({ _id: 1 }, { $min: { lowScore: 150 } });
```

Resultado: 
```js
{ _id: 1, highScore: 800, lowScore: 150 }
```

Atualmente, o campo highscore tem o valor 800. A operação abaixo usa o ```$max``` para comparar 800 e o valor especificado 950 , e então altera o valor do campo highscore para 950 porque 950 é maior que 800:
```js
db.scores.update({ _id: 1 }, { $max: { highScore: 950 } });
```

Resultado:
```js
{ _id: 1, highScore: 950, lowScore: 150 }
```

**Comparando datas:**

Você pode utilizar os operadores $min e $max para comparar valores do tipo Date.
Considere a seguinte coleção tags:

```js
db.tags.insertOne(
  {
    _id: 1,
    desc: "crafts",
    dateEntered: ISODate("2019-10-01T05:00:00Z"),
    dateExpired: ISODate("2019-10-01T16:38:16Z")
  }
);
```

A operação abaixo utiliza o operador $min para comparar o valor do campo dateEntered e altera seu valor porque 25/09/2019 é uma data menor (anterior) do que o valor atual, ao mesmo tempo em que o operador $max também é usado para comparar o valor do campo dateExpired e altera esse valor porque 02/10/2019 é uma data maior (posterior) do que o valor atual:

```js
db.tags.update(
  { _id: 1 },
  {
$min: { dateEntered: new Date("2019-09-25") },
$max: { dateExpired: new Date("2019-10-02") }
  }
);
```

**Operador ```$currentDate```:**

O operador ```$currentDate``` atribui ao valor de um campo a data corrente , utilizando um tipo Date ou timestamp . Se você não especificar o tipo, por padrão, o MongoDB atribuirá o valor do tipo Date.

Ambos podem comparar valores de diferentes tipos, utilizando sempre a typeSpecification pode ser:
* um valor booleano true para atribuir o valor da data corrente ao campo utilizando o tipo ```Date```; ou
* um documento que especifica o tipo do campo. Esse documento pode ser ```{ $type: "timestamp" }``` ou ```{ $type: "date" }```. Esse operador é case-sensitive e aceita somente letras minúsculas: ```timestamp``` ou ```date```.

Veja o funcionamento do operador $currentDate , considerando o seguinte documento da coleção customers:

```js
db.customers.insertOne(
  { _id: 1, status: "a", lastModified: ISODate("2013-10-02T01:11:18.965Z") }
);
```

Com a operação abaixo, é possível alterar o valor do campo ```lastModified``` para a data corrente e criar o campo ```cancellation.date``` com o ```timestamp``` corrente, utilizando o operador ```$currentDate```, e ainda alterar o campo ```status``` para ```D``` e criar o campo ```cancellation.reason``` com o valor "user request" , utilizando o operador ```$set```:

```js
db.customers.updateOne(
  { _id: 1 },
  { $currentDate: {
      lastModified: true,
      "cancellation.date": { $type: "timestamp" }
    }, $set: {
      "cancellation.reason": "user request",
      status: "D"
    }
  }
);
```

Resultado:

```js
[
  {
    _id: 1,
    status: 'D',
    lastModified: ISODate("2021-06-07T14:54:31.912Z"),
    cancellation: { date: Timestamp(1, 1623077671), reason: 'user request' }
  }
]
```

#### Renomear campos com o operador```$rename```

**Operador ```$rename```**

Você pode querer renomear um determinado atributo de um ou mais documentos. Para isso, utilize o operador ```$rename```.

Esse operador recebe um documento contendo o nome atual do campo e o novo nome. Pode ser utilizado com os métodos ```updateOne()``` ou ```updateMany()```, e também pode receber um critério de seleção de documentos.

Considerando o seguinte documento da coleção ```fruits```:

```js
use conteudo_trybe;
db.fruits.insertOne(
  { _id: 100, name: "Banana", quantity: 100, inStock: true }
);
```

A operação a seguir altera o nome do campo ```name``` para ```productNam``` e no documento em que o valor do campo ```name``` seja igual a ```Banana```:

```js
db.fruits.updateOne(
  { name: "Banana" },
  { $rename: {
      "name": "productName"
    }
  }
);
```

Resultado:

```js
[ { _id: 100, quantity: 100, inStock: true, productName: 'Banana' } ]
```

#### Removendo campos com o operador ```$unset```

**Operador ```$unset```:**

Para remover um ou mais campos de um documento, utilize o operador ```$unset```.
Considerando o documento abaixo na coleção ```fruits```:

```js
{
  _id: 100,
  productName: "Banana",
  quantity: 100,
  inStock: true
}
```

A operação abaixo remove o campo ```quantity``` do documento em que o valor do campo ```productName``` seja igual a ```Banana```:

```js
db.fruits.updateMany(
  { productName: "Banana" },
  { $unset: { quantity: "" } }
);
```

Resultado:

```js
[ { _id: 100, inStock: true, productName: 'Banana' } ]
```
