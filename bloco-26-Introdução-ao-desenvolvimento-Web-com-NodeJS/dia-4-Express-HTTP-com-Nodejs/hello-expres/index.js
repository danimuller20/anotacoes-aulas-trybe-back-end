const bodyParser = require('body-parser');
const express = require('express');

const app = express(); // 1

app.use(bodyParser.json());

app.get('/hello', handleHelloWorldRequest);

const langs = ['HTML', 'CSS', 'JS'];

app.get('/langs', (_req, res) => {
  res.send(langs)
});

app.post('/langs', (req, res) => {
  const { name } = req.body;
  langs.push(name);
  res.send(`Linguagem ${name} adicionada com sucesso!`);
});
// http POST :3000/langs name=Ruby

app.listen(3000, () => {
  console.log('Aplicação ouvindo na porta 3000');
}); // 3

function handleHelloWorldRequest(_req, res) {
  res.status(200).send('Hello World!'); // 4
}