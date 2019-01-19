const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  email: { type: String, required: true},
  preguntas: [{type: Schema.ObjectId, ref: "Pregunta"}],
  respuestas: [{type: Schema.ObjectId, ref: "Respuesta"}],
  tags: [{type: Schema.ObjectId, ref: "Tag"}],
  googleID: String
},{
  timestamps:{
    createdAt:"created_at", updatedAt: "updated_at"
  }
})

const User = mongoose.model("User", userSchema);
module.exports=User;
