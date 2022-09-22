
import Head from 'next/head'
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from 'react';



function HomePage(props) {

	return(
		<Fragment>
			<Head>
				<title>React Meetups</title>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	)
}

// Alternative to getStaticProps
// Runs for every incoming request
/* export async function getServerSideProps(context) {
	const req = context.req;
	const res = context.res;
	return {
		props: {
			meetups: DUMMY_MEETUPS
		}
	}
}; */

export async function getStaticProps() {
	MongoClient.connect();
	const client = await MongoClient.connect('mongodb+srv://GuilhermeMartins:u4TxVuajIHGCHhBG@cluster0.nkwtyuw.mongodb.net/meetupsDB?retryWrites=true&w=majority');

	const meetupsDB = client.db();

	const meetupsCollection = meetupsDB.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map(meetup => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString()
			}))
		},
		// unlocks incremental static generation
		// used in websites that has a lot of requests
		// regenerates data after every n seconds defined below
		// (if there are requests for data)
		revalidate: 10 }
}

export default HomePage;