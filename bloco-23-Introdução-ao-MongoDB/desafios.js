//* Desafios com operadores de comparação
//? 1 - Selecione e faça a contagem dos restaurantes presentes nos bairros (campo borough ) Queens , Staten Island e Bronx .
db.restaurants.find({ borough: { $in: [ 'Queens' , 'Staten Island', 'Bronx' ] } }).count()

//? 2 - Selecione e faça a contagem dos restaurantes que não possuem culinária (campo cuisine ) do tipo American.
db.restaurants.find({ cuisine: { $ne: "American" } }).count();

//? 3 - Selecione e faça a contagem dos restaurantes que possuem avaliação (campo rating ) maior ou igual a 8.
db.restaurants.find({rating: {$gte: 8 }}).count()

//? 4 - Selecione e faça a contagem dos restaurantes que possuem avaliação menor que 4.
db.restaurants.find({ rating: { $lt: 4 } }).count();

//? 5 - Selecione e faça a contagem dos restaurantes que não possuem as avaliações 5 , 6 e 7.
db.restaurants.find({ rating: { $nin: [5, 6, 7] } }).count();

//* Desafios com operadores lógicos

//? 1 - Selecione e faça a contagem dos restaurantes que não possuem avaliação menor ou igual a 5 , essa query também deve retornar restaurantes que não possuem o campo avaliação.
db.restaurants.find({ rating: { $not: { $lte: 5 } }}).count();

//? 2 - Selecione e faça a contagem dos restaurante em que a avaliação seja maior ou igual a 6 , ou restaurantes localizados no bairro Brooklyn.
db.restaurants.find({ $or: [{ rating: { $gte: 6 } }, { borough: "Brooklyn" }] }).count();

//? 3 - Selecione e faça a contagem dos restaurantes localizados nos bairros Queens , Staten Island e Broklyn e possuem avaliação maior que 4.
db.restaurants.find({
  and: [
        { borough: { $in: ['Queens', 'Staten Island', 'Brooklyn'] } },
        { rating: { $gt: 4 } },
      ],
    }).count();

//? 4 - Selecione e faça a contagem dos restaurantes onde nem o campo avaliação seja igual a 1 , nem o campo culinária seja do tipo American.
db.restaurants.find({ $nor: [{ rating: { $eq: 1 } }, { cuisine: "American" }] }).count();

//? 5 - Selecione e faça a contagem dos resturantes em que a avaliação seja maior que 6 ou menor que 10 , e esteja localizado no bairro Brooklyn ou não possuem culinária do tipo Delicatessen.
db.restaurants.find({
  $and: [
    { $or: [{ rating: { $gte: 6, $lt: 10} }] },
    {$or: [{ borough: 'Brooklyn' },  { cuisine: { $ne: 'Delicatessen' } }] }
  ]}).count()

  //* Desafios com método sort()

  //? 1 - Ordene alfabeticamente os restaurantes pelo nome (campo name ).
  db.restaurants.find().sort({name: 1})

  //? 2 Ordene os restaurantes de forma descrescente baseado nas avaliações.-
  db.restaurants.find().sort({rating: -1})

  //* Desafio removendo documentos

  //? 1 - Remova o primeiro restaurante que possua culinária do tipo Ice Cream, Gelato, Yogurt, Ices.
  db.restaurants.deleteOne({cuisine: 'Ice Cream, Gelato, Yogurt, Ices'})

  //? 2 - Remova todos os restaurantes que possuem culinária do tipo American.
  db.restaurants.deleteMany({cuisine: 'American'})