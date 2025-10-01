import { useEffect,useState } from "react";
import Papa from "papaparse";

function CSVTable(){
    const[data,setData] = useState([]);
    useEffect(()=>{
        fetch("/storegeFiles/questStorage.csv")
    })
}