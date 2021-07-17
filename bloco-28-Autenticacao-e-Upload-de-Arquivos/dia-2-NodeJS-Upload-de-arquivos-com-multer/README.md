# Upload de arquivos com multer e Express

#### multer

Você já utilizou, em outros momentos, o `body-parser` para tratar dados no corpo da request. Hoje você vai utilizar o multer. A funcionalidade dos dois é, em suma, a mesma: interpretar dados enviados através do body da requisição.

No entanto, enquanto o `body-parser` suporta requests nos formatos **JSON** (`Content-Type: application/json`) e **URL Encoded** (`Content-Type: application/x-www-form-urlencoded`), o multer suporta requests no formato conhecido como **Form Data** (`Content-Type: multipart/form-data`).

# multipart/form-data

Este é um formato bem antigo, pensado para suportar todas as operações suportadas pela tag `<form>` do HTML. Sendo assim, pode transmitir dados comuns, como strings, booleans e números, mas também pode transmitir arquivos. Dessa forma, o body de uma request com formato Form Data pode ter vários campos (assim como um JSON), e cada campo pode ter o tipo número, boolean, string, ou **arquivo**.

Já que suporta upload de arquivos, o `multer` nos fornece, além do `req.body`, com os campos comuns, uma propriedade `req.file` (ou `req.files`, caso sejam múltiplos arquivos na mesma request).

# Show me the code

Para começar, vamos criar um projeto chamado `io-multer`;
Para isso, em sua pasta de exercícios, execute o comando:
```sh
npm init @tryber/backend io-multer
```

Depois de criada a pasta do projeto, navegue até ela e instale o multer utilizando os seguintes comandos:

```sh
npm i multer
```

Agora, basta executar o comando `npm start` dentro da pasta `io-multer` para colocar nosso servidor de pé. Se preferir, utilize o comando `npm run debug`, para que o nodemon reinicie o servidor sempre que você realizar novas alterações.

Para testar nossa API, disponibilizamos um endpoint chamado `/ping`. Para fazer uma requisição para essa rota.

Agora que já temos nosso servidor de pé e sabemos o que é o `multer`, vamos criar uma instância dele e configurá-lo para tornar a pasta uploads como pasta de destino dos uploads realizados. Além disso, vamos também tornar pública essa mesma pasta para que ela possa ser acessada através da nossa API. Assim, poderemos requisitar de volta os arquivos após fazer o upload deles:

_io-multer/index.js_
```js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
const multer = require('multer');

// const PORT = process.env.PORT;

// const controllers = require('./controllers');

// const app = express();

// app.use(
//   cors({
//     origin: `http://localhost:${PORT}`,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Authorization'],
//   })
// );

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

/* Definindo nossa pasta pública */
/* `app.use` com apenas um parâmetro quer dizer que
   queremos aplicar esse middleware a todas as rotas, com qualquer método */
/* __dirname + '/uploads' é o caminho da pasta que queremos expor publicamente */
/* Isso quer dizer que, sempre que receber uma request, o express vai primeiro
   verificar se o caminho da request é o nome de um arquivo que existe em `uploads`.
   Se for, o express envia o conteúdo desse arquivo e encerra a response.
   Caso contrário, ele chama `next` e permite que os demais endpoints funcionem */
app.use(express.static(__dirname + '/uploads'));

/* Cria uma instância do`multer`configurada. O`multer`recebe um objeto que,
   nesse caso, contém o destino do arquivo enviado. */
const upload = multer({ dest: 'uploads' });

// app.get('/ping', controllers.ping);

// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
// });
```

Com tudo configurado, vamos de fato criar uma rota que vai receber e salvar um único arquivo na pasta uploads:

_io-multer/index.js_
```js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const multer = require('multer');

// const PORT = process.env.PORT;

// const controllers = require('./controllers');

// const app = express();

// app.use(
//   cors({
//     origin: `http://localhost:${PORT}`,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Authorization'],
//   })
// );

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// /* Definindo nossa pasta pública */
// /* `app.use` com apenas um parâmetro quer dizer que
//    queremos aplicar esse middleware a todas as rotas, com qualquer método */
// /* __dirname + '/uploads' é o caminho da pasta que queremos expor publicamente */
// /* Isso quer dizer que, sempre que receber uma request, o express vai primeiro
//    verificar se o caminho da request é o nome de um arquivo que existe em `uploads`.
//    Se for, o express envia o conteúdo desse arquivo e encerra a response.
//    Caso contrário, ele chama `next` e permite que os demais endpoints funcionem */
// app.use(express.static(__dirname + '/uploads'));

// /* Cria uma instância do`multer`configurada. O`multer`recebe um objeto que,
//       nesse caso, contém o destino do arquivo enviado. */
// const upload = multer({ dest: 'uploads' });

app.post('/files/upload', upload.single('file'), (req, res) =>
  res.status(200).json({ body: req.body, file: req.file })
);

// app.get('/ping', controllers.ping);

// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
// });
```

Note que, na rota `/files/upload`, passamos um middleware criado pelo multer como parâmetro, através da chamada `upload.single('file')` e depois passamos nosso próprio middleware, que recebe os parâmetros `req` e `res`.

O `multer` adiciona um objeto `body` e um objeto `file` ao objeto `request` recebido na `callback`. Os objetos `body` e `file` contêm os valores dos campos de texto e o arquivo enviados pelo formulário, respectivamente.

O parâmetro passado na chamada de `upload.single('file')` indica o nome do campo que conterá o arquivo. No caso desse exemplo, o nome é `file`, mas poderia ter outro nome em outros cenários.

Por exemplo, se um formulário fosse construído desta forma:
```html
<form action="/post" method="post" enctype="multipart/form-data">
  <input type="file" name="post" />
</form>
```
Seria necessário especificar o nome do input com `upload.single('post')`, pois o atributo `name` do input do tipo `file` está preenchido com `post`.

Além disso, estamos especificando, com o método `single`, porque queremos apenas um arquivo. Ou seja, qualquer pessoa que nos enviar uma requisição deverá informar uma propriedade chamada `file`, e só poderá enviar um arquivo por requisição.

#### Exercício de Fixação

Crie um arquivo que receba arquivos enviados para `http://localhost:3000/envios` e os armazene na pasta `envios`. Dica: você pode usar a pasta `io-multer` criando um novo arquivo, pois ela já tem os pacotes necessários, e o `io-multer/index.js` como exemplo.

### Axios

Chegou a hora de testarmos nossa API. Para isso, vamos introduzir o Axios , uma biblioteca que nos ajudará a realizar requisições HTTP para APIs REST.

[Axios](https://github.com/axios/axios) é uma biblioteca que fornece um cliente HTTP que funciona tanto no browser quanto no NodeJS. Ela consegue interagir tanto com [XMLHttpRequest](https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHTTPRequest) quanto com a interface HTTP nativa do NodeJS. Por isso, uma das vantagens de se usar o Axios é que ele permite que o mesmo código utilizado para fazer requisições Ajax no browser também funcione no servidor. Além disso, as requisições feitas através da biblioteca retornam uma Promise compatível com a versão ES6 do JavaScript.


Como um exemplo prático de sua utilização, vamos criar um script para saber se nossa API está de pé. Para isso, vamos criar outra pasta chamada `ping`, fora da nossa pasta `io-multer`, e, dentro dela, vamos criar um arquivo chamado `ping.js`.

Dentro da pasta ping
_ping_
```sh
npm init -y
npm install axios
```

Seu package.json deve se parece com este:
```json
{
  "name": "ping",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.21.1"
  }
}

```

Dentro do arquivo `ping.js`, vamos usar o Axios para fazer uma requisição ao nosso servidor, que está rodando na porta 3000:

_ping/ping.js_
```js
const axios = require('axios');

/* Faz uma requisição do tipo GET */
axios
  .get('http://localhost:3000/ping/')
  .then((response) => {
    console.log(response.data);
    console.log(response.status);
  })
  .catch((error) => {
    console.log(error);
  });
```

Certifique que o `io-multer/index.js` esteja de pé para receber sua requisição `axios` e rode esse script, com `node ping.js`, na pasta ping  e veja a saída. Você deverá ver no console a mensagem `pong! 200`.

Explicando melhor o que aconteceu: o `axios` fez uma requisição HTTP, assim como as que o Postman faz, e assim como as que o browser faz.

Existem outras formas de se fazer requisições HTTP através do axios:
##### GET
```js
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })

// Você pode usar métodos async também
const getUser = async () => {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

##### POST
```js
const body = {
  firstName: 'Fred',
  lastName: 'Flintstone'
};

axios.post('/user', body)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
```
Você pode conferir mais exemplos na [documentação do axios](https://github.com/axios/axios).

#### Fazendo o upload de arquivos para uma API

Agora que já sabemos como utilizar o axios, vamos usá-lo para enviar um arquivo, lido localmente com o NodeJS, para a nossa API. Para isso, vamos criar mais uma pasta chamada `send-files`, fora das pastas criadas anteriormente. Lá dentro, criaremos dois arquivos: `send.js` e `meu-arquivo.txt`. Dentro de `meu-arquivo.txt`, coloque um texto qualquer. Lembre-se sempre de criar um projeto node com npm init .

Dentro do arquivo send-file:
```sh
npm init -y
npm i axios form-data
```

`form-data` é uma biblioteca que nos ajudará a montar uma requisição do tipo `multipart/form-data`. Ela pode ser usada para submeter formulários e fazer upload de arquivos para outras aplicações web. Note que, no navegador, a classe `FormData`, fornecida por essa biblioteca, já existe por padrão, de forma que o uso do pacote de terceiros só se faz necessário no Node.js.

Dentro de `send.js`, colocamos o código abaixo:
_send-file/send.js_
```js
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

/* Criamos um stream de um arquivo */
const stream = fs.createReadStream('./meu-arquivo.txt');

/* Aqui, criamos um formulário com um campo chamado 'file' que carregará */
/* o stream do nosso arquivo */
const form = new FormData();
form.append('file', stream);

/* Esse arquivo não será enviado no body da requisição como de costume. */
/* Em ambientes NodeJS, é preciso setar o valor de boundary no header */
/* 'Content-Type' chamando o método `getHeaders` */
const formHeaders = form.getHeaders();

axios
  .post('http://localhost:3000/files/upload', form, {
    headers: {
      ...formHeaders,
    },
  })
  .then((response) => {
    console.log(response.status);
  })
  .catch((error) => {
    console.error(error);
  });
```

Em seguida, execute o arquivo `send.js`. Caso nenhum erro tenha ocorrido, verifique a pasta `/uploads` do nosso servidor que fica no projeto `io-multer`, lembra? Você verá que existe um arquivo com um nome como `f9556c41394ad1885b7f6e3d60b7d997`. Dentro dele, haverá o conteúdo do seu arquivo `meu-arquivo.txt`.

#### Dando nome aos "bois" arquivos com multer Storage

Como você percebeu, foi gerado um arquivo com um nome bizarro, não é mesmo? Como podemos fazer para dar um nome a esse arquivo?

Dentro no script do nosso servidor, vamos criar um `multer Storage`. Um storage nos permite ter um controle mais detalhado do upload de nossos arquivos. Podemos extrair o valor do nome original do arquivo enviado pelo formulário através da propriedade originalname:

_io-multer/index.js_
```js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const multer = require('multer');

// const PORT = process.env.PORT;

// const controllers = require('./controllers');

// const app = express();

// app.use(
//   cors({
//     origin: `http://localhost:${PORT}`,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Authorization'],
//   })
// );

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// /* Definindo nossa pasta pública */
// /* `app.use` com apenas um parâmetro quer dizer que
//    queremos aplicar esse middleware a todas as rotas, com qualquer método */
// /* __dirname + '/uploads' é o caminho da pasta que queremos expor publicamente */
// /* Isso quer dizer que, sempre que receber uma request, o express vai primeiro
//    verificar se o caminho da request é o nome de um arquivo que existe em `uploads`.
//    Se for, o express envia o conteúdo desse arquivo e encerra a response.
//    Caso contrário, ele chama `next` e permite que os demais endpoints funcionem */
// app.use(express.static(__dirname + '/uploads'));

/* destination: destino do nosso arquivo
   filename: nome do nosso arquivo.

   No caso, vamos dar o nome que vem na
   propriedade `originalname`, ou seja,
   o mesmo nome que o arquivo tem no
   computador da pessoa usuária */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }});

const upload = multer({ storage });

// app.post('/files/upload', upload.single('file'), (req, res) =>
//   res.status(200).json({ body: req.body, file: req.file })
// );

// app.get('/ping', controllers.ping);

// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
// });
```

Reinicie novamente o servidor do projeto io-multer , com node index.js . Em seguida, execute o script send.js , com node send.js , várias vezes e confira sua pasta uploads/ na pasta io-multer , no caso, seu servidor.

Repare que agora foi gerado outro arquivo, porém com o nome meu-arquivo.txt. Você executou várias vezes, certo? Nada aconteceu desde que o arquivo meu-arquivo.txt foi gerado a primeira vez. Caso você altere o texto que está dentro do meu-arquivo.txt, e execute novamente, não será gerado um novo arquivo meu-arquivo.txt , ele será apenas atualizado com o novo valor do conteúdo!

ℹ️ Faça o teste ℹ️: Seguindo o exemplo anterior, crie um arquivo que salve os arquivos enviados para http://localhost:3000/uploads , o formato dos arquivos salvos deve ser a seguinte: nome-do-arquivo-enviado${data-de-agora} , sem a extensão do arquivo enviado.
Um ponto que merece ser comentado é o uso da callback para informar ao multer o nome do arquivo a ser armazenado. Isso significa duas coias:

* 1 - Podemos utilizar código assíncrono (como realizar uma busca no banco, por exemplo);

* 2 - Podemos passar um erro no primeiro parâmetro caso não seja desejado prosseguir com o armazenamento do arquivo.

#### Acessando os arquivos enviados pela API

Como já tornamos pública a pasta /uploads , que é onde guardamos os arquivos enviados, não precisamos fazer mais nada para deixá-los disponíveis através da API.

Se você acessar `http://localhost:3000/meu-arquivo.txt`, deverá ver o conteúdo do seu arquivo no browser. Que tal testar com outros tipos de arquivo, como uma imagem?
```js
```

```js
```

```js
```

```js
```