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

Você pode utilizar os operadores ```$min``` e ```$max``` para comparar valores do tipo Date.
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

#### Usando operador ```$each``` com ```$addToSet```
[Link para mais informações](https://docs.mongodb.com/manual/reference/operator/update/each/)
#### Usando o operador ```$upsert```
[mais informações](https://docs.mongodb.com/manual/reference/method/db.collection.update/#std-label-method-update-sharded-upsert)

# Updates Complexos - Arrays - Parte 1

#### utilizando o operador ```$push```

O operador $push adiciona um valor a um array . Se o campo não existir no documento, um novo array com o valor em um elemento será adicionado.

Em conjunto com o ```$push```, você pode utilizar o que chamamos de **modificadores**. Cada um desses modificadores tem funções específicas que você verá melhor com exemplos.
São eles:

* ```$each```: Adiciona múltiplos valores a um array;
* ```$slice```: Limita o número de elementos do array. Requer o uso do modificador ```$each```;
* ```$sort```: Ordena os elementos do array. Requer o uso do modificador ```$each```;
* ```$position```: Especifica a posição do elemento que está sendo inserido no array. Também requer o modificador ```$each```. Sem o modificador ```$position```, o operador ```$push``` adiciona o elemento no final do array.

Quando você utiliza um modificador, o processo de push ocorre na seguinte ordem, independentemente da ordem em que os modificadores aparecem:

1 - Altera o array para adicionar os elementos na posição correta;
2 - Aplica a ordenação (```$sort```), se especificada;
3 - Limita o array (```$slice```), se especificado;
4 - Armazena o array.

**Adicionando um valor a um array:**

Para não precisarmos escrever uma query só para fazer o insert do documento, vamos usar a opção upsert: true para já adicionar o elemento ao mesmo tempo que usamos o operador ```$push```. É importante ficar nítido que a condição upsert não influencia a forma como o ```$push``` funciona.

```js
use sales;
db.supplies.updateOne(
  { _id: 1 },
  {
push: {
      items: {
        "name": "notepad",
        "price":  35.29,
        "quantity": 2,
      },
    },
  },
  { upsert: true },
);
```

Veja, o método updateOne() é o mesmo que você já utilizou nos exemplos anteriores. A única diferença é a inclusão do operador $push . O resultado dessa operação é um documento com o seguinte schema:

```js
{
    _id : 1,
    items : [
        {
            "name" : "notepad",
            "price" : 35.29,
            "quantity" : 2,
        },
    ],
}
```

**Adicionando múltiplos valores a um array:**

A operação abaixo adicionará mais dois produtos ao array items do primeiro documento na coleção supplies utilizando também o modificador ```$each```:

```js
db.supplies.updateOne(
  {},
  {
push: {
      items: {
each: [
          {
            "name": "pens",
            "price": 56.12,
            "quantity": 5,
          },
          {
            "name": "envelopes",
            "price": 19.95,
            "quantity": 8,
          },
        ],
      },
    },
  },
  { upsert: true },
);
```

Resultado:

```js
{
    _id : 1,
    items : [
        {
            "name" : "notepad",
            "price" : 35.29,
            "quantity" : 2,
        },
        {
            "name" : "pens",
            "price" : 56.12,
            "quantity" : 5,
        },
        {
            "name" : "envelopes",
            "price" : 19.95,
            "quantity" : 8,
        },
    ],
}
```

**Múltiplos modificadores:**

O ```$push``` pode ser utilizado com múltiplos modificadores, fazendo várias operações ao mesmo tempo em um array.

```js
db.supplies.updateOne(
  { _id: 1 },
  {
push: {
      items: {
each: [
          {
            "name" : "notepad",
            "price" : 35.29,
            "quantity" : 2,
          },
          {
            "name": "envelopes",
            "price": 19.95,
            "quantity": 8,
          },
          {
            "name": "pens",
            "price": 56.12,
            "quantity": 5,
          },
        ],
sort: { quantity: -1 },
slice: 2,
      },
    },
  },
  { upsert: true },
);
```

Essa operação utiliza os seguintes modificadores:

* O modificador ```$each``` para adicionar múltiplos documentos ao array items;
* O modificador ```$sort``` para ordenar todos os elementos alterados no array items pelo campo quantity em ordem descendente;
* E o modificador ```$slice``` para manter apenas os dois primeiros elementos ordenados no array items.

Em resumo, essa operação mantém no array items apenas os dois documentos com a quantidade (campo quantity ) mais alto. Veja o resultado logo abaixo:

```js
{
  _id : 1,
  items : [
    {
      "name" : "envelopes",
      "price" : 19.95,
      "quantity" : 8,
    },
    {
      "name" : "pens",
      "price" : 56.12,
      "quantity" : 5,
    },
  ],
}
```

#### Utilizando o operador ```$pop```

Remove o primeiro ou o último elemento de um array:

* O valor -1 removerá o primeiro elemento;
* O valor 1 removerá o último elemento do array.

Dado o seguinte documento na coleção supplies:

```js
{
  _id: 1,
  items: [
    {
      "name" : "notepad",
      "price" : 35.29,
      "quantity" : 2,
    },
    {
      "name": "envelopes",
      "price": 19.95,
      "quantity": 8,
    },
    {
      "name": "pens",
      "price": 56.12,
      "quantity": 5,
    },
  ],
}
```

**Removendo o primeiro item de um array:**

Remove o primeiro elemento do array items:
```js
db.supplies.updateOne({ _id: 1 }, { $pop: { items: -1 } });
```

Resultado

```js
{
  _id: 1,
  items: [
    {
      "name": "envelopes",
      "price": 19.95,
      "quantity": 8,
    },
    {
      "name": "pens",
      "price": 56.12,
      "quantity": 5,
    },
  ],
}
```

**Removendo o último item de um array:**

Remove o último item do array itens:

```js
db.supplies.updateOne({ _id: 1 }, { $pop: { items: 1 } });
```

Resultado:

```js
{
  _id: 1,
  items: [
    {
      "name" : "notepad",
      "price" : 35.29,
      "quantity" : 2,
    },
    {
      "name": "envelopes",
      "price": 19.95,
      "quantity": 8,
    },
  ],
}
```

#### Utilizando o operador ```$pull```

Remove de um array existente todos os elementos com um ou mais valores que atendam à condição especificada.

**Removendo todos os itens iguais a um valor especificado:**

Considerando os seguintes documentos na coleção supplies:

```js
{
  _id: 1,
  items: [
    {
      "name" : "notepad",
      "price" : 35.29,
      "quantity" : 2,
    },
    {
      "name": "envelopes",
      "price": 19.95,
      "quantity": 8,
    },
    {
      "name": "pens",
      "price": 56.12,
      "quantity": 5,
    },
  ],
},
{
  _id: 2,
  items: [
    {
      "name" : "pencil",
      "price" : 5.29,
      "quantity" : 2,
    },
    {
      "name": "envelopes",
      "price": 19.95,
      "quantity": 8,
    },
    {
      "name": "backpack",
      "price": 80.12,
      "quantity": 1,
    },
    {
      "name": "pens",
      "price": 56.12,
      "quantity": 5,
    },
  ],
}
```

Remove do array items os elementos pens e envelopes:

```js
db.supplies.updateMany(
  {},
  {
pull: {
      items: {
        name: { $in: ["pens", "envelopes"] },
      },
    },
  },
);
```
Na atualização acima, foi utilizado o operador $pull combinado com o operador $in para alterar o array items.

Resultado:

```js
{
  _id : 1,
  items : [
    {
      "name" : "notepad",
      "price" : 35.29,
      "quantity" : 2,
    },
  ],
},
{
  _id : 2,
  items : [
    {
      "name" : "pencil",
      "price" : 5.29,
      "quantity" : 2,
    },
    {
      "name" : "backpack",
      "price" : 80.12,
      "quantity" : 1,
    },
  ],
}
```

**Removendo todos os itens que atendem a uma condição diretamente no ```$pull```:**

Tendo o seguinte documento na coleção profiles:

```js
{ _id: 1, votes: [3, 5, 6, 7, 7, 8] }
```

Remove todos os elementos do array votes que sejam maiores ou iguais a ( $gte ) 6 . Por exemplo:

```js
db.profiles.updateOne(
  { _id: 1 },
  {
pull: {
      votes: { $gte: 6 },
    },
  },
);
```

Resultado:

```js
{ _id: 1, votes: [3,  5] }
```

**Removendo itens em um array de Documentos:**

Temos a coleção survey com os seguintes documentos:

```js
{
  _id: 1,
  results: [
    { item: "A", score: 5 },
    { item: "B", score: 8, comment: "Strongly agree" },
  ],
},
{
  _id: 2,
  results: [
    { item: "C", score: 8, comment: "Strongly agree" },
    { item: "B", score: 4 },
  ],
}
```

Os documentos têm um array chamado results que armazena documentos.

Com a operação abaixo, você consegue remover do array results todos os elementos que contenham o campo score igual a 8 e o campo item igual a "B" . Ou seja, o documento deve atender a ambas as condições.

```js
db.survey.updateMany(
  {},
  {
pull: {
      results: { score: 8 , item: "B" },
    },
  },
);
```

A expressão do operador $pull aplica as condições a cada elemento do array results como se estivesse no primeiro nível, isso porque os documentos dentro do array results não contêm outros campos com mais arrays . Se isso acontecer, você deve utilizar uma outra abordagem, que será detalhada mais à frente.

Resultado:

```js
{
  _id: 1,
  results: [ { "item": "A", "score": 5 } ],
},
{
  _id: 2,
  results: [
    { "item": "C", "score": 8, "comment": "Strongly agree" },
    { "item": "B", "score": 4 },
  ],
}
```

#### utilizando o operador ```$addToSet```

O operador ```$addToSet``` é utilizado quando você precisa garantir que os valores de um array não sejam duplicados. Ou seja, ele garante que apenas valores únicos estejam presentes no array, tratando o array como se fosse um conjunto (uma vez que conjuntos, na matemática, não podem conter elementos duplicados).

Três aspectos sobre o $addToSet:

* Se você utilizá-lo em um campo que não existe no documento alterado, ele criará um campo do tipo array com o valor especificado na operação;

* Se você utilizá-lo em um campo já existente no documento, mas esse campo não for um array , a operação não funcionará;

* Se o valor passado for um documento, o MongoDB o considerará como duplicado se um documento existente no array for exatamente igual ao documento a ser adicionado, ou seja, possui os mesmos campos com os mesmos valores, e esses campos estão na mesma ordem.


Considerando o documento abaixo na coleção inventory:

```js
{
  _id: 1,
  item: "polarizing_filter",
  tags: ["electronics", "camera"],
}
```

**Adicionando ao array:**

A operação abaixo adiciona o elemento "accessories" ao array tags desde que "accessories" não exista no array:

```js
db.inventory.updateOne(
  { _id: 1 },
  { $addToSet: { tags: "accessories" } },
);
```

Resultado:

```js
{
  _id: 1,
  item: "polarizing_filter",
  tags: [
    "electronics",
    "camera",
    "accessories",
  ],
}
```

**Se o valor existir:**

A operação abaixo tenta adicionar o elemento "camera" ao array tags . Porém, esse elemento já existe, e a operação não surtirá efeito:

```js
db.inventory.updateOne(
  { _id: 1 },
  { $addToSet: { tags: "camera"  } },
);
```

Como resultado dessa operação, é retornada uma mensagem dizendo que o MongoDB encontrou um documento com o _id igual a 1 , mas não fez nenhuma alteração:

Mensagem de retorno:
```js
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 0 }
```

**Com o modificador ```$each```:**

Você pode utilizar o operador ```$addToSet``` combinado com o modificador ```$each```. Esse modificador permite que você adicione múltiplos valores a um array.

Veja o seguinte documento da coleção inventory :

```js
{ _id: 2, item: "cable", tags: ["electronics", "supplies"] }
```

A operação abaixo utiliza o operador ```$addToSet``` e o modificador ```$each``` para adicionar alguns elementos a mais no array tags:

```js
db.inventory.updateOne(
  { _id: 2 },
  {
addToSet: {
      tags: {
each: ["camera", "electronics", "accessories"],
      },
    },
  },
);
```

Como resultado, a operação adicionará ao array tags somente os elementos "camera" e "accessories" , uma vez que o elemento "electronics" já existia no array.
Resultado:

```js
{
  _id: 2,
  item: "cable",
  tags: ["electronics", "supplies", "camera", "accessories"],
}
```

#### Array Filters

Imagine que você precisa de documentos que tenham apenas um valor que está dentro de um array de objetos.

Tendo a collection abaixo:

```js
db.recipes.insertMany([
  {
    title: "Panqueca Simples",
    ingredients: [
      { name: "Farinha", quantity: 2},
      { name: "Oleo", quantity: 4 },
      { name: "Leite", quantity: 1 },
    ],
  },
  {
    title: "Bolo de Cenoura",
    ingredients: [
      { name: "Farinha", quantity: 2},
      { name: "Oleo", quantity: 1, unit: "xícara" },
      { name: "Ovo", quantity: 3},
      { name: "Cenoura", quantity: 3},
      { name: "Fermento", quantity: 1},
    ],
  },
]);
```

Caso você saiba o index exato do elemento em que deseja-se alterar alguma propriedade, pode-se fazer algo como:

```js
db.recipes.updateOne( { title: "Panqueca Simples" }, { $set: { "ingredients.1.unit": "xícara" } } );
```
Alterações dinâmicas em arrays usando ```Array Filters```

```js 
db.recipes.updateOne(
  { title: "Panqueca Simples" },
  {
$set : {
      "ingredients.$[elemento].name": "Farinha Integral",
    },
  },
  { $arrayFilters: [ { "elemento.name": "Farinha" } ] },
);
```
Achamos um documento com title igual a "Panqueca Simples" e atualizamos o objeto com propriedade name igual a "Farinha" do array ingredients. Agora, vamos adicionar "xícara" ao campo unit do objeto com name igual a "Farinha Integral"!

```js
db.recipes.updateOne(
  { title: "Panqueca Simples" },
  {
$set : {
      "ingredients.$[elemento].unit": "xícara",
    },
  },
  { arrayFilters: [ { "elemento.name": "Farinha Integral" } ] },
);
```

Se quiséssemos trocar todos os ingredientes da coleção que são "Farinha" por "Farinha Integral" e colocar "xícara" como valor de unit , poderíamos seguir o seguinte exemplo:

```js
db.recipes.updateMany( // Passamos de updateOne para updateMany.
  {}, // Retiramos a restrição do título.
  {
$set : {
      "ingredients.$[elemento].unit": "xícara", // Setamos `unit` como "xícara",
      "ingredients.$[elemento].name": "Farinha Integral", // `name` como "Farinha Integral".
    },
  },
  { arrayFilters: [ { "elemento.name": "Farinha" } ] }, // Filtramos os arrays que o valor da propriedade `name` seja "Farinha".
);
```

# Updates Complexos - Arrays - Parte 2

#### Utilizando o operador ```$all``` para filtrar documentos

Utiliza-se ```$all``` sempre que é preciso passar mais de um valor de comparação, e é irrelevante tanto a existência de mais elementos no array quanto a ordem em que esses elementos estão.
Entenda essa diferença com estas duas queries:

```js
db.inventory.find({ tags: ["red", "blank"] });

db.inventory.find({ tags: { $all: ["red", "blank"] } });
```

* A primeira query retornará somente os documentos em que o array tags seja exatamente igual ao passado como parâmetro no filtro, ou seja, contenha apenas esses dois elementos, na mesma ordem.
* Já a segunda analisará o mesmo array, independentemente da existência de outros valores ou a ordem em que os elementos estejam.

Veja um exemplo utilizando o ```$all```:

```js
db.inventory.find(
  { tags: { $all: [ "ssl", "security" ] } }
);
```

#### Utilizando o operador ```$elemMatch``` para filtrar documentos

O operador ```$elemMatch``` seleciona os documentos que contêm um campo do tipo array com pelo menos um elemento que satisfaça todos os critérios de seleção especificados. Ou seja, com esse operador você pode especificar várias queries para um mesmo array .

Veja um exemplo considerando a coleção scores com os seguintes documentos:

```js
{ _id: 1, results: [82, 85, 88] },
{ _id: 2, results: [75, 88, 89] }
```

A query abaixo seleciona somente os documentos em que o array results contém ao menos um elemento que seja maior ou igual a 80 e menor que 85 :

```js
db.scores.find(
  { results: { $elemMatch: { $gte: 80, $lt: 85 } } }
);
```

Resultado:

```js
{ _id: 1, results: [82, 85, 88] }
```

Podemos utilizar o operador ```$elemMatch``` em arrays que contenham subdocumentos e especificar vários campos desses subdocumentos como filtro.
Considerando o seguintes dados:

```js
{
  _id: 1,
  results: [
    { product: "abc", score: 10 },
    { product: "xyz", score: 5 }
  ]
},
{
  _id: 2,
  results: [
    { product: "abc", score: 8 },
    { product: "xyz", score: 7 }
  ]
},
{
  _id: 3,
  results: [
    { product: "abc", score: 7 },
    { product: "xyz", score: 8 }
  ]
}
```

A query abaixo selecionará apenas os documentos em que o array results contenha ao menos um elemento subdocumento com o campo product igual a xyz e o campo score maior ou igual a 8 :

```js
db.survey.find(
  { results: { $elemMatch: { product: "xyz", score: { $gte: 8 } } } }
);
```

Resultado:

```js
{
  _id: 3,
  results: [
    { product: "abc", score: 7 },
    { product: "xyz", score: 8 }
  ]
}
```

#### Utilizando o operador ```$size``` para filtrar documentos pelo tamanho de arrays

O operador ```$size``` seleciona documentos em que um array contenha um número de elementos especificado.
Considere a coleção products a seguir, contendo documentos em que o campo tags pode ser um array :

```js
{ _id: 1, tags: ["red", "green"] },
{ _id: 2, tags: ["apple", "lime"] },
{ _id: 3, tags: "fruit" },
{ _id: 4, tags: ["orange", "lemon", "grapefruit"] }
```
Ao executar a query abaixo, apenas os documentos com o _id igual 1 e 2 serão retornados, pois seus campos tags são arrays e contêm exatamente 2 elementos :

```js
db.products.find(
  { tags: { $size: 2 } }
);
```
Resultado:

```js
{ _id: 1, tags: ["red", "green"] },
{ _id: 2, tags: ["apple", "lime"] }
```
❗É importante saber que o operador $size não aceita ranges de valores. Se você precisar selecionar documentos com base em valores diferentes, a solução é criar um campo que se incremente quando elementos forem adicionados ao array❗

#### Utilizando o operador ```$expr``` para criar expressões de agregação;

O operador $expr permite que você utilize [expressões de agregação](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#aggregation-expressions) e construa queries que comparem campos no mesmo documento.
Considere os documentos abaixo na coleção monthlyBudget :

```js
{ _id: 1, category: "food", budget: 400, spent: 450 },
{ _id: 2, category: "drinks", budget: 100, spent: 150 },
{ _id: 3, category: "clothes", budget: 100, spent: 50 },
{ _id: 4, category: "misc", budget: 500, spent: 300 },
{ _id: 5, category: "travel", budget: 200, spent: 650 }
```
A query abaixo utiliza o operador $expr para buscar os documentos em que o valor de spent exceda o valor de budget:

```js
db.monthlyBudget.find(
  {
expr: { $gt: [ "$spent", "$budget" ] }
  }
);
```

Resultado:

```js
{ "_id" : 1, "category" : "food", "budget" : 400, "spent" : 450 }
{ "_id" : 2, "category" : "drinks", "budget" : 100, "spent" : 150 }
{ "_id" : 5, "category" : "travel", "budget" : 200, "spent" : 650 }
```

Note que, na query, nenhum valor foi especificado explicitamente. O que acontece é que o operador ```$expr``` entende que deve comparar os valores dos dois campos. Por isso o ```$``` é utilizado, indicando que a string entre aspas referencia um campo.

#### Utilizando expressões regulares e o operador $regex para buscar documentos;

O operador ```$regex``` fornece os "poderes" das expressões regulares (regular expressions) para seleção de strings. MongoDB utiliza expressões regulares compatíveis com Perl [(PCRE)](https://www.pcre.org/), versão 8.42, e com suporte a UTF-8 .
Um uso muito comum para o operador $regex é fazer consultas como o LIKE do SQL. Considere os seguintes documentos na coleção products:

```js
{ _id: 100, sku: "abc123", description: "Single line description." },
{ _id: 101, sku: "abc789", description: "First line\nSecond line" },
{ _id: 102, sku: "xyz456", description: "Many spaces before     line" },
{ _id: 103, sku: "xyz789", description: "Multiple\nline description" }
```

A query abaixo seleciona todos os documentos em que o campo sku termine com "789":

```js
db.products.find({ sku: { $regex: /789$/ } });
```
Resultado:

```js
{ _id: 101, sku: "abc789", description: "First line\nSecond line" },
{ _id: 103, sku: "xyz789", description: "Multiple\nline description" }
```

Você pode especificar a opção case-insensitive, fazendo com que o MongoDB ignore letras maiúsculas ou minúsculas:

```js
db.products.find({ sku: { $regex: /^ABC/i } });
```

O caractere i ao lado da expressão indica a opção case-insensitive . Dessa forma, apenas os documentos que contenham ABC no campo sku serão retornados, sem se importar se está em maiúsculo ou minúsculo:

```js
{ "_id" : 100, "sku" : "abc123", "description" : "Single line description." }
{ "_id" : 101, "sku" : "abc789", "description" : "First line\nSecond line" }
```

[Mais informações sobre o $regex](https://docs.mongodb.com/manual/reference/operator/query/regex/)

#### Utilizando o índice textual e o operador ```$text```

O operador ```$text``` faz uma busca "textual" em um campo indexado por um [text index](https://docs.mongodb.com/manual/core/index-text/).
A expressão para utilizar o $text tem a seguinte sintaxe:

```js
{
text:
    {
search: <string>,
language: <string>,
caseSensitive: <boolean>,
diacriticSensitive: <boolean>
    }
}
```
Em que: 

* ```$search```: Uma string com **os termos** que o **MongoDB** utilizará para fazer o parse e utilizará como filtro. Internamente, o **MongoDB** faz uma busca lógica (```OR```) sobre os termos, a menos que seja especificado como uma frase inteira;

* ```$language```: Opcional. Esse campo determina a lista de stop words que será utilizada na tokenização da busca. Veja a [lista](https://docs.mongodb.com/manual/reference/text-search-languages/#text-search-languages) de idiomas suportados. Se você passar o valor none, a busca utilizará uma tokenização simples sem utilizar nenhuma lista de stop words;
    * Stop word: Também conhecido como palavra vazia, é uma palavra que é removida antes ou após o processamento de um texto em linguagem natural.

* ```$caseSensitive```: Opcional. Recebe um valor booleano para habilitar ou desabilitar buscas case sensitive. O valor default é false, o que faz com que as buscas sejam ```case-insensitive```. Veja mais informações sobre ```case-insensitive``` [aqui](https://docs.mongodb.com/manual/reference/operator/query/text/#text-operator-case-sensitivity);

* ```$diacriticSensitive```: Opcional. Recebe um valor booleano para habilitar ou desabilitar busca [diacritic sensitive](https://docs.mongodb.com/manual/reference/operator/query/text/#text-operator-diacritic-sensitivity). O valor default também é ```false```.

O operador ```$text```, por padrão, não retorna os resultados ordenados pelas pontuações (```score```). Veja mais informações sobre ordenação por scores [aqui](https://docs.mongodb.com/manual/reference/operator/query/text/#text-operator-text-score).

O ```score``` é atribuído a cada documento que contenha o termo procurado no campo. Esse ```score``` representa a relevância do documento para a busca textual aplicada. O ```score``` pode ser parte do método ```sort()``` ou parte de uma projeção.
Considerando a coleção articles e um índice textual no campo subject.
Primeiro, o comando para criar o índice do tipo text:

```js
db.articles.createIndex({ subject: "text" });
```
Documentos na coleção articles:

```js
{ _id: 1, subject: "coffee", author: "xyz", views: 50 },
{ _id: 2, subject: "Coffee Shopping", author: "efg", views: 5 },
{ _id: 3, subject: "Baking a cake", author: "abc", views: 90  },
{ _id: 4, subject: "baking", author: "xyz", views: 100 },
{ _id: 5, subject: "Café Com Leite", author: "abc", views: 200 },
{ _id: 6, subject: "Сырники", author: "jkl", views: 80 },
{ _id: 7, subject: "coffee and cream", author: "efg", views: 10 },
{ _id: 8, subject: "Cafe com Leite", author: "xyz", views: 10 }
```

**Procurando um único termo:**

A query abaixo utiliza os operadores ```$text``` e ```$search``` para buscar todos os documentos que contenham o termo ```coffee```:

```js
db.articles.find({ $text: { $search: "coffee" } });
```
Resultado: 

```js
[
  { _id: 1, subject: 'coffee', author: 'xyz', views: 50 },
  { _id: 7, subject: 'coffee and cream', author: 'efg', views: 10 },
  { _id: 2, subject: 'Coffee Shopping', author: 'efg', views: 5 }
]
```

**Procurando qualquer um dos termos especificados:**

Você pode procurar por vários termos passando uma string delimitada por espaços. O operador ```$text``` fará uma busca lógica OR por cada um desses termos, retornando os documentos que contenham qualquer um deles.
A query abaixo especifica três termos (```"bake coffee cake"```) para a string ```$search```:

```js
db.articles.find({ $text: { $search: "bake coffee cake" } });
```

Resultado:

```js
[
  { _id: 4, subject: 'baking', author: 'xyz', views: 100 },
  { _id: 3, subject: 'Baking a cake', author: 'abc', views: 90 },
  { _id: 1, subject: 'coffee', author: 'xyz', views: 50 },
  { _id: 7, subject: 'coffee and cream', author: 'efg', views: 10 },
  { _id: 2, subject: 'Coffee Shopping', author: 'efg', views: 5 }
]
```

**Procurando por uma frase:**

A query abaixo procura pela frase "coffee shop" :

```js
db.articles.find({ $text: { $search: "\"coffee shop\"" } });
```

Resultado:

```js
[ { _id: 2, subject: 'Coffee Shopping', author: 'efg', views: 5 } ]
```

#### Utilizando o operador ```$mod```

O operador ```$mod```, seleciona todos os documentos em que o valor do campo dividido por um divisor seja igual ao valor especificado (ou seja, executa a operação matemática módulo).

    || Operação módulo: encontra o resto da divisão de um número por outro.

Considere os seguintes documentos na coleção inventory:

```js
{ _id: 1, item: "abc123", qty: 0 },
{ _id: 2, item: "xyz123", qty: 5 },
{ _id: 3, item: "ijk123", qty: 12 }
```

A query a seguir seleciona todos os documentos da coleção em que o valor do campo qty módulo 4 seja 0 :

```js
db.inventory.find({ qty: { $mod: [4, 0] } });
```

resultado:

```js
{ "_id" : 1, "item" : "abc123", "qty" : 0 }
{ "_id" : 3, "item" : "ijk123", "qty" : 12 }
```
