import { useState } from "react";
import AsyncSelect from "../components/AsyncSelect";
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import axios from "axios";

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
            <div className="search-bar">
                <AsyncSelect />
                <button className="search-btn" onClick={handleSearchClick}>Search</button>
                <QueryBuilder
                    fields={fields}
                    query={query}
                    onQueryChange={q => setQuery(q)}
                />
                <textarea
                    placeholder="Search for content from CV" />
                
                <textarea
                    placeholder="Search for content from Cover letter" />    
            </div>
            <div className="content container">
                <div className="result-list">
                     
                </div>
                <div className="map-view">

                </div>
            </div>
        </div>
    )
}
