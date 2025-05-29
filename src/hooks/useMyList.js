import { useState, createContext, useContext, useEffect } from "react";

const MyListContext = createContext();

// MyList Provider
export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedList = localStorage.getItem("netflix-my-list");
    if (savedList) {
      try {
        setMyList(JSON.parse(savedList));
      } catch (error) {
        console.error("Error loading my list:", error);
      }
    }
  }, []);

  // Save to localStorage whenever myList changes
  useEffect(() => {
    localStorage.setItem("netflix-my-list", JSON.stringify(myList));
  }, [myList]);

  const addToMyList = (movie) => {
    setMyList((prevList) => {
      // Check if movie already exists
      if (prevList.some((item) => item.id === movie.id)) {
        return prevList;
      }
      return [...prevList, { ...movie, addedAt: Date.now() }];
    });
  };

  const removeFromMyList = (movieId) => {
    setMyList((prevList) => prevList.filter((item) => item.id !== movieId));
  };

  const isInMyList = (movieId) => {
    return myList.some((item) => item.id === movieId);
  };

  const clearMyList = () => {
    setMyList([]);
  };

  return (
    <MyListContext.Provider
      value={{
        myList,
        addToMyList,
        removeFromMyList,
        isInMyList,
        clearMyList,
      }}
    >
      {children}
    </MyListContext.Provider>
  );
};

// Hook to use MyList
export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used within MyListProvider");
  }
  return context;
};

export default { MyListProvider, useMyList };
