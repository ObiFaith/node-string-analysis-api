import crypto from "crypto";
import mongoose, { Schema } from "mongoose";

const StringSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    unique: true,
    required: [true, "String value is required!"],
  },
  properties: {
    length: Number,
    is_palindrome: Boolean,
    // unique_characters: Number,
    word_count: Number,
    sha256_hash: String, // TODO
    // character_frequency_map: Object,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

StringSchema.pre("validate", async function () {
  this._id = crypto.createHash("sha256").update(this.value).digest("hex");
});

StringSchema.pre("save", async function () {
  this.properties = {
    length: this.value.length,
    is_palindrome: this.value === this.value.split("").reverse().join(""),
    word_count: this.value.split(" ").length,
    sha256_hash: this._id,
  };
});

StringSchema.methods.characterFrequencyMap = function async() {};

StringSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const StringModel = mongoose.model("String", StringSchema);
export default StringModel;
