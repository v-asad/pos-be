import mongoose, { Document, Schema } from 'mongoose';

export interface IGameSession extends Document {
  game: mongoose.Schema.Types.ObjectId;
  customer: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  endTime?: Date; // Optional, as a session might be ongoing
  cost?: number; // Optional, will be calculated on checkout
}

const gameSessionSchema: Schema = new Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'BarGame', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  cost: { type: Number }
}, { timestamps: true });

const GameSession = mongoose.model<IGameSession>('GameSession', gameSessionSchema);

export default GameSession;