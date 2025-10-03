

import DataCard from "../components/cards"; 
import { useCsv } from "../components/CsvPrevider";

export function Home() {
const {csvData} = useCsv();
    
    return (
    <>
    <h1>This is the home page</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {csvData && csvData.length > 0 ? (
            csvData.map((item, index) => (
                <DataCard key={index} item={item} />
            ))
            ) : (
            <p>No data available</p>
            )}
        </div>
    </>
    );
}