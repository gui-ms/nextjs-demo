import { MongoClient } from "mongodb";

async function handler(req, res) {
	if (req.method === 'POST') {
		const data = req.body;

		
		const client = await MongoClient.connect('mongodb+srv://GuilhermeMartins:u4TxVuajIHGCHhBG@cluster0.nkwtyuw.mongodb.net/meetupsDB?retryWrites=true&w=majority');

		const meetupsDB = client.db();

		const meetupsCollection = meetupsDB.collection('meetups');

		const result = await meetupsCollection.insertOne(data);


		client.close();

		res.status(201).json({message:'Meetup inserted!'})
	}
};

export default handler;