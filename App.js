import Input from "./components/Input";
import "./App.css";
import { useCallback, useState, useEffect } from "react";
import List from "./components/List";
import ContextProvider from "./store/ContextProvider";
import HeaderCartButton from "./components/HeaderCartButton";
import Cart from "./components/Cart";
import axios from "axios";

function App() {
  const [candyList, setCandyList] = useState([]);

  const fetchCandyHandler = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://crudcrud.com/api/b66f629202ba4f6aae71db76adf8f221/products"
      );
      const data=response.data;
      if (response.statusText!=="OK") {
        throw new Error("something went wrong");
      }
      const products = [];
      for (const key in data) {
        products.push({
          name: data[key].candyName,
          description: data[key].description,
          price: data[key].price,
        });
      }
      setCandyList(products);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchCandyHandler();
  }, [fetchCandyHandler]);

  const addCandyHandler = (cname, cdes, cprice) => {
    setCandyList((prevList) => {
      return [
        ...prevList,
        {
          name: cname,
          description: cdes,
          price: cprice,
        },
      ];
    });
  };

  const [isViewed, setIsViewed] = useState(false);
  const closeCartHandler = () => {
    setIsViewed(false);
  };
  const openCartHandler = () => {
    setIsViewed(true);
  };

  return (
    <ContextProvider>
      <header>
        <Input onAdd={addCandyHandler}></Input>
        <HeaderCartButton showCart={openCartHandler}></HeaderCartButton>
        {isViewed && <Cart list={candyList} onClose={closeCartHandler}></Cart>}
      </header>
      <main>
        <List candies={candyList}></List>
      </main>
    </ContextProvider>
  );
}

export default App;
