import React from 'react';

export default function GenerateReport() {
    const handleClick = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/generatereport', {
                method: 'GET',
                credentials: 'include', // Include cookies
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Report.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating report:', error);
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
