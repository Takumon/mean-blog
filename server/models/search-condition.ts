import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';
import '../connection';

const SearchConditoinSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: { type: String },
  users:  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dateSearchPattern: { type: String },
  dateFrom: { type: Date },
  dateTo: { type: Date },
});

const SearchCondition = mongoose.model('SearchCondition', SearchConditoinSchema);

export { SearchCondition };
