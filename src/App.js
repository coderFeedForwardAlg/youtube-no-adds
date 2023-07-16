import './App.css'; 
import { useState } from "react";
// const axios = require('axios');
import axios from 'axios' 
// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";


function App() {
  // for secrets 
  
  const secret_name = "videos-key";

  const client = new SecretsManagerClient({
    region: "us-east-2",
  });

  let response;
  const getSecret = async () =>{
    try {
      response = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
      );
    } catch (error) {
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
    }
  }
  getSecret();
  

  const secret = response.SecretString;



  const [search, setSearch] = useState("");
  const [video, setVideo] = useState(<></>);

  const [videos, setVideos] = useState([]);

  let ids;
  let titles
  const getSearch = async (event) =>{
    event.preventDefault();
    const options = {
      method: 'GET',
      url: 'https://youtube-v31.p.rapidapi.com/search',
      params: {
        q: search,
        part: 'snippet,id',
        regionCode: 'US',
        maxResults: '30',
        order: 'date'
      },
      headers: {
        //TODO: hide api key !!!! 
        'X-RapidAPI-Key': secret,
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data)
      
      let temp = response.data.items
      titles = temp.map(getTitles);
      ids = temp.map(getIds)
      
      setVideos(titles);
      
    } catch (error) {
      console.error(error);
    }
  }
  let titelsArr = [];
  const getTitles = (item) =>{
    titelsArr.push(item.snippet.title);
    return <p> <button onClick={ () => {playVideo(item.snippet.title)}}> {item.snippet.title}  </button> <br/> </p>;
  }
  const getIds = (item) =>{
    return item.id.videoId;
  }

  const playVideo = (title) =>{
    console.log("button presed")
    let sorce = "https://www.youtube.com/embed/" + ids[titelsArr.indexOf(title) ]
    console.log(ids[titelsArr.indexOf(title) ])
    setVideo(<iframe className="video"
        src = {sorce}>
      </iframe>) 
  }
  return (
    <div>
      <form onSubmit={getSearch}>
        <input placeholder="music" onChange={(e)=>{
                      setSearch(e.target.value);
        }}/>
      </form>
      
      

      {videos}
      <br/>
      {video}
    </div>
  );
}

export default App;
