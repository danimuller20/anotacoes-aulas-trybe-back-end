db.clients.aggregate([
   { $lookup: {
     from: "transactions",
     let: { client_to: "$to", client_from: "$from" }, pipeline: [
       { $match: {
         $expr: {
           $eq: ["$&client_to", "$$client_from"] } 
          } }, 
           { $project: { _id: 0, from: 1 } }
      ], as: "transactions_ok" } }
]);