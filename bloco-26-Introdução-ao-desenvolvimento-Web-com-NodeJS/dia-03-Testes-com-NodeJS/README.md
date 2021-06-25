### Testes automatizados

Para implementar testes no back-end iremos utilizar a dupla `mocha` e `chai`. Apesar de serem duas ferramentas diferentes, elas se completam.

Instalação do `mocha` e `chai` em ambiente de desenvolvimento:
```sh
npm install -D mocha chai
```

### Tipos de teste

* **Testes unitários:** Trabalham presumindo um escopo limitado a um pequeno fragmento do seu código com interação mínima entre recursos externos. Ex: Uma função com um fim específico, como uma função que soma dois números:

```js
// ./funcoes/calculo/soma.js
// Aqui podemos escrever testes pensando somente o comportamento esperado para função `soma`

const soma = (valorA, valorB) => valorA + valorB;

module.exports = soma;
```

* **Testes de integração:** Trabalham presumindo a junção de múltiplos escopos (que tecnicamente devem possuir, cada um, seus próprios testes) com interações entre eles. Ex: Uma função de calculadora que usa funções menores que eu posso testar isoladamente/ de forma unitária:
```js
// ./funcoes/calculadora.js
// Aqui podemos escrever testes pensando o comportamento da função `calculadora` que presume o bom comportamento das funções que integram ela: `soma`, `subtracao`, `multiplicacao`, `divisao`

const { soma, subtracao, multiplicacao, divisao } = require("./calculo");

const calculadora = (valorA, valorB, operacao) => {
  switch(operacao) {
    case "soma":
      soma(valorA, valorB);
      break;
    case "subtracao":
      subtracao(valorA, valorB);
      break;
    case "multiplicacao":
      multiplicacao(valorA, valorB);
      break;
    case "divisao":
      divisao(valorA, valorB);
      break;
    default:
      break;
  }
};

module.exports = calculadora;

// Esse contexto fica mais evidente, quando temos operações mais complexas nos nossos testes, como operações que envolvem leitura de arquivos e consultas no banco de dados para composição de informações
```

* **Testes de Ponto-a-ponto:** Chamados também de Fim-a-fim (End-to-End; E2E), esses testes pressupõe um fluxo de interação completo com a aplicação, de um ponto a outro: Aqui, poderíamos pensar uma API que utiliza nossa calculadora (assim como diversas outras funções mais complexas) na hora de realizar uma operação de venda de produtos. Esse teste é o mais completo pois pressupõe que todos os demais testes estão ou serão desenvolvidos.

### Escrevendo testes

* Sobre a estrutura:
  * Nossa função deverá receber um parâmetro "media";
  * Responder com "reprovado" ou "aprovado".

* Sobre os comportamentos esperados:
  * Se passado um valor **menor que 7**, por exemplo 4, a resposta deve ser **"reprovado"**;
  * Se passado um valor **maior que 7**, por exemplo 9, a resposta ser **"aprovado"**;
  * E, não podemos esquecer do **"OU"**, sendo assim, **se passado 7**, a resposta deve ser **"aprovado"**;

#### Estruturando testes com o Mocha

O `mocha` nos fornece duas palavras reservadas o `describe` e o `it`.

* O describe nos permite adicionar uma descrição para um teste específico ou um grupo de testes.
* Já o it nos permite sinalizar exatamente o cenário de teste que estamos testando naquele ponto.

Ex:
```js
describe('Quando a média for menor que 7', () => {
  it('retorna "reprovado"', () => {
    //
  });
});
```

### Aferindo testes com o Chai

O `chai` nos ajudará com as asserções, ou seja, ele nos fornece maneiras de dizermos o que queremos testar e então ele validará se o resultado condiz com o esperado.

Essa validação é o que chamamos de `assertion`, "asserção" ou, em alguns casos, "afirmação". Para nos ajudar com essa tarefa temos o `chai`, que nos fornece diversos tipos de validações diferentes.

Usaremos a interface expect do chai em nossos exemplos, que significa de fato o que é esperado para determinada variável:
```js
const resposta = calculaSituacao(4);

expect(resposta).equals('reprovado');
```

##### mocha + chai :
__tests/calculaSituacao.js__
```js
const { expect } = require('chai');

const calculaSituacao = require('../examples/calculaSituacao');

describe('Quando a média for menor que 7', () => {
  it('retorna "reprovado"', () => {
    const resposta = calculaSituacao(4);

    expect(resposta).equals('reprovado');
  });
});
```

Pronto, nosso primeiro cenário de teste está escrito. Perceba como o `chai` nos fornece uma função pronta, equals que irá comparar se o valor "esperado" na resposta é igual ao passado para ele, ou seja, igual a "reprovado".
[Documentação oficial do chai.](https://www.chaijs.com/api/bdd/)

Para tornar nosso teste ainda mais legível e elegante, o `chai` nos fornece outros getters encadeáveis que possuem um papel puramente estético. Por exemplo o `to` e o `be`, que nos permite escrever nossa assertion da seguinte maneira:
__tests/calculaSituacao.js__
```js
const { expect } = require('chai');

const calculaSituacao = require('../examples/calculaSituacao');

describe('Quando a média for menor que 7', () => {
  it('retorna "reprovado"', () => {
    const resposta = calculaSituacao(4);

    expect(resposta).to.be.equals('reprovado');
  });
});
```

### Executando o teste

Vamos adicionar um novo script ao nosso `package.json`, que chama o `mocha` e informa um arquivo ou diretório de testes:
__package.json__
```json
{
// ...
  "scripts": {
    "start": "node index.js",
    "test": "mocha tests"
  },
// ...
}
```

Rodar os testes:
```sh
npm run test
```
ou:
```sh
npm test
```

### Testando todos os cenários

O Código a ser testado:
```js
function calculaSituacao(media) {
  if (media > 7) {
    return 'aprovado';
  }

  return 'reprovado';
}

module.exports = calculaSituacao;
```

Adicionando os demais comportamentos, temos:
__tests/calculaSituacao.js__
```js
const { expect } = require('chai');

const calculaSituacao = require('../examples/calculaSituacao');

describe('Quando a média for menor que 7', () => {
  it('retorna "reprovado"', () => {
    const resposta = calculaSituacao(4);

    expect(resposta).to.be.equals('reprovado');
  });
});

describe('Quando a média for maior que 7', () => {
  it('retorna "aprovado"', () => {
    const resposta = calculaSituacao(9);

    expect(resposta).to.be.equals('aprovado');
  });
});

describe('Quando a média for igual a 7', () => {
  it('retorna "aprovado"', () => {
    const resposta = calculaSituacao(7);

    expect(resposta).to.be.equals('aprovado');
  });
});
```
O teste irá falhar no terceiro teste, onde propositalmente foi deixado um bug.
Correções:
```js
function calculaSituacao(media) {
  if (media >= 7) {
    return 'aprovado';
  }

  return 'reprovado';
}

module.exports = calculaSituacao;
```

### TDD - Transformando requisitos em testes

A prática do **TDD** em começar a escrever os testes que traduzem e validam os comportamentos esperados para aquele código antes de começar a implementação.

A ideia principal é começarmos escrever o código já pensando no que está sendo testado, ou seja, já teremos em mente quais os cenários que precisamos cobrir e também como nosso código precisa estar estruturado para que possamos testá-lo, já que códigos menos estruturados normalmente são mais difíceis de serem testados.

Pensando em passos para o **TDD**, podemos pensar da seguinte maneira:
* 1 - Antes de qualquer coisa, precisamos interpretar os requisitos, pensando nos comportamentos que iremos implementar e a na estrutura do código: se será uma função, um módulo, quais os inputs, os outputs, etc..

* 2 - Tendo isso em mente, começamos a escrever os testes, ou seja, criamos a estrutura de `describes` e `its` que vimos.

* 3 - Depois, escrevemos as asserções. Perceba que antes mesmo de ter qualquer código, já iremos criar chamadas a esse código, o que significa que nossos testes irão falhar. Não se preocupe, pois essa é exatamente a ideia nesse momento.

* 4 - Agora que já temos os testes criados, vamos a implementação do nosso código. A ideia é escrever os códigos pensando nos testes e, conforme vamos cobrindo os cenários, nossos testes que antes quebravam começam a passar.

### Um pouco mais de testes

Escreveremos uma função que lê o conteúdo de um arquivo. Essa função:

* Receberá um parâmetro com o nome do arquivo a ser lido. Esse arquivo deverá estar na pasta `io-files`;
* Caso o arquivo solicitado exista, responderá uma string com o conteúdo do arquivo;
* Caso o arquivo solicitado não exista, deverá responder `null`.

inicializar um pacote json:
```sh
npm init
```
Instalar `mocha` e o `chai`
```js
npm install --save-dev mocha chai
```

Adicionar o script no package.json
```json
{
  //
  "scripts": {
    "start": "node index.js",
    "test": "mocha test.js"
  },
  //
}
```

### Mocha
Escrevendo o `mocha`:
__io-test/test.js__
```js
describe('leArquivo', () => {
  describe('Quando o arquivo existe', () => {
    describe('a resposta', () => {
      it('é uma string', () => {
        //
      });

      it('é igual ao conteúdo do arquivo', () => {
        //
      });
    });
  });

  describe('Quando o arquivo não existe', () => {
    describe('a resposta', () => {
      it('é igual a "null"', () => {
        //
      });
    });
  });
});
```

### Chai

Escrevendo o `chai`
__io-test/test.js__
```js
const { expect } = require('chai');

const leArquivo = require('./leArquivo');

const CONTEUDO_DO_ARQUIVO = 'VQV com TDD';

describe('leArquivo', () => {
  describe('Quando o arquivo existe', () => {
    describe('a resposta', () => {
      const resposta = leArquivo('arquivo.txt');

      it('é uma string', () => {
        expect(resposta).to.be.a('string');
      });

      it('é igual ao conteúdo do arquivo', () => {
        expect(resposta).to.be.equals(CONTEUDO_DO_ARQUIVO);
      });
    });
  });

  describe('Quando o arquivo não existe', () => {
    it('a resposta é igual a "null"', () => {
      const resposta = leArquivo('arquivo_que_nao_existe.txt');

      expect(resposta).to.be.equal(null);
    });
  });
});
```
Aqui utilizamos uma nova asserção do `chai`, o `a`, que validará o "tipo" daquele retorno. Como se tivéssemos escrito: "espera a resposta ser uma string" (ou expect response to be a string).

### Implementação

__io-test/leArquivo.js__
```js
const fs = require('fs');

function leArquivo(nomeDoArquivo) {
  try {
    const conteudoDoArquivo = fs.readFileSync(nomeDoArquivo, 'utf8');

    return conteudoDoArquivo;
  } catch (err) {
    return null;
  }
}

module.exports = leArquivo;
```

### Isolando nossos testes

Nossos testes não devem realizar operações de IO (`input/output`), ou seja, não devem acessar nem o disco, nem a rede.

Quando criamos aplicações de frontend, estamos na maior parte do tempo, manipulando o DOM. Quando falamos de javascript no backend com NodeJS, constantemente estamos realizando operações com IO, ou seja, nossa aplicação se comunica com o sistema de arquivos ou com a rede. Exemplos dessas comunicações são a leitura e escrita de arquivos, chamadas a APIs ou consultas em um banco de dados.

Dessa forma, o ideal é não permitir que nosso código realize essas operações de IO de fato, mas apenas simular que elas estão sendo realizadas. Dessa forma, **isolamos o IO** de nossos testes, garantindo que um banco de dados inconsistente ou um arquivo faltando na hora de executar os testes não faça com que tudo vá por água abaixo.

Para isso existe o conceito de `Test Doubles`, que são objetos que fingem ser o outro objeto para fins de testes.

Com esses objetos, podemos simular, por exemplo, as funções do módulo `fs`. Nosso código irá pensar que está chamando as funções do `fs`, porém, estará chamando as nossas funções, que se comportarão da maneira que queremos, mas sem a necessidade de escrever, ler ou ter dependência de arquivo reais.
Para nos ajudar com esse tipo de coisa, usaremos uma ferramenta chamada [sinon](https://sinonjs.org/).

### Sinon

No momento focaremos em um tipo de `Test Double`, o `stub`. Stubs são objetos que podemos utilizar para simular interações com dependências externas ao que estamos testando de fato (na literatura, é comum referir-se ao sistema sendo testado como SUT, que significa System under Test).

Instalação do Sinon:
```js
npm install --save-dev sinon
```

Como podemos criar um `stub` para a função de leitura do `fs`:
```js
const fs = require('fs');
const sinon = require('sinon');

sinon.stub(fs, 'readFileSync')
  .returns('Valor a ser retornado');
```
Perceba que precisamos importar o módulo `fs` e, então, falamos para o `sinon` criar um stub para a função `readFileSync` que retornará __'Valor a ser retornado'__, conforme especificamos na chamada para `returns`.

### Stub
Vamos modificar nosso teste para utilizar o stub:
_io-test/test.js_
```js
const fs = require('fs');
const sinon = require('sinon');
const { expect } = require('chai');

const leArquivo = require('./leArquivo');

const CONTEUDO_DO_ARQUIVO = 'VQV com TDD';

sinon.stub(fs, 'readFileSync').returns(CONTEUDO_DO_ARQUIVO);

describe('leArquivo', () => {
  describe('Quando o arquivo existe', () => {
    describe('a resposta', () => {
      const resposta = leArquivo('arquivo.txt');

      it('é uma string', () => {
        expect(resposta).to.be.a('string');
      });

      it('é igual ao conteúdo do arquivo', () => {
        expect(resposta).to.be.equals(CONTEUDO_DO_ARQUIVO);
      });
    });
  });

  describe('Quando o arquivo não existe', () => {
    it('a resposta é igual a "null"', () => {
      const resposta = leArquivo('arquivo_que_nao_existe.txt');

      expect(resposta).to.be.equal(null);
    });
  });
});
```
Perceba que os testes que esperavam o valor retornados pelo stub funcionaram. Porém, onde o valor esperado era outro, o teste passou a quebrar.

Isso aconteceu porque criamos um comportamento falso único para a função, que é aplicado para todos os testes. Entretanto, em cada situação é esperado um valor diferente:

* Quando o arquivo passado existe é esperado que ela retorne o valor;
* Quando o arquivo passado não existe é esperado um erro;

Sendo assim, o ideal é sempre criarmos Tests Doubles para o escopo de cada cenário de teste.

O mocha nos fornece duas funções chamadas `before` e `after`. Como o nome diz, são funções que serão executadas "antes" e "depois" daquele "bloco" de testes, ou seja, daquele `describe`.

Vamos adicionar esse conceito ao nosso teste:
```js
const fs = require('fs');
const sinon = require('sinon');
const { expect } = require('chai');

const leArquivo = require('./leArquivo');

const CONTEUDO_DO_ARQUIVO = 'VQV com TDD';

describe('leArquivo', () => {
  describe('Quando o arquivo existe', () => {
    before(() => {
      sinon.stub(fs, 'readFileSync').returns(CONTEUDO_DO_ARQUIVO);
    });

    after(() => {
      fs.readFileSync.restore();
    });

    describe('a resposta', () => {
      it('é uma string', () => {
        const resposta = leArquivo('arquivo.txt');

        expect(resposta).to.be.a('string');
      });

      it('é igual ao conteúdo do arquivo', () => {
        const resposta = leArquivo('arquivo.txt');

        expect(resposta).to.be.equals(CONTEUDO_DO_ARQUIVO);
      });
    });
  });

  describe('Quando o arquivo não existe', () => {
    before(() => {
      sinon
        .stub(fs, 'readFileSync')
        .throws(new Error('Arquivo não encontrado'));
    });

    after(() => {
      fs.readFileSync.restore();
    });

    describe('a resposta', () => {
      it('é igual a "null"', () => {
        const resposta = leArquivo('arquivo_que_nao_existe.txt');

        expect(resposta).to.be.equal(null);
      });
    });
  });
});
```
Perceba que antes de cada cenário de teste nós alteramos o comportamento do método do `fs` criando um `stub` e, depois da execução do teste, utilizamos a função `restore()` que o `sinon` atribui aos `stubs` para retornarmos o comportamento padrão daquela função.

Perceba que não foi necessário fazer nenhum IO de verdade, não precisamos criar um arquivo real com o conteúdo do teste. Devemos ter esse conceito sempre em mente quando estivermos falando sobre testes.
