const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
const { MongoClient } = require('mongodb');
const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();


const app = express();
app.use(cors()); 
app.use(express.json());
app.use(express.static('images'));
app.use(fileUpload());
app.use(bodyParser.json());

app.get('/',(req,res) =>{
  res.send('yeah')
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.19hsm.mongodb.net/mydatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err);
  // const collection = client.db("mydatabase").collection("test");
  const serviceCollection = client.db("mydatabase").collection("services");
  const reviewCollection = client.db("mydatabase").collection("reviews");
  const adminCollection = client.db("mydatabase").collection("admin");
  const orderCollection = client.db("mydatabase").collection("order");
  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const location = req.body.location;
    const packageDuration = req.body.packageDuration;
    const price = req.body.price;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

    serviceCollection.insertOne({ title, location, packageDuration, price, image })
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })
  app.get('/services', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
        // console.log(documents)
    })
  });
  app.post('/reviews', (req, res) => {
    reviewCollection.insertOne(req.body)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })
  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  });
  app.post('/makeAdmin', (req, res) => {
    adminCollection.insertOne(req.body)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })
  app.get('/adminEmail', (req,res) => {
    adminCollection.find({adminEmail: req.query.email})
    .toArray((err,documents) => {
      res.send(documents.length>0);
    })
  })
  app.post('/ordered', (req, res) => {
    orderCollection.insertOne(req.body)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })
  app.get('/orderedList', (req, res) => {
    orderCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
        // console.log(documents[0])
    })
  })
  app.get('/orderedD', (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
        res.send(documents);
        console.log(documents)
    })
  })
  app.get('/ordered/:productKey', (req, res) => {
    serviceCollection.find({_id : ObjectId(req.params.productKey)})
    .toArray((err, documents) => {
        res.send(documents[0]);
        // console.log(documents[0])
    })
  })
  app.get('/servicelist', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
        // console.log(documents)
    })
  })
  app.patch('/update/:id', (req,res) => {
    console.log(req.body)
    orderCollection.updateOne({_id:ObjectId(req.params.id)},{ $set: { status : req.body.status, class: req.body.class } })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })
  app.delete('/delete/:id',(req,res) => {
    serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0)
    })
  })
  console.log('Database Connected Successfully')
  // perform actions on the collection object
  
  // client.close();
});

// const uri = "mongodb+srv://Admin8989:22892289umajolie@cluster0.stikv.mongodb.net/travelmanagement?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
// //   const serviceCollection = client.db("travelmanagement").collection("services");
// //   const reviewCollection = client.db("travelmanagement").collection("reviews");
// //   const adminCollection = client.db("travelmanagement").collection("admin");
// //   const orderCollection = client.db("travelmanagement").collection("order");
// //   app.post('/addService', (req, res) => {
// //     const file = req.files.file;
// //     const title = req.body.title;
// //     const description = req.body.description;
// //     const price = req.body.price;
// //     const newImg = file.data;
// //     const encImg = newImg.toString('base64');

// //     var image = {
// //         contentType: file.mimetype,
// //         size: file.size,
// //         img: Buffer.from(encImg, 'base64')
// //     };

// //     serviceCollection.insertOne({ title, description, price, image })
// //     .then(result => {
// //         res.send(result.insertedCount > 0);
// //     })
// //   })
// //   app.get('/services', (req, res) => {
// //     serviceCollection.find({})
// //     .toArray((err, documents) => {
// //         res.send(documents);
// //         console.log(documents)
// //     })
// //   });
// //   app.post('/reviews', (req, res) => {
// //     reviewCollection.insertOne(req.body)
// //     .then(result => {
// //         res.send(result.insertedCount > 0);
// //     })
// //   })
// //   app.get('/reviews', (req, res) => {
// //     reviewCollection.find({})
// //     .toArray((err, documents) => {
// //         res.send(documents);
// //     })
// //   });
// //   app.post('/makeAdmin', (req, res) => {
// //     adminCollection.insertOne(req.body)
// //     .then(result => {
// //         res.send(result.insertedCount > 0);
// //     })
// //   })
// //   app.post('/ordered', (req, res) => {
// //     orderCollection.insertOne(req.body)
// //     .then(result => {
// //         res.send(result.insertedCount > 0);
// //     })
// //   })
// //   app.get('/ordered', (req, res) => {
// //     orderCollection.find({})
// //     .toArray((err, documents) => {
// //         res.send(documents);
// //         // console.log(documents[0])
// //     })
// //   })
// //   app.get('/ordered/:productKey', (req, res) => {
// //     serviceCollection.find({_id : ObjectId(req.params.productKey)})
// //     .toArray((err, documents) => {
// //         res.send(documents[0]);
// //         console.log(documents[0])
// //     })
// //   })
// //   app.get('/servicelist', (req, res) => {
// //     serviceCollection.find({})
// //     .toArray((err, documents) => {
// //         res.send(documents);
// //         console.log(documents)
// //     })
// //   })
// //   app.patch('/update/:id', (req,res) => {
// //     orderCollection.updateOne({_id:ObjectId(req.params.id)}), {
// //       $set: {status : req.body.status}
// //     }
// //     console.log(req.body)
// //   })
// //   app.delete('/delete/:id',(req,res) => {
// //     serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
// //     .then( result => {
// //       res.send(result.deletedCount > 0)
// //     })
// //   })
//   console.log('connected')
//   const dbcol = client.db("travelmanagement").collection("services");
  
// });



app.listen(process.env.PORT || 5000, () => console.log('this is another side of the world'));