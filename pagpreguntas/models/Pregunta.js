const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const preguntaSchema = new Schema({
  pregunta: { type: String, required: true},
  tag: {{type: Schema.ObjectId, ref: "Interes"}},
  respuestas: [{type: Schema.ObjectId, ref: "Respuesta"}]
},{
  timestamps:{
    createdAt:"created_at", updatedAt: "updated_at"
  }
})

const User = mongoose.model("Pregunta", preguntaSchema);
module.exports=Pregunta;
