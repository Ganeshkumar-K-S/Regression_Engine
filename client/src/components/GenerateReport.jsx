import React from 'react';

export default function GenerateReport() {
    const handleClick = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/generatereport', {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Report generated:', data);
            alert('Report generated successfully!');
        } catch (error) {
            console.error('Failed to generate report:', error);
            alert('Failed to generate report');
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            <button
                onClick={handleClick}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Generate Report
            </button>
        </div>
    );

}
