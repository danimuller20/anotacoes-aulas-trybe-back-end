const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');

const MoviesModel = require('../../models/movieModel');

describe('Insere um novo filme no BD', () => {
  const payloadMovie = {
     title: 'Example Movie',
     directedBy: 'Jane Dow',
     releaseYear: 1999,
  };

      before(() => {
        const ID_EXAMPLE = '604cb554311d68f491ba5781';
        const connectionMock = {
          db: async () => ({
            collection: async () => ({
              insertOne: async () => ({
                insertedId: ID_EXAMPLE,
              })
            })
          })
        };

        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      });

      // Restauraremos a função `connect` original após os testes.
      after(() => {
        MongoClient.connect.restore();
      });

   describe('quando é inserido com sucesso', async () => {

     it('retorna um objeto', async () => {
       const response = await MoviesModel.create(payloadMovie);

       expect(response).to.be.a('object');
     });

     it('tal objeto possui o "id" do novo filme inserido', async () => {
       const response = await MoviesModel.create(payloadMovie);

       expect(response).to.have.a.property('id');
     });

   });

});