import * as mongoose from 'mongoose';

const Message = mongoose.model('messages', new mongoose.Schema({
  message: {type: String}
}));

export { Message };
