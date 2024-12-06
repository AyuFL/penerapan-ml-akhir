const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "createdAt": createdAt
  }

  await storeData(id, data);
 
  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data
  })
  response.code(201);
  return response;
}

async function getHistoryPredicthandler (request, h) {
  const getData = await firestore.collection('predictions').get();

  const data = getData.docs.map((doc) => {
    return {
      id: doc.id,
      history: doc.data()
    };
  })

  if (!data){
    const response = h.response({
      status: 'fail',
      message: 'There are no predictions data yet!'
    })
    response.code(400);
    return response;
  };

  const response = h.response({
    status: 'success',
    data
  })
  response.code(200);
  return response;
}
 
module.exports = { postPredictHandler, getHistoryPredicthandler };