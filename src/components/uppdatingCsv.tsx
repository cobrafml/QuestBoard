import Papa from "papaparse";

// Define a type for your CSV rows
export type CsvRow = {
status?: string;
[key: string]: any; // Allow other columns dynamically
};

/**
 * Remove quests with status 'completed' or 'fail'
 */
export const removePastQuests = (
csvData: CsvRow[],
setCsvData: React.Dispatch<React.SetStateAction<CsvRow[]>>
): void => {
const remaining = csvData.filter(
    (row) =>
    row.status?.toLowerCase() !== "completed" &&
    row.status?.toLowerCase() !== "fail"
);
setCsvData(remaining);
};

/**
 * Save the current CSV data as a downloadable file
 */

export async function saveToServer(data: CsvRow[]) {
try {
    console.log("Sending data to server:", data);

    // Convert array of objects to CSV string
    const csv = Papa.unparse(data);

    // Send CSV to Express server
    const response = await fetch("http://localhost:3001/update-csv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ csv }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const result = await response.json();
    console.log("Server response:", result);
    alert("CSV updated successfully!");
} catch (error) {
    console.error("Failed to update CSV:", error);
    alert("Failed to update CSV. Check console for details.");
}
}


/**
 * Parse a CSV file into JSON
 */
export const parseCSV = (file: File): Promise<CsvRow[]> => {
return new Promise((resolve, reject) => {
    Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results: any) => resolve(results.data as CsvRow[]),
    error: (error:Error) => reject(error),
    });
});
};