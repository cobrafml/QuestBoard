import React, { useEffect,useState } from "react";
import Papa from "papaparse";
import CsvTable from "../components/tables.jsx";

export function History()
{
    
    return(
        <>
          <h1> this is the page to see past quests </h1>
          
          <CsvTable/>
        </>
    )
}
