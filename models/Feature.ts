import mongoose from "mongoose";
import "./Product"

const schema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const model = mongoose.models?.Feature || mongoose.model("Feature", schema);

export default model;
