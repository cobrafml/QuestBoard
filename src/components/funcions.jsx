import { useEffect,useState } from "react";
import Papa from "papaparse";
import { useCsv } from "./CsvPrevider.jsx";

const removePastQuests=(csvData,setCsvData)=>{
    const remaning = csvData.filter((row) =>
        row.status?.toLowerCase() !== 'completed' &&
        row.status?.toLowerCase() !== 'fail'
    );
    setCsvData(remaning);
};



export default removePastQuests