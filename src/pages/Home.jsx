import { useEffect, useState } from "react";
// import AsyncSelect from "../components/AsyncSelect";
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import Avatar from "../assets/avatar.jpg";
import axios from "axios";
import Map from "../components/Map";
import ReactGoogleAutocomplete from "react-google-autocomplete";
// import Switch from '@material-ui/core';

const fields = [
    { name: 'name', label: 'First Name' },
    { name: 'surname', label: 'Last Name' },
    { name: 'education', label: 'Education' },
    { name: 'content', label: 'Content from CV' },
    { name: 'coverLetterContent', label: 'Content from cover letter' }
  ];
  
const initialQuery = {
    combinator: 'and',
    rules: [
    ],
};

export default function Home() {

    const [query, setQuery] = useState(initialQuery);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [geoCoordinates, setGeoCoordinates] = useState(null);
    const [radius, setRadius] = useState(2);
    const [phrase, setPhrase] = useState(false);

    const [cvContent, setCvContent] = useState('');
    const [clContent, setClContent] = useState('');

    const [results, setResults] = useState(null);

    const handleSearchClick = async () => {
        if (phrase) {
            const res = await axios.post('http://localhost:3001/phrase', {

            });
            setResults(res);
            return;
        }
        if (geoCoordinates) {
            console.log('EXECUTING GEO SEARCH');
            const res = await axios.post('http://localhost:3001/geo-search', {
                ...geoCoordinates, radius: radius
            });
            console.log('RETURN VALUE FROM GEO SEARCH', res.data);
            setResults(res.data);
            return;
        } else if (query.rules.length >= 2) {
            console.log(formatQuery(query));
            const res = await axios.post('http://localhost:3001/boolean-search', {
                query: query
            })
            console.log('RETURN VALUE FROM BOOLEAN SEARCH', res.data)
            setResults(res.data);
            return;
        } else {
            if (cvContent) {
                const res = await axios.post('http://localhost:3001/search', { cvContent: cvContent });
                console.log('RETURN VALUE FROM REGULAR SEARCH (SINGLE FIELD - CV)\n', res.data);
                setResults(res.data);
            } else if (clContent) {
                const res = await axios.post('http://localhost:3001/search', { coverLetterContent: clContent });
                console.log('RETURN VALUE FROM REGULAR SEARCH (SINGLE FIELD-COVERLETTER)\n', res.data);
                setResults(res.data);
            } else if (query?.rules?.[0]?.field === 'name') {
                const res = await axios.post('http://localhost:3001/search', { name: query?.rules?.[0]?.value });
                console.log('RETURN VALUE FROM REGULAR SEARCH (SINGLE FIELD-NAME)\n', res.data);
                setResults(res.data);
            } else if (query?.rules?.[0]?.field === 'surname') {
                const res = await axios.post('http://localhost:3001/search', { surname: query?.rules?.[0]?.value });
                console.log('RETURN VALUE FROM REGULAR SEARCH (SINGLE FIELD-SURNAME)\n', res.data);
                setResults(res.data);
            } else if (query?.rules?.[0]?.field === 'education') {
                const res = await axios.post('http://localhost:3001/search', { education: query?.rules?.[0]?.value });
                console.log('RETURN VALUE FROM REGULAR SEARCH (SINGLE FIELD-EDUCATION)\n', res.data);
                setResults(res.data);
            }
            // const res = await axios.post('http://localhost:3001/search', {
                
            // });
            // setResults(res.data);
        }
        // const res = await axios.get('http://localhost:3001/');
        // console.log(res);
    }

    const handleSelect = (place) => {
        setGeoCoordinates({lat: place?.geometry?.location?.lat(), lon: place?.geometry?.location?.lng()});
    }

    const displayHeader = () => {
        if (!results) {
            return <h2>Please execute search</h2>
        } else if (results.hits?.total?.value === 0) {
            return <h2>No results to display</h2>
        } else {
            return <h2>Displaying {results?.hits?.total?.value} results</h2>
        }
    }

    useEffect(() => {
        if (results && results?.hits?.hits?.length) {
            let cnt = 0;
            for (let hit of results?.hits?.hits) {
                const el = document.getElementById(`${cnt}-hlc`);
                if (el) {
                    el.innerHTML = hit?.highlight?.content;
                }
                cnt++;
            }
        }
    }, [results]);
    
    return (
        <div className="home">
            <div className="search-section">
                <div className="row">
                    { googleLoaded && <ReactGoogleAutocomplete 
                        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                        onPlaceSelected={handleSelect}
                    />}
                    {/* <AsyncSelect /> */}
                    <button className="search-btn" onClick={handleSearchClick}>Search</button>
                    {
                        geoCoordinates && 
                        <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} min="1" className="number-input"/>
                    }
                    {
                        geoCoordinates && 
                        <button className="clear-btn" onClick={() => {setGeoCoordinates(null); setRadius(2);} }>
                            Clear
                        </button>
                    }
                    {/* <Switch></Switch> */}
                </div>
                <div className="row">
                    <QueryBuilder
                        fields={fields}
                        query={query}
                        onQueryChange={q => setQuery(q)}
                    />
                    <div className="vr"></div>
                    <textarea
                        className="text-area"
                        placeholder="Search for content from CV" 
                        onChange={(e) => setCvContent(e.target.value)}/>
                    
                    <textarea
                        className="text-area"
                        placeholder="Search for content from Cover letter" 
                        onChange={(e) => setClContent(e.target.value)}/>   
                </div>
                <div className="row"> 
                </div>
            </div>
            {displayHeader()}
            {/* {results && <h2>Displaying {results?.hits?.total?.value} results</h2>} */}
            <div className="content">
                <div className="result-list">
                    {
                        results?.hits?.hits?.map((result, i) => (
                            <div className="card" key={i}>
                                <img src={Avatar} alt="avatar" style={{width: "80px", height: "80px", borderRadius: "50%" }}/>
                                <div className="full-name">{result?._source?.name} {result?._source?.surname}</div>
                                <div className="address">{result?._source?.address}</div>
                                {/* <div className="email">filip.kresa@gmail.com</div> */}
                                <div className="education">{result?._source?.education}</div>
                                <div className="cv-content" id={`${i}-hlc`}></div>
                            </div>
                        ))
                    }
                </div>
                <div className="map-view">
                    <Map 
                        setGoogleLoaded={setGoogleLoaded} 
                        navigatorLocation={geoCoordinates ? {lat: geoCoordinates.lat, lng: geoCoordinates.lon} : null} 
                        searchRadius={radius ? radius * 1000 : null} 
                        pins={results?.hits?.hits.map((el) => (
                            { lat: el?._source?.location?.lat , lng: el?._source?.location?.lon }
                        )) ?? []}
                    />
                </div>
            </div>
        </div>
    )
}
