### Sistema de módulos

O Node.js possui três tipos de módulos: internos, locais e de terceiros

#### Módulos internos

Os módulos internos (ou core modules ) são inclusos no Node.js e instalados junto com ele quando baixamos o runtime . Alguns exemplos de core modules são:

* [fs](https://nodejs.org/api/fs.html): Fornece uma API para interagir com o sistema de arquivos de forma geral;

* [url](https://nodejs.org/api/url.html): Provê utilitários para ler e manipular URLs;

* [querystring](https://nodejs.org/api/querystring.html): Disponibiliza ferramentas para leitura e manipulação de parâmetros de URLs;

* [util](https://nodejs.org/api/util.html): Oferece ferramentas e funcionalidades comumente úteis a pessoas programadoras.

#### Módulos locais

* Módulos locais são aqueles definidos juntamente à nossa aplicação. Representam funcionalidades ou partes do nosso programa que foram separados em arquivos diferentes.

* Módulos locais podem ser publicados no NPM para que outras pessoas possam baixá-los e utilizá-los, o que nos leva ao nosso próximo e último tipo de módulo.

#### Módulos de terceiros

* Módulos de terceiros são aqueles criados por outras pessoas e disponibilizados para uso através do NPM.

* Nós também podemos criar e publicar módulos, seja para nós mesmos utilizarmos em diversas aplicações diferentes, ou para permitir que outras pessoas os utilizem em suas respectivas aplicações.

### Exportação e importação de módulos

Existem dois sistemas de módulos difundidos na comunidade JavaScript:

* Módulos ES6;
* Módulos CommonJS.

#### ES6

O nome ES6 vem de ECMAScript 6, que é a especificação seguida pelo JavaScript.

Na especificação do ECMAScript 6, os módulos são importados utilizando a palavra-chave ```import```, tendo como contrapartida a palavra-chave ```export``` para exportá-los.

O Node.js não possui suporte a módulos ES6 por padrão, sendo necessário o uso de transpiladores, como o [Babel](https://babeljs.io/), ou supersets da linguagem, como o [TypeScript](https://www.typescriptlang.org/), para que esse recurso esteja disponível. Transpiladores são ferramentas que leêm o código-fonte escrito em uma linguagem como o Node.js e produz o código equivalente em outra linguagem. 

#### CommonJS

* O CommonJS é o sistema de módulos implementado pelo Node.js nativamente.

#### Exportando módulos

Para exportar algo no sistema CommonJS, utilizamos a variável global ```module.exports```, atribuindo a ela o valor que desejamos exportar:
```js
// brlValue.js
const brl = 5.37;

module.exports = brl;
```

O ```module.export```s nos permite definir quais desses "objetos" internos ao módulo serão exportados, ou seja, serão acessíveis a arquivos que importarem aquele módulo. O ```module.exports``` pode receber qualquer valor válido em JavaScript, incluindo objetos, classes, funções e afins.

Não é comum exportar um valor constante como no exemplo acima. Vamos observar um caso que acontece com mais frequência:

```js
// brlValue.js
const brl = 5.37;

const usdToBrl = (valueInUsd) => valueInUsd * brl;

module.exports = usdToBrl;
```

Agora estamos exportando uma função de forma que podemos utilizá-la para converter um valor em dólares para outro valor, em reais.

O uso desse nosso módulo se daria da seguinte forma:

```js
// index.js
const convert = require('./brlValue');

const usd = 10;
const brl = convert(usd);

console.log(brl) // 53.7
```
Podemos dar o nome que quisermos para a função depois que a importamos, independente de qual o seu nome dentro do módulo.


Suponhamos agora que seja desejável exportar tanto a função de conversão quanto o valor do dólar (a variável brl). Para isso, podemos exportar um objeto contendo as duas constantes da seguinte forma:
```js
// brlValue.js
const brl = 5.37;

const usdToBrl = (valueInUsd) => valueInUsd * brl;

module.exports = {
  brl,
  usdToBrl,
};
```

Dessa forma, ao importarmos o módulo, receberemos um objeto como resposta:
```js
// index.js
const brlValue = require('./brValue');

console.log(brlValue); // { brl: 5.37, usdToBrl: [Function: usdToBrl] }

console.log(`Valor do dólar: ${brlValue.brl}`); // Valor do dólar: 5.37
console.log(`10 dólares em reais: ${brlValue.usdToBrl(10)}`); // 10 dólares em reais: 53.7
```

Por último, como estamos lidando com um objeto, podemos utilizar object destructuring para transformar as propriedades do objeto importado em constantes no escopo global:
```js
const { brl, usdToBrl } = require('./brValue');

console.log(`Valor do dólar: ${brl}`); // Valor do dólar: 5.37
console.log(`10 dólares em reais: ${usdToBrl(10)}`); // 10 dólares em reais: 53.7
```

### Importando módulos

#### Módulos locais

Quando queremos importar um módulo local, precisamos passar para o ```require``` o caminho do módulo, seguindo a mesma assinatura. Por exemplo, ```require('./meuModulo')```. Note que a extensão (```.js```) não é necessária: por padrão, o Node já procura por arquivos terminados em ```.js``` ou ```.json``` e os considera como módulos.

Além de importarmos um arquivo como módulo, podemos importar uma pasta. Isso é útil pois, muitas vezes, um módulo está dividido em vários arquivos, mas desejamos importar todas as suas funcionalidades de uma vez só. Nesse caso, a pasta precisa conter um arquivo chamado ```index.js```, que importa cada um dos arquivos do módulo e os exporta da forma mais conveniente.

Por exemplo:
```js
// meuModulo/funcionalidade-1.js

module.exports = function () {
  console.log('funcionalidade1');
}
```

```js
// meuModulo/funcionalidade-2.js

module.exports = function () {
  console.log('funcionalidade2');
}
```

```js
// meuModulo/index.js
const funcionalidade1 = require('./funcionalidade-1');
const funcionalidade2 = require('./funcionalidade-2');

module.exports = { funcionalidade1, funcionalidade2 };
```

No exemplo acima, quando importarmos o módulo ```meuModulo```, teremos um objeto contendo duas propriedades, que são as funcionalidades que exportamos dentro de ```meuModulo/index.js```.

Para importarmos e utilizarmos o módulo ```meuModulo```, basta passar o caminho da pasta como argumento para a função ```require```, assim:

```js
// minha-aplicacao/index.js
const meuModulo = require('./meuModulo');1

console.log(meuModulo); // { funcionalidade1: [Function: funcionalidade1], funcionalidade2: [Function: funcionalidade2] }

meuModulo.funcionalidade1();
```

#### Módulos internos

Para utilizarmos um módulo interno, devemos passar o nome do pacote como parâmetro para a função require. Por exemplo, ```require('fs')``` importa o pacote ```fs```, responsável pelo sistema de arquivos.

Uma vez que importamos um pacote, podemos utilizá-lo no nosso código como uma variável, dessa forma:

```js
const fs = require('fs');

fs.readFileSync('./meuArquivo.txt');
```

#### Módulos de terceiros

* Módulos de terceiros são importados da mesma forma que os módulos internos: passando seu nome como parâmetro para a função ```require```. A diferença é que, como esses módulos não vêm inclusos no Node.js, precisamos primeiro instalá-los na pasta do projeto em que queremos utilizá-los;

* O registro oficial do Node.js, onde milhares de pacotes estão disponíveis para serem instalados é o **NPM**;

* O ```npm``` também é o nome da ferramenta de linha de comando (CLI - command line interface) responsável por baixar e instalar esses pacotes;

* O CLI ```npm``` e o Node.js são instalados juntos.


Quando importamos um módulo que não é nativo do Node.js, e não aponta para um arquivo local, o Node inicia uma busca por esse módulo. Essa busca acontece na pasta ```node_modules```. Caso um módulo não seja encontrado na ```node_modules``` mais próxima do arquivo que o chamou, o Node procurará por uma pasta ```node_modules``` na pasta que contém a pasta atual. Caso encontrado, o módulo é carregado. Do contrário, o processo é repetido em um nível de pasta acima. Isso acontece até que o módulo seja encontrado, ou até que uma pasta ```node_modules``` não exista no local em que o Node está procurando.


#### NPM

O **NPM** _(sigla para Node Package Manager)_ é, como dito no tópico anterior, o repositório oficial para publicação de pacotes NodeJS. É para ele que realizamos upload dos arquivos de nosso pacote quando queremos disponibilizá-lo para uso de outras pessoas ou em diversos projetos.

Um pacote é um conjunto de arquivos que exportam um ou mais módulos Node. Nem todo pacote Node é uma biblioteca, visto que uma API desenvolvida em Node também tem um pacote.

#### Utilizando o CLI ```npm```

O **CLI** ```npm``` é uma ferramenta oficial que nos auxilia no gerenciamento de pacotes, sejam esses pacotes dependências da nossa aplicação ou nossos próprios pacotes. É através dele que criamos um projeto, instalamos e removemos pacotes, publicamos e gerenciamos versões dos nossos próprios pacotes.

[NPM Comandos Cheat Sheet](https://github.com/tryber/Trybe-CheatSheets/blob/master/backend/nodejs/npm/README.md)

#### npm init

O comando ```npm init``` nos permite criar, de forma rápida e simplificada, um novo pacote Node.js na pasta onde é executado.

Ao ser executado, o comando pede para quem executou algumas informaçãoes sobre o pacote como nome, versão, nome das pessoas autoras e afins.

Cria o arquivo ```package.json``` personalizado
```sh
npm init
```

Caso desejemos utilizar as respostas padrão para todas essas perguntas, podemos utilizar o comando com a flag ```-y```, ou seja, ```npm init -y```; dessa forma, nenhuma pergunta será feita, e a inicialização será realizada com os valores padrão.

Cria o arquivo ```package.json``` padrão
```sh
npm init -y
```

Para exportar algo no sistema CommonJS, utilizamos a variável global ```npm init``` simplesmente cria um arquivo chamado package.json com as respostas das perguntas realizadas e mais alguns campos de metadados. Para o Node.js, qualquer pasta contendo um arquivo ```package.json``` válido é um pacote.

Dentro do ```package.json``` é onde podemos realizar algumas configurações importantes para o nosso pacote como nome, versão, dependências e **scripts**.
Ex:
_package.json_
```json
"start": "node index.js"
```
O código acima serve para rodar automáticamente o npm que faz o output. Basta rodar ```npm start```.

#### npm run

O comando ```run``` faz com que o npm execute um determinado script configurado no ```package.json```. Scripts são "atalhos" que podemos definir para executar determinadas tarefas relacionadas ao pacote atual.

Para criar um script, precisamos alterar o ```package.json``` e adicionar uma nova chave ao objeto scripts. O valor dessa chave deve ser o comando que desejamos que seja executado quando chamarmos aquele script.
Ex:
```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

Perceba que lint é o nome do script que digitamos no terminal para executar o ESLint na pasta atual:
```sh
npm run lint
```

Você pode criar quantos scripts quiser, para realizar quais tarefas quiser. Inclusive, pode criar scripts que chamam outros scripts, criando assim "pipelines". Esse tipo de coisa é muito útil, por exemplo, quando trabalhamos supersets do JavaScript como o ```TypeScript```, ou transpiladores como o ```Babel```, pois ambos exigem que executemos comandos adicionais antes de iniciar nossos pacotes.

#### npm start

O comando ```npm start``` age como um "atalho" para o comando ```npm run start```, uma vez que sua função é executar o script start definido no ```package.```.

Como convenção, todo pacote que pode ser executado pelo terminal (como CLIs, APIs e afins) deve ter um script ```start``` com o comando necessário para executar a aplicação principal daquele pacote.

Por exemplo, se tivermos um pacote que calcula o IMC (Índice de Massa Corporal) de uma pessoa cujo código está no arquivo ```imc.js```, é comum criarmos o seguinte script:

```js
{
  // ...
  "scripts": {
    "start": "node imc.js"
  }
  // ...
}
```
Dessa forma, qualquer pessoa que for utilizar seu script vai ter certeza de como inicializá-lo, pois só vai precisar executar ```npm start```.

#### npm install

É responsável por baixar e instalar pacotes Node.js do **NPM** para o nosso pacote, e existem algumas formas de usá-lo:

* ```npm install <nome do pacote>```: Baixa o pacote do registro do NPM e o adiciona ao objeto dependencies do ```package.json```

* ```npm install -D <nome do pacote>```: É semelhante ao comando anterior. Baixa o pacote do registro do NPM, porém o adiciona ao objeto ```devDependencies``` do ```package.```, indicando que o pacote em questão não é necessário para executar a aplicação, mas é necessário para desenvolvimento, ou seja, para alterar o código daquela aplicação. Isso é muito útil ao colocar a aplicação no ar, pois pacotes marcados como ```devDependencies``` podem ser ignorados, já que vamos apenas executar a aplicação, e não modificá-la.

* ``` npm install```: Baixa e instala todos os pacotes listados nos objetos de ```dependencies``` e ```devDependencies``` do ```package.json```. Sempre deve ser executado ao clonar o repositório de um pacote para garantir que todas as dependências desse pacote estão instaladas.
