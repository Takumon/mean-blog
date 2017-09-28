import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';
import '../connection';

const SearchConditoinSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  users:  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dateFrom: { type: Date },
  dateTo: { type: Date },
  priority: Number,
});

const SearchCondition = mongoose.model('SearchCondition', SearchConditoinSchema);

export { SearchCondition };
