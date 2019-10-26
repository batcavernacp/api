import mongoose from 'mongoose'
import models from './mongoose'
mongoose.set('debug', "true");
models(mongoose)

mongoose
  .connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .catch(err => console.log(err))

export default mongoose.connection
