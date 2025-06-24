import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import styles from './ColumnChart.module.css'


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
        const grouped = sports.reduce((acc, sport) => {
            if (!acc[sport.name]) {
                acc[sport.name] = { name: sport.name, totalDuration: 0, label: sport.label };
            }
            acc[sport.name].totalDuration += sport.duration;
            return acc;
        }, {});

        // Berechnung der Gesamtdauer für alle Sportarten
        const totalDuration = Object.values(grouped).reduce((sum, sport) => sum + sport.totalDuration, 0);
        // Hinzufügen des Objekts für alle Sportarten
        grouped["AllSports"] = { name: "AllSports", totalDuration,label: "customPink" };

        return grouped;
    };

    // Gesamtstundenanzahl berechnen
    const totalHoursForYear = calculateTotalDurationInHours(allSupabaseSports);

    console.log(totalHoursForYear)

    // Sportarten gruppieren und deren Gesamtdauer berechnen
    const groupedSports = groupBySportAndCalculateDuration(allSupabaseSports);
    console.log(groupedSports);

     // Umwandeln des gruppierten Objekts in ein Array für das Diagramm
     const chartData = Object.values(groupedSports).map(({ name, totalDuration, label }) => ({
         name,
         totalHoursOfSport: (totalDuration / 60).toFixed(2), 
         percentage: ((totalDuration / (totalHoursForYear * 60)) * 100).toFixed(2), 
         label
     }));

     // Berechnung des maximalen Wertes für die Y-Achse
    const maxYValue = Math.max(...chartData.map(data => parseFloat(data.totalHoursOfSport))) + 10;

    // create dynamic ticks
    const tickCount = Math.ceil(maxYValue / 10);
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i * 10);

    console.log(groupedSports)

    console.log(chartData)

    return (
        <div className="w-full relative right-2 xmd:right-0 h-80 m-0 p-0 overflow-scroll">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis 
                        domain={[0, Math.max(...chartData.map(data => parseFloat(data.totalHoursOfSport))) + 10]}
                        ticks={ticks} //dynamic ticks
                        tickFormatter={(value) => `${value} h`} // Formatierung der Ticks 
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalHoursOfSport" fill="hsl(340, 90%, 55%)" name="number of hours of the individual sports and total number of hours" />
                    {/*<Bar dataKey="percentage" fill="black" name="sport x as % of Total Hours"/>*/}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ColumnChart;