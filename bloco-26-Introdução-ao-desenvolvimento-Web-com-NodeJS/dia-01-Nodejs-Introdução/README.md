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
