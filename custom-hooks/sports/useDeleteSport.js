// useDeleteSport.js
import { useDispatch, useSelector } from "react-redux";

import { setAllSportsFromSupabase, setNavigation } from "@/store/sportReducer";

const useDeleteSport = () => {
  const dispatch = useDispatch();
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );
  const userId = useSelector((state) => state.auth.userId);

  const deleteSportHandler = async (sport) => {
    if (
      window.confirm(
        `Are you sure you want to delete “${sport}”? All entries will be lost`
      )
    ) {
      const updatedNavigationArr = allSupabaseSports.filter(
        (item) => item.name !== sport
      );
      const uniqueSports = Array.from(
        new Set(updatedNavigationArr.map((sport) => sport.name))
      ).sort((a, b) => a.localeCompare(b));
      dispatch(setNavigation(uniqueSports));

      try {
        const response = await fetch("/api/deleteSport", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sportName: sport, userId }),
        });

        if (!response.ok) {
          throw new Error("Fehler beim Löschen des Sports");
        }

        const result = await response.json();
        console.log(result.message);

        // Aktualisiere allSupabaseSports im Redux-Store
        const updatedAllSupabaseSports = allSupabaseSports.filter(
          (item) => !(item.name === sport && item.userId === userId)
        );
        dispatch(setAllSportsFromSupabase(updatedAllSupabaseSports));
      } catch (error) {
        console.error("Fehler beim Löschen:", error);
      }
    }
  };

  return { deleteSportHandler };
};

export default useDeleteSport; 
