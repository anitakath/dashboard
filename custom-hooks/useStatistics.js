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

    return {
      totalDuration,     // in Stunden
      totalEntries,
      averageDurationPerDay,
      averageDuration,   // in Minuten
      activeDays,
    };
  }, [allSupabaseSports, currentDate]);

  return stats;
};

export default useStatistics;
