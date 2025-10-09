import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useCsv } from './CsvPrevider';
import removePastQuests from './funcions.jsx'

const CsvTable = () => {
const [rows, setRows] = useState([]);
// rows holding array for the csv information setRows adds the lines to the array

// Load CSV from public folder
//

const {csvData,setCsvData} = useCsv();
const currentData = csvData?.filter(row =>  
    row.status?.toLowerCase() === 'completed' ||
    row.status?.toLowerCase() === 'fail'
);

return (
<>
    <div>
                <div>
                    <button className='clearHistoryBtn' onClick={()=>removePastQuests(csvData,setCsvData)}>Clear History</button>
                </div>
    <h2>Previus Quests</h2>
    {/* Shows table if data exists */}
    {currentData && currentData.length > 0 ? (
        <table border="1">
        <thead>
            <tr>
            {/** Object built-in JS class, 
             * keys info to individual object map((key)=>.. loops through them */}
            {Object.keys(currentData[0]).map((key) => (
                <th key={key}>{key}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {/** row current row in loop index is position 
             * tr is table row key keeps track of the row when updating
             */}
            {currentData.map((row, index) => (
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
</>
    
);
};

export default CsvTable;