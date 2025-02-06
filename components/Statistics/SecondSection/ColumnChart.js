import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
//CUSTOM HOOKS
import useConvertTimes from '@/custom-hooks/times_and_dates/useConvertTimes';


const ColumnChart = () => {
    const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)

    // Funktion zur Berechnung der gesamten Stundenanzahl
    const calculateTotalDurationInHours = (sports) => {
        const totalMinutes = sports.reduce((acc, sport) => acc + sport.duration, 0);
        return (totalMinutes / 60).toFixed(2);
    };

    // Funktion zur Gruppierung der Sportarten und Summierung der Dauer
    const groupBySportAndCalculateDuration = (sports) => {
        return sports.reduce((acc, sport) => {
            if (!acc[sport.name]) {
                acc[sport.name] = { name: sport.name, totalDuration: 0 };
            }
            acc[sport.name].totalDuration += sport.duration; 
            return acc;
        }, {});
    };

    // Gesamtstundenanzahl berechnen
    const totalHoursForYear = calculateTotalDurationInHours(allSupabaseSports);

    // Sportarten gruppieren und deren Gesamtdauer berechnen
    const groupedSports = groupBySportAndCalculateDuration(allSupabaseSports);
 
     // Umwandeln des gruppierten Objekts in ein Array für das Diagramm
     const chartData = Object.values(groupedSports).map(({ name, totalDuration }) => ({
         name,
         totalHoursInYear: totalHoursForYear,
         totalHoursOfSport: (totalDuration / 60).toFixed(2), 
         percentage: ((totalDuration / (totalHoursForYear * 60)) * 100).toFixed(2), 
     }));

    return (
        <div className="w-full  h-80 m-0 my-2 mr-2 p-2 overflow-scroll">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalHoursInYear" fill="grey" name="Total Sports Hours" />
                    <Bar dataKey="totalHoursOfSport" fill="hsl(340, 90%, 55%)" name="sport hours for sport x" />
                    <Bar dataKey="percentage" fill="black" name="sport x as % of Total Hours"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ColumnChart;