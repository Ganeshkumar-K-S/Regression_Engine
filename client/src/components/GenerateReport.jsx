import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function GenerateReport() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClick = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/generatereport', {
                method: 'GET',
                credentials: 'include',
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
            setError('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            {loading ? (
                <Skeleton height={44} width={180} borderRadius={12} />
            ) : (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                    className="px-6 py-2 rounded bg-purple-600 text-white font-semibold font-montserrat hover:bg-purple-700 transition"
                >
                    📄 Generate Report
                </motion.button>
            )}
            {error && (
                <p className="mt-4 text-red-600 text-sm absolute bottom-4">{error}</p>
            )}
        </div>
    );
}
