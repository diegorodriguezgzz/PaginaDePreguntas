const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const interesSchema = new Schema({
  tag: { type: String }
},{
  timestamps:{
    createdAt:"created_at", updatedAt: "updated_at"
  }
})

const Interes = mongoose.model("Interes", interesSchema);
module.exports=Interes;
