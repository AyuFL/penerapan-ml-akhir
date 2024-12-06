const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
 
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const label = confidenceScore > 50? 'Cancer' : 'Non-cancer';
 
        if(label === 'Cancer') {
            suggestion = "Segera periksa ke dokter!"
        }
 
        if(label === 'Non-cancer') {
            suggestion = "Penyakit kanker tidak terdeteksi."
        }
 
        return { confidenceScore, label, suggestion };
        
    } catch (error) {
        throw new InputError(`Error in prediction: ${error.message}`)
    }
}
 
module.exports = predictClassification;