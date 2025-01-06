
// useNavigation.js
import { useEffect, useState } from 'react';
import useFetchEntries from '../entries/useFetchEntries';

const useNavigation = (userId) => {
  const { fetchAllSportsFromUser } = useFetchEntries();
  const [navigationItems, setNavigationItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const sportsData = await fetchAllSportsFromUser(userId);
        // Hier kannst du weitere Filterlogik hinzufügen, falls nötig
        setNavigationItems(sportsData);
      }
    };

    fetchData();
  }, [userId, fetchAllSportsFromUser]);

  return navigationItems;
};

export default useNavigation