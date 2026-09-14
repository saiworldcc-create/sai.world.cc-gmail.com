const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb+srv://saiworldcc_db_user:kujdG3NDwitxCFmV@cluster0.xatyxzv.mongodb.net/?appName=Cluster0');
  const doc = await mongoose.connection.db.collection('pagecontents').findOne({ pageId: 'services' });
  console.log(JSON.stringify(doc.content.servicesList, null, 2));
  process.exit(0);
}

check();
