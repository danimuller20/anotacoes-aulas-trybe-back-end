### HTTP

Vamos relembrar o que compõe uma requisição HTTP. Para isso, analisaremos a requisição que é feita pelo navegador quando abrimos a página `https://developer.mozilla.org`.

```js
GET / HTTP/1.1
Host: developer.mozilla.org
Accept: text/html
```
Vejamos quais são as informações presentes nessa requisição:

* O método `HTTP`, definido por um verbo em inglês. Nesse caso, utilizamos o `GET`, que normalmente é utilizado para "buscar" algo do servidor, e é também o método padrão executado por navegadores quando acessamos uma URL.

* O caminho, no servidor, do recurso que estamos tentando acessar. Nesse caso, o caminho é `/`, pois estamos acessando a página inicial.

* A versão do protocolo (1.1 é a versão nesse exemplo).

* O local (host) onde está o recurso que se está tentando acessar, ou seja, a URL ou o endereço IP servidor. Nesse caso, utilizamos `developer.mozilla.org`, mas poderia ser `localhost:3000`, caso você esteja trabalhando localmente.

* Os [headers](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers). São informações adicionais a respeito de uma requisição ou de uma resposta. Eles podem ser enviados do cliente para o servidor, ou vice-versa. Na requisição de exemplo, temos o header `Host`, que informa o endereço do servidor, e o header `Accept`, que informa o tipo de resposta que esperamos do servidor. Um outro exemplo bem comum são os tokens de autenticação, em que o cliente informa ao servidor quem está tentando acessar aquele recurso: Authorization: Bearer {token-aqui}.

Existem 39 métodos HTTP diferentes! Os mais comuns são cinco: `GET`, `PUT`, `POST`, `DELETE` e `PATCH`, além do método `OPTIONS`, utilizado por clientes para entender como deve ser realizada a comunicação com o servidor.

Além da diferença de significado, requisições do tipo `POST`, `PUT` e `PATCH` carregam mais uma informação para o servidor: o corpo, ou body. É no corpo da requisição que as informações de um formulário, por exemplo, são transmitidas.

Quando um servidor recebe uma requisição, ele envia de volta uma resposta.
Ex:
```js
HTTP/1.1 200 OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Last-Modified: Tue, 01 Dec 2009 20:18:22 GMT
ETag: "51142bc1-7449-479b075b2891b"
Accept-Ranges: bytes
Content-Length: 29769
Content-Type: text/html

<!DOCTYPE html... (aqui vêm os 29769 bytes da página solicitada)
```
A composição da resposta é definida por:

* A versão do protocolo (1.1 no nosso exemplo).

* O código do status, que diz se a requisição foi um sucesso ou não (nesse caso, deu certo, pois recebemos um código 200 ), acompanhado de uma pequena mensagem descritiva ( OK , nesse caso).

* Os **Headers**, no mesmo esquema da requisição. No caso do exemplo acima, o **Content-Type** diz para o navegador o que ele precisa fazer. No caso do HTML, ele deve renderizar o documento na página.

* Um **body**, que é opcional. Por exemplo, caso você submeta um formulário registrando um pedido em uma loja virtual, no corpo da resposta pode ser retornado o número do pedido ou algo do tipo.

Após a resposta, a conexão com o servidor é fechada ou guardada para futuras requisições (seu navegador faz essa parte por você).

Tanto requisições quanto respostas podem ter headers e um body. No entanto, é importante não confundir uma coisa com a outra: o body e os headers da **requisição** representam a informação que o cliente está enviando para o servidor. Por outro lado, o body e os headers da **resposta** representam a informação que o servidor está devolvendo para o cliente.

### APIs

**API** é uma sigla para **A**pplication **P**rogramming **I**nterface. Ou seja, Interface de programação de aplicação.
Um tipo muito comum de API são as APIs HTTP, que permitem que códigos se comuniquem com aplicações através de requisições HTTP. É desse tipo de API que boa parte da web é feita.

### E o Express?

O express é um framework Node.js criado para facilitar a criação de APIs HTTP com Node. Ele nos fornece uma série de recursos e abstrações que facilitam a vida na hora de decidir quais requisições tratar, como tratá-las, quais regras de negócio aplicar e afins.

O framework foi construído pensando em um padrão de construção de APIs chamado de REST, que você vai estudar mais à frente. Seu objetivo é nos ajudar a construir APIs de forma mais fácil, essencialmente nos permitindo criar APIs altamente funcionais com hello-expresmetade do trabalho que teríamos para fazer isso "na mão".

O Express é largamente adotado na comunidade hoje, e dois dos motivos são:

* Ele foi lançado no final de 2010, ou seja, é um framework maduro e “testado em batalha”;
* Ele é um "unopinionated framework" (framework sem opinião). Isso significa que ele não impõe um padrão de desenvolvimento na hora de escrever sua aplicação.

Hoje, o Express faz parte da [Node.js Foundation](https://openjsf.org/). Isso demonstra o quão relevante ele é para a comunidade.

### Criando uma aplicação com Express

Para começar a ter um gostinho do que é programar com o Express, vamos criar o clássico "Hello, world!". Para isso, crie uma pasta chamada hello-express e, dentro dela, inicialize um novo pacote Node.js.

```sh
npm init -y
```

Agora, instale o Express e crie um arquivo `index.js`. Como qualquer aplicação `Node.js`, nossa API precisa de um `entrypoint`, ou seja, um ponto de partida. Por convenção, vamos utilizar o `index.js`.
```sh
npm i express
```

Pronto, você já tem o que é necessário para criar sua primeira API HTTP com o Express. Vamos ao código!

Preencha o arquivo index.js com o seguinte conteúdo:
```js
const express = require('express');

const app = express(); // 1

app.get('/hello', handleHelloWorldRequest); // 2

app.listen(3000, () => {
  console.log('Aplicação ouvindo na porta 3000');
}); // 3

function handleHelloWorldRequest(req, res) {
  res.status(200).send('Hello World!'); // 4
}
```
E pronto! Esse pequeno script é o suficiente para:

* 1 - Criar uma nova aplicação Express;

* 2 - Dizer ao Express que, quando uma requisição com método `GET` for recebida no caminho /hello, a função `handleHelloWorldRequest` deve ser chamada;

* 3- Pedir ao Express que crie um servidor HTTP e escute por requisições na porta 3000;

* 4 - Ao tratar uma requisição com método `GET` no caminho `/hello`, enviar o status `HTTP 200` que significa `OK` e a mensagem "Hello, world!".

### Roteamento
Uma rota ou endpoint é definida pelo **método HTTP e caminho**.

A forma que o Express trabalha com rotas é a seguinte: ao registrarmos uma rota, estamos dizendo para o Express o que fazer com requisições que contenham aquele método e caminho.

Ou seja, o roteamento consiste em "direcionar" uma requisição para que seja atendida por uma determinada parte do nosso sistema.

No Express, nós registramos uma rota utilizando a assinatura `app.METODO(caminho, callback)`, onde a função de callback recebe três parâmetros: `request`, `response` e `next`.

* **request**: comumente chamado de `req`; contém as informações enviadas pelo cliente ao servidor.

* **response**: geralmente chamado de `res`; permite o envio de informações do servidor de volta ao cliente.

* **next**: função que diz para o Express que aquele callback terminou de ser executado, e que ele deve prosseguir para executar o próximo callback para aquela rota.

__As rotas respondem a requisições que satisfaçam a condição método HTTP + caminho.__
```js
const express = require('express');
const app = express();

/* Rota com caminho '/', utilizando o método GET */
app.get('/', function (req, res) {
  res.send('hello world');
});

/* Rota com caminho '/', utilizando o método POST */
app.post('/', function (req, res) {
  res.send('hello world');
});

/* Rota com caminho '/' para qualquer método HTTP */
app.all('/', function (req, res) {
  res.send('hello world');
});

/* Ou podemos encadear as requisições para evitar repetir o caminho */
app
  .route('/')
  .get(function (req, res) {
    res.send('hello world get');
  })
  .post(function (req, res) {
    res.send('hello world post');
  });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```

Existe também a possibilidade de se passar N callbacks para a mesma rota:
```js
// ...

app.get(
  '/ping',
  function (req, res, next) {
    console.log('fiz alguma coisa');
    /* Chama a próxima callback */
    next();
  },
  function (req, res) {
    /* A segunda (e última) callback envia a resposta para o cliente */
    res.send('pong!');
  }
);

/* Também podemos utilizar um array para especificar múltiplos callbacks */
app.get('/hello', [
  (req, res, next) => {
    console.log('primeiro callback acionado');
    next();
  },
  (req, res, next) => {
    console.log('segundo callback acionado');
    res.send('Hello, world!');
  },
]);

// ...
```
As rotas e callbacks sempre serão executadas na ordem em que forem registradas.

Por exemplo, no código abaixo, a primeira callback será chamada, e encerrará o ciclo de `request/response` através de `res.send()`. Como ela não chama `next`, a próxima callback **não será executada**.
```js
const express = require('express');
const app = express();

app.get('/teste', [
  (req, res) => {
    res.send('Testando, som!');
  },
  (req, res) => {
    console.log('Tão me ouvindo?');
  },
]);
```

Essa regra também se aplica **caso uma rota seja definida duas ou mais vezes**. Podemos reescrever o exemplo acima dessa forma e obter exatamente o mesmo resultado:
```js
const express = require('express');
const app = express();

app.get('/teste', (req, res) => {
  res.send('Testando, som!');
});

app.get('/teste', (req, res) => {
  console.log('Tão me ouvindo?');
});
```

### Obtendo informações

#### Headers
Ao registrarmos uma rota, estamos dizendo para o Express o que fazer com requisições que contenham aquele `headers`, dentro do objeto `req`. Os nomes dos `headers` sempre são normalizados para letras minúsculas, de forma que `Content-Type` pode ser acessado através de `req.headers['content-type']`.

Outros headers também são acessados da mesma forma. Considere, por exemplo, a seguinte request:
```js
GET / HTTP/1.1
Authorization: Bearer algum-segredo-de-autenticaçao
Host: localhost:3000
User-Agent: HTTPie/2.4.0
```
Nela, podemos acessar `req.headers.authorization`, `req.headers.host` e `req.headers['user-agent']`.

#### Query String

Outro lugar por onde nosso servidor pode receber informações é a chamada `query string`. Ela é informada juntamente com a `URL`, mas é separada da mesma pelo caractere `?`.

Por exemplo, no endpoint `https://api.github.com/search/repositories?q=tryber`, a `queryString` é `q=tryber`, e define um parâmetro chamado `q`, que recebe como valor a string `tryber`. Se quisermos definir outros parâmetros, devemos seguir o mesmo esquema de chave=valor, separando cada parâmetro com o caractere `&`.

Por exemplo: `https://minha-api.com/endpoint?q=teste&size=10&page=3`. Aqui, passamos três parâmetros na `query string`: `q`, que tem o valor `teste`, `size`, que tem o valor `10`, e `page`, que tem o valor `3`.

No Express, as informações enviadas via `query string` estão disponíveis em forma de objeto por meio da propriedade query do objeto `req`.

O caminho acima, por exemplo, produz o seguinte conteúdo em `req.query`:
```js
{
  q: 'teste',
  size: '10',
  page: '3'
}
```
Atente-se ao fato de que, por se tratar de uma `query string`, todos os parâmetros virão sempre como string. Quando necessário, devemos realizar a conversão para inteiro manualmente.

#### Path Parameters

Imagine, por exemplo, a URL `https://minha-api.com/produtos/1`, onde `1` é o `ID` do produto. Como você registraria uma rota como o método `GET` para essa URL?

Uma forma seria fazer `app.get('/produtos/1', (req, res) => { /* ... */ })`. A questão é que, assim, se você tiver mil produtos diferentes, vai precisar ter mil rotas diferentes! Imagine isso num cenário, por exemplo, de uma rede social, na qual cada pessoa possui um link `http://rede-social.com/profile/ca9c938538dfcf7c35e594c6` onde `ca9c938538dfcf7c35e594c6` é um `ID` gerado aleatoriamente para aquela pessoa. Num cenário como esse é impossível ter alguém criando uma rota nova cada vez que uma conta é criada na plataforma, certo?

Para resolver esse problema, o Express permite o uso de `path parameters`, ou parâmetros de caminho. Para utilizá-los, basta, na hora de definir a rota, substituir o valor do parâmetro pelo seu nome precedido de `:`, dessa forma:
```js
/* ... */

app.get('/produtos/:id', (req, res) => {
  /* ... */
});

/* ... */
```
No código acima, definimos um parâmetro chamado `id`, de forma que ao chamarmos `GET /produtos/1`, essa rota será acionada, e o valor do parâmetro id será '1'.

No Express, parâmetros de caminho estão acessíveis através da propriedade `params`, no objeto `req`. Por exemplo, para acessar o parâmetro `ID` na rota acima, faríamos `req.params.id`.

⚠️ Atenção: É importante lembrar que, assim como parâmetros passados via `query string`, o valor dos `path parameters` também sempre será uma `string`. ⚠️

#### Body

Outro local que contém informações importantes para muitas requisições é o `body` ou corpo da requisição.

Esse corpo pode ser composto de vários tipos de informação: desde texto limpo até `JSON`. Em APIs, o mais comum é que o `body` da request contenha `JSON` ou um outro formato, chamado de `FormData`.


### Ferramentas importantes:

Peg os dados que vem de uma requisição e parsear eles para JSON de uma forma para que possamos utilizar na nossa aplicação
```sh
npm i body-parser
```

Para atualizar ou reiniciar o código de uma aplicação Nodejs automaticamente 
```sh
npm i nodemon -D
```
No package.json adicionar um script:
```json
"dev": "nodemon index.js"
```

Para rodar devemos utilizar:
```sh
npm run dev
```

Faz requisições http diretamente do terminal e permite utilizar outros verbos como PUT, POST e DELETE:
```sh
sudo apt-get install -y httpie
```

### Middlewares Pattern

Um detalhe muito importante é que o `Express`, por si só, não realiza a leitura e interpretação do `body` das `requests`. Isso quer dizer que, sem uma "ajudinha", não conseguimos acessar o body da request. Para que essa informação esteja disponível para uso no servidor, é necessário utilizar um `middleware` como o `body-parser`. Esse tipo de biblioteca é responsável por ler e interpretar o corpo da request e, normalmente, criar uma chave `body` dentro do objeto `req`, contendo o conteúdo do `body`.


### Middlewares

Para o Express, um middleware é uma função que realiza o tratamento de uma request e que pode encerrar essa request, ou chamar o próximo middleware.

Na prática, essas funções recebem três parâmetros: `req`, `res` e `next`, exatamente como as funções callback que usamos até agora para registrar rotas. Middlewares podem retornar qualquer coisa, incluindo Promises. O fato é que o Express ignora o retorno dos middlewares, visto que o importante é se aquele middleware chamou ou não um método que encerra a request, ou a função `next`.

__E qual a diferença entre middleware e um callback comum?__

Enquanto callbacks costumam ser uma função que é chamada para receber um resultado, como o callback do `fs.readFile` que é chamado recebendo o conteúdo do arquivo, middlewares são chamados para tratar requisições. Isso quer dizer que eles têm o poder de encerrar ou alterar essas requisições. Além disso, middlewares podem ser chamados um depois do outro, de forma que as alterações de um são recebidas por todos outros que forem executados depois dele. Isso também quer dizer que um middleware que faz uma tarefa específica pode ser reaproveitado para realizar essa tarefa em qualquer rota, sem que seu código precise ser escrito mais de uma vez.

Um exemplo clássico do uso de middlewares desse tipo é autenticação. Veja:
```js
/* auth-middleware.js */
const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'missing authorization header' });
  }

  const authorizationHeader = req.headers.authorization;

  const validHeaderRegex = new RegExp('0-9a-z', 'i');

  if (
    authorizationHeader.length < 12 ||
    validHeaderRegex.test(authorizationHeader)
  ) {
    return res.status(401).json({ message: 'invalid authentication token' });
  }

  next();
};

module.exports = authMiddleware;
```
No código acima temos um middleware que, ao receber uma request, verifica se essa request contém um header chamado `authorization`, se o valor desse header tem pelo menos 12 caracteres, e se o valor é compatível com um determinado regex.

Caso nenhuma dessas opções seja verdadeira, uma resposta é enviada ao client dizendo que não foi possível realizar a autenticação. Ao enviarmos uma resposta para o client, impedimos que qualquer outro middleware seja executado depois desse. Caso esteja tudo certo com o header, o middleware chama a função `next` que, basicamente, diz ao Express "ok, terminei aqui, pode chamar o próximo que disse que queria saber de requisições pra essa rota".

Para utilizamos esse middleware de autenticação, podemos fazer da seguinte forma:
```js
const express = require('express');
const app = express();
const authMiddleware = require('./auth-middleware');

app.get('/aberto', (req, res) => {
  res.status(200).json({ message: 'Eu posso ser acessado sem autenticação.' });
});

app.get('/secure', authMiddleware, (req, res) => {
  res.status(200).json({
    message:
      'se esse middleware foi chamado pelo Express, é porque deu tudo certo dentro de `authMiddleware`, e o `next` foi chamado',
  });
});

app.get('/otherSecure', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'podemos utilizar o mesmo middleware pra quantas rotas quisermos',
  });
});
```

Middlewares também podem modificar o objeto req , e essas modificações serão recebidas pelos próximos middlewares, caso next seja chamado. Isso geralmente é utilizado para propagar informações de um middleware para o outro. Por exemplo, caso queiramos saber quanto tempo durou uma request, podemos adicionar um middleware que nos informa o momento em que ela foi recebida:

```js
const express = require('express');
const app = express();

function timeMiddleware(req, res, next) {
  req.startTime = Date.now();
  next();
}

app.get('/tempo', timeMiddleware, (req, res) => {
  const endTime = Date.now() - req.startTime;
  res.status(200).json({
    message: `essa request foi processada em ${endTime} milissegundos`,
  });
});
```

Mas não pára por aí! O grande poder dos middlewares começa a se mostrar quando entendemos que eles podem ser registrados para uma rota específica, como vimos até agora, mas que também podem ser registrados para a aplicação toda de uma vez!

Para fazer isso, utilizamos o método `use` do nosso `app` do Express. Veja abaixo:
```js
const express = require('express');
const app = express();

function timeMiddleware(req, res, next) {
  req.startTime = Date.now();
  next();
}

app.use(timeMiddleware);

app.get('/tempo', (req, res) => {
  const endTime = Date.now() - req.startTime;
  res.status(200).json({
    message: `essa request foi processada em ${endTime} milissegundos`,
  });
});
```
Dessa forma, todas as rotas que vierem depois de `app.use(timeMiddleware)` irão automaticamente ter esse middleware executado antes dos middlewares específicos daquela rota. Isso quer dizer que todo middleware de rota terá disponível a informação `req.startTime`.


Um outro exemplo disso é o módulo `body-parser`, que citamos mais cedo. Ele é um middleware que lê o corpo da request, cria nela uma propriedade body e coloca o conteúdo do corpo lá. Para utilizá-lo e ter acesso às informações do corpo da request, só precisamos instalá-lo com `npm i body-parser` e registrá-lo na nossa aplicação:
```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/hello', (req, res) => {
  // req.body agora está disponível
  res.status(200)
    .json({
      greeting: `Hello, ${req.body.name}!`
    });
});

app.listen(3000, () => { console.log('Listening'); });
```
A função `json()` diz ao `body-parser` que queremos um middleware que processe corpos de requisições escritos em JSON.

Agora, se executarmos o script acima e fizermos uma requisição do tipo `POST` para `http://localhost:3000/hello` e informarmos, no corpo da requisição, o seguinte `JSON: { "name": "Ada Lovelace" }`, teremos, no corpo da resposta, o `JSON { "greeting": "Hello, Ada Lovelace!" }`.

### Router middleware

O `Router` é um middleware que "agrupa" várias rotas em um mesmo lugar, como se fosse uma versão mini do app do Express. Ele é depois "plugado" no "app principal".

Tomemos como exemplo uma API que retorna dados sobre os Simpsons:
```js
// simpsons.js
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('Hello World!');
});

router.get('/homer', function (req, res) {
  res.send('Hello Homer!');
});

module.exports = router;
```

```js
// index.js
const express = require('express');
const simpsons = require('./simpsons');

const app = express();

/* Todas as rotas com /simpsons/<alguma-coisa> entram aqui e vão para o roteador. */
app.use('/simpsons', simpsons);

app.listen(3000);
```

Repare no uso de mais um parâmetro na chamada à função `app.use`. Isso diz ao Express que queremos que aquele middleware (no caso o router) seja executado para qualquer rota que comece com aquele caminho. Repare que, ao registrar uma rota no router, não precisamos repetir a parte do caminho que já passamos para `app.use`. É por isso que a rota que definimos com `router.get('/homer')` na verdade se torna acessível através de `/simpsons/homer`.

Routers suportam que qualquer tipo de middleware seja registrado. Ou seja, se tivermos vários endpoints com autenticação e vários endpoints abertos, podemos criar um `router`, e registrar nele nosso middleware de autenticação, bem como todas as rotas que precisam ser autenticadas, registrando as rotas abertas diretamente no `app`. Veja abaixo:

```js
/* authRouter.js */
const router = require('express').Router;
const authMiddleware = require('./authMiddleware');

router.use(authMiddleware);

/* Todas as rotas daqui para baixo utilizam o `authMiddleware` */

/* GET /secure/hello */
router.get('/hello', (req, res) => {
  res.status(200).json({ message: 'Hello world' });
});

module.exports = router;
```

```js
/* authRouter.js */
const router = require('express').Router;
const authMiddleware = require('./authMiddleware');

router.use(authMiddleware);

/* Todas as rotas daqui para baixo utilizam o `authMiddleware` */

/* GET /secure/hello */
router.get('/hello', (req, res) => {
  res.status(200).json({ message: 'Hello world' });
});

module.exports = router;
```

```js
const express = require('express');
const app = express();
const authRouter = require('./authRouter');

app.use('/secure', authRouter);

/* GET /hello */
app.get('/hello', (req, res) => {
  res.status(200).json({ message: 'Hello world, with no auth!' });
});
```

### Lidando com erros

A diferença de um middleware de erro para um middleware comum é que a assinatura dele recebe quatro parâmetros ao invés de três, ficando assim: `function (err, req, res, next) {}`.
```js
app.use(middleware1);
app.get('/', /* ... */);
app.use(function (err, req, res, next) {
  res.status(500).send(`Algo deu errado! Mensagem: ${err.message}`);
});
```
É importante notar que:

* Middlewares de erro sempre devem vir depois de rotas e outros middlewares;
* Middlewares de erro sempre devem receber quatro parâmetros.

O Express utiliza a quantidade de parâmetros que uma função recebe para determinar se ela é um middleware de erro ou um middleware comum. Ou seja, mesmo que você não vá utilizar os parâmetros `req`, `res` ou `next`, seu middleware de erro precisa recebê-los. Você pode adicionar um underline no começo do nome dos parâmetros que não vai usar. Isso é uma boa prática e sinaliza para quem está lendo o código que aquele parâmetro não é utilizado. Por exemplo: `function (err, _req, res, _next) {}`.

Também é possível encadear middlewares de erro, no mesmo esquema dos outros middlewares, simplesmente colocando-os na sequência em que devem ser executados.

```js
app.use(function logErrors(err, req, res, next) {
  console.error(err.stack);
  /* passa o erro para o próximo middleware */
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(500);
  res.send({ error: err });
});
```

Repare que estamos fazendo `next(err)`. Isso diz ao Express que ele não deve continuar executando nenhum middleware ou rota que não seja de erro. Ou seja, quando passamos qualquer parâmetro para o next, o Express entende que é um erro e deixa de executar middlewares comuns, passando a execução para o próximo middleware de erro registrado para aquela rota, router ou aplicação.

### Pacote express-rescue

Instalação:
```sh
npm i express-rescue
```
Para vê-lo em ação, vamos criar uma rota que recebe o nome de um arquivo na query string, realiza a leitura desse arquivo através do fs.readFile, e envia o conteúdo do arquivo no body da response.

⚠️ Atenção: Jamais devemos realizar a leitura de um arquivo do sistema de arquivos dessa forma. Concatenar parâmetros recebidos do usuário diretamente na chamada para qualquer método representa uma falha gigantesca de segurança. Vamos fazer isso aqui nesse momento para fins didáticos.⚠️
```js
const fs = require('fs/promises');

app.get('/:fileName', async (req, res) => {
  const file = await fs.readFile(`./${req.params.fileName}`);
  res.send(file.toString('utf-8'));
});
```

Para adicionarmos os express-rescue , basta passarmos nosso middleware como parâmetro para ele. Ele irá gerar um novo middleware, que devemos passar para o Express.

```js
const rescue = require('express-rescue');
const fs = require('fs/promises');

app.get(
  '/:fileName',
  rescue(async (req, res) => {
    const file = await fs.readFile(`./${req.params.fileName}`);
    res.send(file.toString('utf-8'));
  })
);

app.use((err, req, res, next) => {
  res.status(500).json({ error: `Erro: ${err.message}` });
});
```
O que o novo middleware faz é simplesmente executar nosso middleware original dentro de um bloco de try ... catch . Caso ocorra qualquer erro no nosso middleware, esse erro é capturado pelo catch e passado para o next , dando início ao fluxo de erro do Express.

Para ver em execução, veja o código completo abaixo:
```js
const express = require('express');
const rescue = require('express-rescue');
const fs = require('fs/promises');

const app = express();

app.get(
  '/:fileName',
  rescue(async (req, res) => {
    const file = await fs.readFile(`./${req.params.fileName}`);
    res.send(file.toString('utf-8'));
  })
);

app.use((err, req, res, next) => {
  res.status(500).json({ error: `Erro: ${err.message}` });
});

app.listen(3000);
```

Através do uso correto de middlewares de erro, é possível centralizar o tratamento de erros da aplicação em partes específicas dela. Isso facilita a construção dos middlewares de rotas, pois você não precisa ficar tratando erros em todos esses middlewares. Se algo der errado em qualquer rota que estiver envelopada pelo `express-rescue`, esse erro vai ser tratado pelo middleware de erros mais próximo.

Por último, um padrão muito comum é ter um middleware de erro genérico, e outros middlewares que convertem erros para esse formato genérico. Por exemplo:
```js
/* errorMiddleware.js */

module.exports = (err, req, res, next) => {
  if (err.code && err.status) {
    return res.status(err.status).json({ message: err.message, code: err.code });
  }

  return res.status(500).json({ message: err.message });
}
```
O middleware acima verifica se o erro possui um código e um status HTTP. Caso possua, o código e a mensagem são devolvidas na response. Caso contrário um erro genérico de servidor é utilzado.

```js
/* index.js */
const express = require('express');
const rescue = require('express-rescue');
const errorMiddleware = require('./errorMiddleware');

const app = express();

app.get('/products/:id', [
  rescue(async (req, res) => {
    const productId = req.params.id;

    const product = await database.getProductById(id);

    res.status(200).json(product);
  }),
  (err, req, res, next) => {
    if (err.message === 'Produto não encontrado') {
      const newError = new Error(err.message);
      newError.code = 'product_not_found';
      newError.status = 404;
      return next(newError);
    }

    return next(err);
  },
]);

app.use(errorMiddleware);
```

Nesse trecho de código, convertemos um erro de banco de dados para um erro que nosso middleware de erros conhece e sabe formatar. Dessa forma, nos middlewares comuns, precisamos nos preocupar apenas com o caminho feliz ao passo que, nos middlewares de erro, nos preocupamos apenas com o fluxo de erros.

Repare, também, que estamos utilizando um Array para passar mais de um middleware para uma mesma rota. Poderíamos passar cada middleware como um parâmetro, mas um Array deixa mais explícita a intenção de, realmente, utilzarmos vários middlewares numa mesma rota.
