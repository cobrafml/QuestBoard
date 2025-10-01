import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const CsvTable = () => {
const [rows, setRows] = useState([]);
// rows holding array for the csv information setRows adds the lines to the array

// Load CSV from public folder
//
useEffect(() => {
    fetch('questInfo.csv')
    // response(variable from that gets its value from fetch)
    .then(response => response.text()) // converts the info from csv to proper string
    .then(csvText => {
        // inside the {} in Papa.parse(csvText,{}) is where you set your rules for handling the text
        Papa.parse(csvText, {
        header: true, // tells Papa to treat first row as headers
        skipEmptyLines: true,
        complete: (results) => {
            // filters for data that is for the past quest
            const filtered = results.data.filter(row =>
            row.status?.toLowerCase() === 'completed' ||
            row.status?.toLowerCase() === 'fail'
            );
            setRows(filtered); // puts result into setRows that later puts it into the array of rows
        }
        });
    });
}, []);

return (
    <div>
    <h2>Previus Quests</h2>
    {/* Shows table if data exists */}
    {rows.length > 0 ? (
        <table border="1">
        <thead>
            <tr>
            {/** Object built-in JS class, 
             * keys info to individual object map((key)=>.. loops through them */}
            {Object.keys(rows[0]).map((key) => (
                <th key={key}>{key}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {/** row current row in loop index is position 
             * tr is table row key keeps track of the row when updating
            */}
            {rows.map((row, index) => (
            <tr key={index}>
                {/* makes the row for original array to new array
                and key={i} creates a cell that gets the value of value */}
                {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    ) : (
        <p>Loading or no matching data...</p>
    )}
    </div>
);
};

export default CsvTable;