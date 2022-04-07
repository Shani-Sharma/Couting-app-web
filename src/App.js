import React,{Component} from 'react';
import './App.css';
import Amplify, {Analytics, AWSKinesisFirehoseProvider } from 'aws-amplify';
import Config from './aws-exports'
import { FaPlusCircle } from "react-icons/fa";


/*
const timestamp = Date.now(); // This would be the timestamp you want to format
console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp));
*/

Amplify.configure({
  Auth: {
    identityPoolId: Config.aws_cognito_identity_pool_id,
    region: Config.aws_project_region
  },
  Analytics: {
    AWSKinesisFirehose: {
    region: Config.aws_project_region
    }
  }
});

Analytics.addPluggable(new AWSKinesisFirehoseProvider());


/*
 for loop use for humidity data change i=8,i==



*/

class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			languages : [
		/*			{name: "Humidity", votes: 80},
			{name: "Temp", votes: 0},
				{name: "Vibration", votes: 0}  */

			/*	{name: "Vibration", votes: 0},
				{name: "Sensor", votes: 0},
				{name: "Humidity", votes: 0},*/
				{name: "Temperature", votes: 0}
			/*	{name: "Noise", votes: 0},
				{name: "other15", votes: 0},
				{name: "other16", votes: 0}*/

				
			]
		}
	}

	vote (i) {
		let newLanguages = [...this.state.languages];
		newLanguages[i].votes++;
		function swap(array, i, j) {
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		this.setState({languages: newLanguages});
		
    const now = new Date();


/*	const timestamp = Date.now();

	console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp));
*/
    let data = {
      id: now.getTime(),
      language: newLanguages[i].name
    }

    Analytics.record({
      data: data,
      streamName: Config.aws_firehose_name
    }, 'AWSKinesisFirehose');
}

	render(){
		return(
			<>
				<h1>Hello</h1>
				<div className="languages">
					{
						this.state.languages.map((lang, i) => 
							<div key={i} className="language">
								<div className="voteCount">
									{lang.votes}
								</div>

							<div className='TimeStamp'>

							</div>

								<div className="languageName">
									{lang.name}
								</div>
								<button onClick={this.vote.bind(this, i)}><FaPlusCircle/></button>
							</div>
						)
					}
				</div>
			</>
		);
	}
}
export default App;