const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const respuestaSchema = new Schema({
  respuesta: { type: String, required: true},
  votos: { type: Number}
},{
  timestamps:{
    createdAt:"created_at", updatedAt: "updated_at"
  }
})

const Respuesta = mongoose.model("Respuesta", preguntaSchema);
module.exports=Respuesta;
