
import { createContext, useContext, useState } from "react";

const CsvContext = createContext();

export const CsvProvider = ({ children }) => {
const [csvData, setCsvData] = useState([]);

return (
    <CsvContext.Provider value={{ csvData, setCsvData }}>
    {children}
    </CsvContext.Provider>
);
};


export const useCsv = () => useContext(CsvContext);