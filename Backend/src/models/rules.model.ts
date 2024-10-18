import mongoose, { Schema, Document } from "mongoose";

interface IRule extends Document {
  ruleName: string;
  ast: string;
}

const RuleSchema: Schema = new Schema({
  ruleName: { type: String, required: true },
  ast: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IRule>('Rule', RuleSchema);
