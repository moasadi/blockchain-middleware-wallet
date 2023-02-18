const mongoose = require('mongoose')
module.exports.connect =async () => {
  try {
   const mongoUrl=process.env.DB_ADDRESS
   const mongoName=process.env.DB_NAME

   const mongoUsername=process.env.DB_USER
   const mongoPassword=process.env.DB_PASS
   let url=''
   if(mongoUsername&&mongoPassword){
    url =`mongodb://${mongoUsername}:${mongoPassword}@${mongoUrl}:27017/${mongoName}?authSource=admin`
   }else{
    url =`mongodb://${mongoUrl}/${mongoName}`

   }

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Now connected to MongoDB!')
  } catch (error) {
    console.log(error)
  }

}
