
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './BarChart.module.css'; // Styles importieren

const BarChartComponent = ({ allSupabaseSports, date, setDate }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const sportCounts = {};

        // Filtere die allSupabaseSports basierend auf dem date-Objekt
        const filteredSports = allSupabaseSports.filter((sport) => {
            const createdAtDate = new Date(sport.created_at);
            const year = createdAtDate.getFullYear();
            const month = createdAtDate.getMonth();

            if (date.month === "All") {
                return year === date.year; // Nur das Jahr überprüfen
            } else {
                const monthIndex = new Date(Date.parse(date.month + " 1, 2020")).getMonth();
                return year === date.year && month === monthIndex; // Jahr und Monat überprüfen
            }
        });

        filteredSports.forEach((sport) => {
            const { name } = sport;
            if (!sportCounts[name]) {
                sportCounts[name] = { count: 0 };
            }
            sportCounts[name].count += 1;
        });

        // Umwandeln in ein Array und nach der Anzahl sortieren
        const sortedSports = Object.entries(sportCounts)
            .map(([name, { count }]) => ({ name, count }))
            .sort((a, b) => a.count - b.count);
        setChartData(sortedSports);
        console.log(filteredSports)
        console.log(sortedSports)
    }, [allSupabaseSports, date]);

   

    return (
        <div className={styles.container}>
        <h1 className="py-2 flex items-center">
            Your Bar Chart for {date.year}, {date.month}
            <span className='text-xs mx-6'> referred to number of units </span>
        </h1>

        {/*
        <div className="flex h-28 lg:h-14 lg:border-red-200 px-4 my-2">
            <SelectTimePeriod date={date} setDate={setDate} />
        </div> 
        */}

        {/* Überprüfen ob chartData leer ist */}
        {chartData.length === 0 ? (
            <p>No data could be rendered for the year {date.year}.</p>
        ) : (
            <div className={styles.bar_chart}>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="hsl(340, 60%, 65%)" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )}
    </div>
);
};

export default BarChartComponent;