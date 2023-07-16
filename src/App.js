import './App.css'; 
import { useState } from "react";
// const axios = require('axios');
import axios from 'axios' 


function App() {
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
        'X-RapidAPI-Key': process.env.REACT_APP_VIDEOS_API_KEY,
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
