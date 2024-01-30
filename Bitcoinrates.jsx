import React, { useState, useEffect, useReducer } from 'react';

const currencies = ['USD', 'AUD', 'NZD', 'GBP', 'EUR', 'SGD'];

// Action types for useReducer
const actionTypes = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
};

// Reducer function for useReducer
const bitcoinReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case actionTypes.FETCH_SUCCESS:
      return { ...state, loading: false, bitcoinPrice: action.payload };
    case actionTypes.FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Custom hook for fetching Bitcoin price
const useBitcoinPrice = initialCurrency => {
  const [currency, setCurrency] = useState(initialCurrency);
  const [state, dispatch] = useReducer(bitcoinReducer, {
    bitcoinPrice: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      dispatch({ type: actionTypes.FETCH_REQUEST });

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`
        );
        const data = await response.json();
        dispatch({ type: actionTypes.FETCH_SUCCESS, payload: data.bitcoin[currency] });
      } catch (error) {
        dispatch({ type: actionTypes.FETCH_FAILURE, payload: error.message });
      }
    };

    fetchBitcoinPrice();

    // Cleanup function to cancel the fetch if the component is unmounted or if the currency changes
    return () => {
      // Any cleanup code (e.g., cancelling ongoing network requests) goes here
    };
  }, [currency]);

  return { currency, setCurrency, ...state };
};

function BitcoinRates() {
  const { currency, setCurrency, loading, bitcoinPrice, error } = useBitcoinPrice(currencies[0]);

  const options = currencies.map(curr => (
    <option value={curr} key={curr}>
      {curr}
    </option>
  ));

  return (
    <div className="BitcoinRates componentBox">
      <h3>Bitcoin Exchange Rate</h3>
      <label>
        Choose currency:
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          {options}
        </select>
      </label>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {bitcoinPrice !== null && <p>Current Price of Bitcoin in {currency}: {bitcoinPrice} {currency}</p>}
    </div>
  );
}

export default BitcoinRates;
