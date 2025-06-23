import { useMemo } from "react";

const useStatistics = (allSupabaseSports, currentDate) => {
  const stats = useMemo(() => {
    if (!Array.isArray(allSupabaseSports) || allSupabaseSports.length === 0) {
      return {
        totalDuration: 0,
        totalEntries: 0,
        averageDuration: 0,
        activeDays: 0,
      };
    }


    // 1. Gesamtstunden aller Sportarten (Summe aller .duration in Minuten → in Stunden umrechnen)
    const totalDurationMinutes = allSupabaseSports.reduce(
      (sum, entry) => sum + (entry.duration || 0),
      0
    );
    const totalDuration = totalDurationMinutes / 60;

    // 2. Anzahl Sporteinheiten insgesamt
    const totalEntries = allSupabaseSports.length;

    // 3. Durchschnittliche Dauer pro Einheit (in Minuten, oder Stunden?)

      // Parse Start- und Enddatum
    const startOfYear = new Date(`${currentDate}-01-01`);
    const today = new Date();
    const isCurrentYear = today.getFullYear() === currentDate;
    const endDate = isCurrentYear ? today : new Date(`${currentDate}-12-31`);

    // Berechne Anzahl der Tage vom 1. Jan bis heute/Ende des Jahres
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSinceStart = Math.floor((endDate - startOfYear) / msPerDay) + 1;
    
    
    


    const hours = Math.floor(totalDuration / daysSinceStart);
    const minutes = Math.round(((totalDuration / daysSinceStart) - hours) * 60);
    const averageDurationPerDay = `${hours}h ${minutes}min`;
    

    const averageDuration =
      totalEntries > 0 ? totalDurationMinutes / totalEntries : 0;

    // 4. Aktive Tage insgesamt (einmalige Tage zählen)
    const uniqueDays = new Set(
      allSupabaseSports.map((entry) =>
        new Date(entry.created_at).toISOString().split("T")[0]
      )
    );
    const activeDays = uniqueDays.size;

    // 5. Inaktive Tage = Tage ohne Sport
    const inactiveDays = daysSinceStart - activeDays;


    // 6. den längsten Streak filtern

    let longestStreakLength = 0;
    let currentStreak = 0;
    let streakStart = null;
    let longestStreakStart = null;
    let longestStreakEnd = null;
    
    // Iteriere über alle Tage vom 1. Januar bis heute
    for (let d = new Date(startOfYear); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
    
      if (uniqueDays.has(dateStr)) {
        if (currentStreak === 0) {
          streakStart = new Date(d);
        }
        currentStreak++;
        if (currentStreak > longestStreakLength) {
          longestStreakLength = currentStreak;
          longestStreakStart = new Date(streakStart);
          longestStreakEnd = new Date(d);
        }
      } else {
        currentStreak = 0;
        streakStart = null;
      }
    }
    
    const longestStreak = {
      length: longestStreakLength,
      from: longestStreakStart ? longestStreakStart.toISOString().split("T")[0] : null,
      to: longestStreakEnd ? longestStreakEnd.toISOString().split("T")[0] : null,
    };


    return {
      totalDuration,     // in Stunden
      totalEntries,
      averageDurationPerDay,
      activeDays,
      inactiveDays,
      longestStreak 
    };
  }, [allSupabaseSports, currentDate]);

  return stats;
};

export default useStatistics;
