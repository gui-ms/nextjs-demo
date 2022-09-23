
import Head from 'next/head'
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from 'react';



function HomePage(props) {

	return(
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta
					name='description'
					content='Browse a list of react meetups'
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	)
}


export async function getStaticProps() {
	
	const client = await MongoClient.connect('mongodb+srv://GuilhermeMartins:u4TxVuajIHGCHhBG@cluster0.nkwtyuw.mongodb.net/meetupsDB?retryWrites=true&w=majority');

	const meetupsDB = client.db();

	const meetupsCollection = meetupsDB.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString()
			}))
		},
		revalidate: 1 }
}

export default HomePage;