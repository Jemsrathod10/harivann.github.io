import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;
    
    case 'ADD_TO_CART':
      const existItem = state.find(x => x._id === action.payload._id);
      
      if (existItem) {
        return state.map(x =>
          x._id === existItem._id 
            ? { ...x, qty: x.qty + action.payload.qty }
            : x
        );
      } else {
        return [...state, action.payload];
      }
    
    case 'REMOVE_FROM_CART':
      return state.filter(x => x._id !== action.payload);
    
    case 'UPDATE_CART_QTY':
      return state.map(x =>
        x._id === action.payload.id
          ? { ...x, qty: action.payload.qty }
          : x
      );
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
};

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, qty }
    });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateCartQty = (id, qty) => {
    dispatch({ type: 'UPDATE_CART_QTY', payload: { id, qty } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
