import { useState } from "react";
import axios from "axios";

export default function Upload (props) {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [education, setEducation] = useState('');
    const [street, setStreet] = useState('');
    const [municipality, setMunicipality] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [cv, setCv] = useState(null);
    const [coverLetter, setCoverLetter] = useState(null);

    const handleUpload = async () => {
        const formData = new FormData();
        const jsonData = {
            name: name,
            surname: surname,
            education: education,
            address: `${street} ${municipality} ${city} ${country}`,
            city: city
        };

        formData.append('cv', cv);
        formData.append('coverLetter', coverLetter);
        formData.append('jsonData', JSON.stringify(jsonData));

        try {
            console.log(formData);
            const response = await axios.post('http://localhost:3001/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                alert('Successfully created job application!');
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column'}}>
            <a style={{ position : "absolute", top: '10px', left: '20px'}} href="/">Back</a>
            <h2>Upload your Job application</h2>
            <div className="upload-form">
                <div className="upload-row">
                    <div className="upload-group">
                        <label htmlFor="name">Name</label>
                        <input id="name" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="upload-group">
                        <label htmlFor="surname">Surname</label>
                        <input id="surname" onChange={(e) => setSurname(e.target.value)} />
                    </div>
                </div>
                <div className="upload-row">
                    <div className="upload-group">
                        <label>Education</label>
                        <select onChange={(e) => setEducation(e.target.value)} className="education-select">
                            <option>One</option>
                            <option>Two</option>
                            <option>Three</option>
                            <option>Four</option>
                            <option>Five</option>
                        </select>
                    </div>
                </div>
                <h3>Address</h3>
                <div className="upload-row">
                    <div className="upload-group">
                        <label htmlFor="street">Street</label>
                        <input id="street" onChange={(e) => setStreet(e.target.value)} />
                    </div>
                    <div className="upload-group">
                        <label htmlFor="municipality">Municipality</label>
                        <input id="municipality" onChange={(e) => setMunicipality(e.target.value)} />
                    </div>
                </div>
                <div className="upload-row">
                    <div className="upload-group">
                        <label htmlFor="city">City</label>
                        <input id="city" onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="upload-group">
                        <label htmlFor="country">Country</label>
                        <input id="country" onChange={(e) => setCountry(e.target.value)} />
                    </div>
                </div>
                <div className="upload-row">
                    <div className="upload-group">
                        <label htmlFor="cv">CV: </label>
                        <input id="cv" type="file" onChange={(e) => setCv(e.target.files[0])} />
                    </div>
                    <div className="upload-group">
                        <label htmlFor="coverLetter">Cover letter: </label>
                        <input id="coverLetter" type="file" onChange={(e) => setCoverLetter(e.target.files[0])} />
                    </div>
                </div>
                <button className="upload-btn" onClick={handleUpload}>Upload</button>
            </div>
        </div>
    )
}