### Realizar operações assíncronas utilizando callbacks

Vamos usar como exemplo a função ```readFile``` do módulo ```fs``` do Node.js. Ela realiza a leitura de um arquivo e, quando termina, chama uma função de callback, passando o resultado:

```js
const fs = require('fs');

fs.readFile('./arquivo.txt', (err, content) => {
  if (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
    return;
  }

  console.log(`Arquivo lido com sucesso. Conteúdo: ${content.toString('utf8')}`);
});
```

No exemplo acima, passamos uma função para ```readFile```, à qual damos o nome de callback. Essa função de callback recebe dois parâmetros: o primeiro, que chamamos de ```err```, é um erro que pode ter ocorrido durante a leitura do arquivo. Caso nenhum erro tenha ocorrido, esse parâmetro será ```undefined```. O segundo parâmetro é, nesse caso, o conteúdo do arquivo, em forma de uma sequência de bytes, que chamamos de ```content```. Caso ocorra um erro na leitura do arquivo, esse parâmetro será ```undefined```.

Esse formato de callback que recebe dois parâmetros, erro e resultado, não foi utilizado por acaso. Callbacks desse tipo são chamadas de **node-style callbacks** e são, por convenção, a melhor maneira de se estruturar uma callback. **Toda API de módulos nativos do Node.js utiliza esse mesmo formato de callbacks**.

#### O lado ruim dos callbacks

A principal desvantagem das callbacks vem do fato de que o resultado de uma operação só existe dentro daquela callback; ou seja: se precisamos executar uma coisa depois da outra, precisamos colocar uma callback dentro da outra. À medida que vamos fazendo isso, vamos aumentando o nível de indentação necessária e, portanto, aumentamos a dificuldade de ler e até mesmo de dar manutenção no código. Vamos ver um exemplo:

Suponhamos que precisamos ler, sequencialmente, três arquivos, e que vamos fazê-lo de forma assíncrona, para não travar nosso servidor. O código para isso ficaria mais ou menos assim:
```js
const fs = require('fs');

fs.readFile('file1.txt', (err, file1Content) => {
  if (err) return console.log(`Erro ao ler arquivo 1: ${err.message}`);

  console.log(`Lido file1.txt com ${file1Content.byteLength} bytes`);

  fs.readFile('file2.txt', (err, file2Content) => {
    if (err) return console.log(`Erro ao ler o arquivo 2: ${err.message}`);

    console.log(`Lido file2.txt com ${file2Content.byteLength} bytes`);

    fs.readFile('file3.txt', (err, file3Content) => {
      if (err) return console.log(`Erro ao ler o arquivo 3: ${err.message}`);

      console.log(`Lido file3.txt com ${file3Content.byteLength} bytes`);
    });
  });
});
```

### Realizar operações assíncronas utilizando Promises

As Promises estão em como tratamos o sucesso ou o erro. Enquanto com callbacks temos apenas uma função que recebe tanto o sucesso quanto o erro, nas Promises temos uma forma de registrar uma callback para sucesso e outra forma de registrar uma callback para erros.

Exemplo 1: Tratando erros de forma síncrona.

```js
function dividirNumeros(num1, num2) {
  if (num2 == 0) throw new Error("Não pode ser feito uma divisão por zero");

  return num1 / num2;
}

try {
  const resultado = dividirNumeros(2, 1);
  console.log(`resultado: ${resultado}`);
} catch (e) {
  console.log(e.message);
}
```

Exemplo 2: Tratando erros de forma assíncrona.
```js
function dividirNumeros(num1, num2) {
  const promise = new Promise((resolve, reject) => {
    if (num2 == 0) reject(Error("Não pode ser feito uma divisão por zero"));

    const resultado = num1 / num2;
    resolve(resultado)
  });

  return promise;
}

dividirNumeros(2, 1)
  .then(result => console.log(`sucesso: ${result}`))
  .catch(err => console.log(`erro: ${err.message}`));
```

##### Promises
```js
const fs = require('fs');

function readFilePromise (fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, content) => {
      if (err) return reject(err);
      resolve(content);
    });
  });
}

readFilePromise('file1.txt') // A função me promete que vai ler o arquivo
  .then((content) => { // Caso arquivo 1 seja lido,
    console.log(`Lido file1.txt com ${content.byteLength} bytes`); // Escrevo o resultado no console
    return readFilePromise('file2.txt'); // Chamo novamente a função, que me retorna uma nova Promise
  })
  .then(content => { // Caso a Promise retornada pelo `then` anterior seja resolvida,
    console.log(`Lido file2.txt com ${content.byteLength} bytes`); // Escrevemos o resultado no console
    return readFilePromise('file3.txt'); // E chamamos a função novamente, recebendo uma nova promessa
  })
  .then((content) => { // Caso a promessa de leitura do `file3.txt` seja resolvida,
    console.log(`Lido file3.txt com ${content.byteLength} bytes`); // Logamos o resultado no console
  })
  .catch((err) => { // Caso qualquer uma das promessas ao longo do caminho seja rejeitada
    console.log(`Erro ao ler arquivos: ${err.message}`); // Escrevemos o resultado no console
  });
```

### Lendo arquivos com métodos síncronos

Os métodos assíncronos não esperam o comando atual terminar para iniciar o próximo. Se quisermos ler um arquivo de maneira assíncrona, o Javascript não vai esperar o arquivo inteiro ser lido para só então dar continuidade ao script. Se quisermos esse comportamento, precisamos de um método síncrono . O método disponibilizado pelo módulo fs para leitura síncrona de arquivos é o ```fs.readFileSync```. Vamos utilizá-lo no exemplo a seguir.

Para começar, vamos criar uma pasta para nosso projeto, chamada ```io-local```. Iniciaremos nosso projeto Node.js usando o comando ```npm init```. Feito isso, vamos criar um arquivo chamado ```readFileSync.js``` e colocar nele o seguinte código:

_io-local/readFileSync.js_

```js
const fs = require('fs');

const nomeDoArquivo = 'meu-arquivo.txt';

try {
  const data = fs.readFileSync(nomeDoArquivo, 'utf8');
  console.log(data);
} catch (err) {
  console.error(`Erro ao ler o arquivo: ${err.path}`);
  console.log(err);
}
```

##### Método `fs.readFileSync`
Esse método é responsável por ler arquivos e trazer seu conteúdo para dentro do Node.js. Por ser síncrono, ele espera a leitura do arquivo terminar para, só então, atribuir o resultado à constante `data`.

O método `readFileSync` recebe dois parâmetros:

* O nome do arquivo;
* Um parâmetro opcional que, quando é uma string, define o encoding que será utilizado durante a leitura do arquivo.

Em caso de erros na leitura do arquivo, com funções síncronas, como `readFileSync`, você deve tratar explicitamente os erros que puderem acontecer. Nesse exemplo, usamos um bloco `try...catch` para capturar quaisquer erros que possam acontecer durante a leitura do arquivo e imprimimos uma mensagem para o usuário no terminal.

### Lendo arquivos com métodos assíncronos

O método fornecido pelo módulo `fs` para leitura assíncrona de arquivos é o `fs.readFile`. Na versão padrão do `fs`, a função `readFile` aceita um callback, que é chamado quando a leitura do arquivo termina.

Vamos criar um arquivo chamado `readFile.js` dentro da nossa pasta `io-local` e colocar nele o seguinte código:

__io-local/readFile.js__
```js
const fs = require('fs');

const nomeDoArquivo = 'meu-arquivo.txt';

fs.readFile(nomeDoArquivo, 'utf8', (err, data) => {
  if (err) {
    console.error(`Não foi possível ler o arquivo ${nomeDoArquivo}\n Erro: ${err}`);
    process.exit(1);
  }
  console.log(`Conteúdo do arquivo: ${data}`);
});
```

##### Método fs.readFile

Esse método também é responsável por ler arquivos e trazer seu conteúdo para dentro do Node.js.

Ele recebe três parâmetros:

* O nome do arquivo;
* Um parâmetro opcional que, quando é uma string, define o encoding que será utilizado durante a leitura do arquivo;
* Uma callback que permite receber e manipular os dados lidos do arquivo.

A callback é uma função que recebe dois parâmetros: err e data . Caso ocorra um erro durante a leitura do arquivo, o parâmetro err virá preenchido com as informações referentes ao erro. Quando esse parâmetro vier vazio, significa que a leitura do conteúdo do arquivo ocorreu sem problemas. Nesse caso, o segundo parâmetro, data , virá preenchido com o conteúdo do arquivo.

No entanto, essa não é a única forma do método `readFile`. O módulo `fs` possui um segundo modelo de API que, em vez de trabalhar com callbacks, retorna `Promises`, o que torna seu uso muito mais recomendável.

Para utilizar a interface de Promises do `fs`, precisamos alterar a importação do módulo `fs`, importando, agora `fs/promises`. Vamos ver como ficaria o código acima se utilizarmos Promises:
```js
const fs = require('fs/promises');

const nomeDoArquivo = 'meu-arquivo.txt';

fs.readFile(nomeDoArquivo, 'utf8')
  .then((data) => {
    console.log(`Conteúdo do arquivo: ${data}`);
  })
  .catch((err) => {
    console.error(`Não foi possível ler o arquivo ${nomeDoArquivo}\n Erro: ${err}`);
    process.exit(1); // Encerra a execução do script e informa ao sistema operacional que houve um erro com código
  });
```
Dessa forma, sempre que precisarmos ler arquivos de forma assíncrona, podemos utilizar o método `readFile` do módulo `fs/promises`.

### Escrevendo dados em arquivos

Atenção: O módulo `fs` também disponibiliza um método `writeFile`, que funciona utilizando callbacks. Vamos utilizar diretamente o módulo `fs/promises`, já que o uso de Promises é bem mais encorajado que o uso de callbacks.

__io-local/writeFile.js__
```js
const fs = require('fs/promises');

fs.writeFile('./meu-arquivo.txt', 'Meu textão')
  .then(() => {
    console.log('Arquivo escrito com sucesso!');
  })
  .catch((err) => {
    console.error(`Erro ao escrever o arquivo: ${err.message}`);
  });
```
Rode o script com node writeFile.js . Repare que o conteúdo do meu-arquivo.txt foi alterado para "Meu textão".

### Utilizando async/await

Acontece que nem sempre queremos utilizar essa API das Promises. Muitas vezes, queremos simplesmente buscar o resultado e pronto. E é aí que entra o `async/await`.

A questão é que toda função na qual utilizamos `async`, automaticamente passa a retornar uma Promise, que será rejeitada em caso de erro, e resolvida em caso de sucesso.

O resultado de usarmos `async / await` é que o código fica com uma sintaxe quase idêntica à sintaxe utilizada para código síncrono. Veja como fica o exemplo anterior utilizando async/await :

```js
const fs = require('fs/promises');

async function main() {
  try {
    await fs.writeFile('./meu-arquivo.txt', 'Meu textão');
    console.log('Arquivo escrito com sucesso!');
  } catch (err) {
    console.error(`Erro ao escrever o arquivo: ${err.message}`);
  }
}

main()
```
Perceba que, para podermos utilizar o `async/await`, precisamos criar uma função main e colocar nossa lógica dentro dela. Isso acontece porque, por enquanto, o await só pode ser utilizado dentro de funções `async`.

Ainda sobre o `writeFile`, você pode especificar algumas opções na escrita de arquivos passando um terceiro parâmetro opcional para os métodos `writeFile` e `writeFileSync`. A opção [flag](https://nodejs.org/api/fs.html#fs_file_system_flags) especifica como o arquivo deve ser aberto e manipulado. O padrão é `'w'`, que especifica que o arquivo deve ser aberto para escrita. Se o arquivo não existir, ele é criado. Caso contrário, ele é reescrito, ou seja, tem seu conteúdo apagado antes de o novo conteúdo ser escrito. A flag `'wx'`, por exemplo, funciona como `'w'`, mas lança um erro caso o arquivo já exista:

```js
const fs = require('fs/promises');

// A flag wx abre o arquivo para escrita **apenas** caso ele não exista. Caso o contrário, um erro será lançado
fs.writeFile('./meu-arquivo.txt', 'Eu estive aqui :eyes:', { flag: 'wx' })
  .then(() => {
    console.log('Arquivo salvo');
  })
  .catch((err) => {
    // Se o arquivo existir, um erro é retornado
    console.error('err');
  });
```

#### Rodando tudo junto

O `Promise.all` é um método da Promise que nos permite passar um array de Promises e receber, de volta, uma única Promise. Ela será resolvida com os resultados de todas as Promises, assim que todas elas forem resolvidas. Esse método também nos permite utilizar um único `catch`, que será chamado caso qualquer uma das Promises seja rejeitada.

```js
const fs = require('fs/promises');

Promise.all([
  fs.readFile('file1.txt'),
  fs.readFile('file2.txt'),
  fs.readFile('file3.txt'),
])
  .then(([file1, file2, file3]) => {
    const fileSizeSum = file1.byteLength + file2.byteLength + file3.byteLength;
    console.log(`Lidos 3 arquivos totalizando ${fileSizeSum} bytes`);
  })
  .catch((err) => {
    console.error(`Erro ao ler arquivos: ${err.message}`);
  });
```

Agora, estamos lendo os três arquivos ao mesmo tempo, e nosso `.then` será executado quando a leitura de todos eles terminar, recebendo como parâmetro um array com o resultado de cada uma das Promises.

