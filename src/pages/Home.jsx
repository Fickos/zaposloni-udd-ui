import { useState } from "react";
import AsyncSelect from "../components/AsyncSelect";
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import Avatar from "../assets/avatar.jpg";
import axios from "axios";
import Map from "../components/Map";
import Switch from '@material-ui/core';

const fields = [
    { name: 'name', label: 'First Name' },
    { name: 'surname', label: 'Last Name' },
  ];
  
const initialQuery = {
    combinator: 'and',
    rules: [
        { field: 'firstName', operator: 'beginsWith', value: 'Filip' },
        { field: 'lastName', operator: 'in', value: 'Volaric' },
    ],
};

export default function Home() {

    const [query, setQuery] = useState(initialQuery);

    const handleSearchClick = async () => {
        console.log(formatQuery(query));
        const res = await axios.get('http://localhost:3001/');
        console.log(res);
    }
    
    return (
        <div className="home">
            <div className="search-section">
                <div className="row">
                    <AsyncSelect />
                    <button className="search-btn" onClick={handleSearchClick}>Search</button>
                    <Switch></Switch>
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
                        placeholder="Search for content from CV" />
                    
                    <textarea
                        className="text-area"
                        placeholder="Search for content from Cover letter" />   
                </div>
                <div className="row"> 
                </div>
            </div>
            <div className="content">
                <div className="result-list">
                     <div className="card">
                        <img src={Avatar} alt="avatar" style={{width: "80px", height: "80px", borderRadius: "50%" }}/>
                        <div className="full-name">Filip Volaric</div>
                        <div className="address">Nikole tesle Ruma</div>
                        <div className="email">filip.kresa@gmail.com</div>
                        <div className="education">FTN - dipl ing.</div>
                     </div>
                </div>
                <div className="map-view">
                    <Map />
                </div>
            </div>
        </div>
    )
}
