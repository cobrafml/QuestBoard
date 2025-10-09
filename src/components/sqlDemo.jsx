// src/components/SqlDemo.jsx
import React, { useEffect, useState } from 'react';
import initSqlJs from 'sql.js';

const SqlDemo = () => {
const [dbResult, setDbResult] = useState(null);

useEffect(() => {
    const loadDatabase = async () => {
    const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
    });

    const db = new SQL.Database();

    db.run("CREATE TABLE test (id int, name char);");
    db.run("INSERT INTO test VALUES (1, 'Noah'), (2, 'Anna');");

    const result = db.exec("SELECT * FROM test");
    setDbResult(result);
    };

    loadDatabase();
}, []);

return (
    <div>
    <h2>SQLite in Browser</h2>
    {dbResult ? (
        <table border="1">
        <thead>
            <tr>
            {dbResult[0].columns.map((col, i) => (
                <th key={i}>{col}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {dbResult[0].values.map((row, i) => (
            <tr key={i}>
                {row.map((val, j) => (
                <td key={j}>{val}</td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    ) : (
        <p>Loading database...</p>
    )}
    </div>
);
};

export default SqlDemo;