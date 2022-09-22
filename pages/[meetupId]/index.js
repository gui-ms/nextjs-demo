import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";
import Head from "next/head";


function MeetupDetails(props) { 

	return(
	<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta
					name='description'
					content={props.meetupData.description}
				/>
			</Head>
			<MeetupDetail
		image={props.meetupData.image}
		address={props.meetupData.address}
		title={props.meetupData.title}
		description={props.meetupData.description}
	/>
	</Fragment>)
	
}

export async function getStaticPaths() {
	MongoClient.connect();
	const client = await MongoClient.connect('mongodb+srv://GuilhermeMartins:u4TxVuajIHGCHhBG@cluster0.nkwtyuw.mongodb.net/meetupsDB?retryWrites=true&w=majority');

	const meetupsDB = client.db();

	const meetupsCollection = meetupsDB.collection('meetups');

	const meetups = await meetupsCollection.find({},{_id: 1}).toArray();

	client.close();

	return {
		fallback:false,
		paths: meetups.map(meetup => ({
			params: { meetupId: meetup._id.toString() }
		})),
		
	}
}

export async function getStaticProps(context) {
	const meetupId = context.params.meetupId;

	MongoClient.connect();
	const client = await MongoClient.connect('mongodb+srv://GuilhermeMartins:u4TxVuajIHGCHhBG@cluster0.nkwtyuw.mongodb.net/meetupsDB?retryWrites=true&w=majority');

	const meetupsDB = client.db();

	const meetupsCollection = meetupsDB.collection('meetups');

	const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)});

	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				description: selectedMeetup.description,
				image: selectedMeetup.image,
				address: selectedMeetup.address
			}
		},
		// unlocks incremental static generation
		// used in websites that has a lot of requests
		// regenerates data after every n seconds defined below
		// (if there are requests for data)
		revalidate: 10 }
}

export default MeetupDetails;