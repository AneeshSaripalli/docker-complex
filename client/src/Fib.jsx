import React, { useState, useEffect } from 'react';
import axios from 'axios'

export default () => {
    const [seenIndexes, setSeenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');



    useEffect(() => {
        const fetchValues = async () => {
            const { data } = await axios.get("/api/values/current")
            setValues(data);
        }

        const fetchIndexes = async () => {
            const { data } = await axios.get('/api/values/all');
            setSeenIndexes(data);
        }

        fetchValues();
        fetchIndexes();
    }, []);

    const renderSIS = () => {
        return seenIndexes.map(({ number }) => number).join(", ");
    }
    const renderValues = () => {
        const entries = [];
        for (let key in values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            )
        }

        return entries;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index
        });

        setIndex('')
    }

    return (
        <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '50%' }}>
            <form onSubmit={handleSubmit}>
                <label>Enter your index</label>
                <input value={index} onChange={event => setIndex(event.target.value)} />
                <button>Submit</button>
            </form>
            <h3>
                Indexes I've seen
             {renderSIS()}
            </h3>
            <h3>
                Calculated values:
             {renderValues()}
            </h3>
        </div>)
}