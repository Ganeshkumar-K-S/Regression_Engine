import React from 'react';

export default function GenerateReport() {
    const handleClick = () => {
        const link = document.createElement('a');
        link.href = 'http://localhost:5000/api/generatereport';
        link.download = 'styled_report.pdf'; // Suggests filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
