//? Exercício 1 : Altere o imdbRating para 7.7 no filme Batman.

db.movies.updateOne({ "title": "Batman" }, { $set: { "imdbRating": 7.7 } });

//? Exercício 2: Altere budget para 1 no filme Godzilla.

db.movies.updateOne({ "title": "Godzilla" }, { $set: { "budget": 1 } });

//? Exercício 3: Altere budget para 15 e imdbRating para 5.5 no filme Home Alone.

db.movies.updateOne({ "title": "Home Alone" }, { $set: { "budget": 15, "imdbRating": 5.5 } });

//? Exercício 4: Aumente em 2 o imdbRating do filme Batman.

db.movies.updateOne({ "title": "Batman" }, { $inc: { "imdbRating": 2 } });

//? Exercício 5: Aumente em 5 o budget do filme Home Alone.

db.movies.updateOne({ "title": "Home Alone" }, { $inc: { "budget": 5 } });

//? Exercício 6: Multiplique por 4 o imdbRating do filme Batman.

db.movies.updateOne({ "title": "Batman" }, { $mul: { "imdbRating": 4 } });

//? Exercício 7: Renomeie o campo budget para estimatedBudget do filme Batman.

db.movies.updateOne({ "title": "Batman" }, { $rename: { "budget": "estimatedBudget" } });

//? Exercício 8: Utilize o operador $min para alterar o budget para 5 do filme Home Alone.

db.movies.updateOne({ "title": "Home Alone" }, { $min: { "budget": 5 } });

//? Exercício 9: Utilize o operador $max para alterar o imdbRating para 8.6 do filme Godzilla. Além disso, altere a categoria "adventure" para "thriller" do filme Godzilla.

db.movies.updateOne({ "title": "Godzilla" }, { $max: { "imdbRating": 8.6 }, $set: { "category.1": "thriller" } });

//? Exercício 10: Utilizando o operador $currentDate, crie um campo chamado lastUpdated com o tipo timestamp no filme Home Alone.

db.movies.updateOne({ "title": "Home Alone" }, { $currentDate: { "lastUpdated": {$type: "timestamp"} } });

//? Exercício 11: Utilizando uma única operação, crie um campo chamado sequels e atribua a ele o valor 0 em todos os documentos.

db.movies.updateMany({}, { $set: { "sequels": 0 } });

//? Exercício 12: Utilizando uma única operação, remova os campos budget e estimatedBudget em todos os documentos.

db.movies.updateMany({}, { $unset: { "budget": "", "estimatedBudget": "" } });

//? Exercício 13: Para os filmes Batman ou Home Alone, atribua a imdbRating o valor 17, caso o valor de imdbRating seja menor que 17.

db.movies.updateMany({"title": { $in: ["Batman", "Home Alone"] } }, { $max: {"imdbRating": 17} });

//* Exercícios bônus:

//? Exercício 14: Remova o campo class dos documentos que possuem esse campo com o valor unknown.

db.xmen.updateMany({"class": "unknown"}, {  $currentDate: { lastUpdate: { $type: "timestamp" } }, $unset: { "class": "" } });

//? Exercício 15: Produza uma query que renomeie os campos de name para hero_name, e de true_name para full_name; adicione o campo power com valor 100, em todos os documentos.

db.xmen.updateMany({}, {  $currentDate: { lastUpdate: { $type: "timestamp" } }, $rename: { "name": "hero_name", "true_name": "full_name" }, $set: { "power": 100 } });

//? Exercício 16: Produza uma query onde os mutantes class omega ou gama passam a ter seu poder de 500 somente se seu poder for menor que 500.

db.xmen.updateMany({"class": { $in: ["omega", "gama"] } }, {  $currentDate: { lastUpdate: { $type: "timestamp" } }, $max: {"power": 500} });

//? Exercício 17: Produza uma query onde os mutantes class gama passam a ter seu poder de 300 somente se seu poder for maior que 300.

db.xmen.updateMany({"class": "gama" }, {  $currentDate: { lastUpdate: { $type: "timestamp" } }, $min: {"power": 300} });

//? Exercício 18: Decremente em 100 o poder dos mutantes que não possuem a propriedade class.

db.xmen.updateMany({"class": {$exists: false}}, {  $currentDate: { lastUpdate: { $type: "timestamp" } }, $inc: {"power": -100}});

//? Exercício 19: Em apenas uma query adicione o campo areas com o seguinte array como valor: ["Students Room"] a todos os mutantes que são Senior Staff que tenham poder acima de 100 e para todos os Junior Staff com poder acima de 200.

db.xmen.updateMany({ $or: [{"occupation": "Senior Staff", "power": {$gt: 100}}, {"occupation": "Junior Staff", "power": {$gt: 200}}]}, { $currentDate: { lastUpdate: { $type: "timestamp" } }, $set: {"areas": ["Students Room"]}});

//? Exercício 20: Em apenas uma query, adicione o campo areas com ["Outside"] a todos os Junior Staff que não tenham o campo areas definido.

db.xmen.updateMany({"occupation": "Junior Staff", areas: { $exists: false }}, { $currentDate: { lastUpdate: { $type: "timestamp" } }, $set: {"areas": ["Outside"]} });
