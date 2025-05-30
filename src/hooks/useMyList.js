import { useState, createContext, useContext, useEffect } from "react";

const MyListContext = createContext();

export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState([]);

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

  useEffect(() => {
    localStorage.setItem("netflix-my-list", JSON.stringify(myList));
  }, [myList]);

  const addToMyList = (movie) => {
    setMyList((prevList) => {
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

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used within MyListProvider");
  }
  return context;
};

export default { MyListProvider, useMyList };
