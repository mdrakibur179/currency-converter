/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import "./style.css";

const App = () => {
  const [amount, setAmount] = useState(0);
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("INR");
  const [output, setOutput] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);

  const inputRef = useRef(null);

  const flagUrls = {
    USD: "https://flagpedia.net/data/flags/h80/us.png",
    INR: "https://flagpedia.net/data/flags/h80/in.png",
    AUD: "https://flagpedia.net/data/flags/h80/au.png",
    BGN: "https://flagpedia.net/data/flags/h80/bg.png",
    BRL: "https://flagpedia.net/data/flags/h80/bz.png",
    CAD: "https://flagpedia.net/data/flags/h80/ca.png",
    CHF: "https://flagpedia.net/data/flags/h80/ch.png",
    CNY: "https://flagpedia.net/data/flags/h80/cn.png",
    CZK: "https://flagpedia.net/data/flags/h80/cz.png",
    DKK: "https://flagpedia.net/data/flags/h80/dk.png",
    EUR: "https://flagpedia.net/data/flags/h80/eu.png",
    GBP: "https://flagpedia.net/data/flags/h80/gb.png",
    HKD: "https://flagpedia.net/data/flags/h80/hk.png",
    HUF: "https://flagpedia.net/data/flags/h80/hu.png",
    IDR: "https://flagpedia.net/data/flags/h80/id.png",
    ILS: "https://flagpedia.net/data/flags/h80/il.png",
    ISK: "https://flagpedia.net/data/flags/h80/is.png",
    JPY: "https://flagpedia.net/data/flags/h80/jp.png",
    KRW: "https://flagpedia.net/data/flags/h80/kr.png",
    MXN: "https://flagpedia.net/data/flags/h80/mx.png",
    MYR: "https://flagpedia.net/data/flags/h80/mm.png",
    NOK: "https://flagpedia.net/data/flags/h80/no.png",
    NZD: "https://flagpedia.net/data/flags/h80/nz.png",
    PHP: "https://flagpedia.net/data/flags/h80/ph.png",
    PLN: "https://flagpedia.net/data/flags/h80/pl.png",
    RON: "https://flagpedia.net/data/flags/h80/ro.png",
    SEK: "https://flagpedia.net/data/flags/h80/se.png",
    SGD: "https://flagpedia.net/data/flags/h80/sg.png",
    THB: "https://flagpedia.net/data/flags/h80/th.png",
    TRY: "https://flagpedia.net/data/flags/h80/tr.png",
    ZAR: "https://flagpedia.net/data/flags/h80/za.png",
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const res = await fetch(`https://api.frankfurter.app/currencies`);
        const data = await res.json();
        setCurrencies(Object.keys(data));
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    }
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (amount > 0) {
      convert();
    }
  }, [amount, fromCur, toCur]);

  const convert = async () => {
    if (!amount || isNaN(amount)) {
      setOutput("Invalid amount");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
      );
      const data = await res.json();
      setOutput(data.rates[toCur].toFixed(2));
    } catch (error) {
      if (fromCur === toCur) return setOutput(amount);
      console.error("Error during conversion:", error);
      setOutput("Conversion error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          Currency Converter
        </h1>

        <div className="flex flex-col gap-4 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                convert();
              }
            }}
            disabled={isLoading}
            className="border-2 border-gray-300 p-3 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-4">
            <select
              value={fromCur}
              onChange={(e) => setFromCur(e.target.value)}
              disabled={isLoading}
              className="border-2 border-gray-300 p-3 rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>

            <select
              value={toCur}
              onChange={(e) => setToCur(e.target.value)}
              disabled={isLoading}
              className="border-2 border-gray-300 p-3 rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={convert}
            disabled={isLoading}
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Convert
          </button>
        </div>

        {isLoading ? (
          <p className="text-blue-600 font-bold">Converting...</p>
        ) : (
          <p className="text-xl font-semibold text-gray-800">
            {amount && (
              <span className="flex items-center justify-center gap-2">
                <img
                  src={flagUrls[fromCur]}
                  alt={`${fromCur} flag`}
                  className="w-8 border border-indigo-600"
                />
                {amount} {fromCur} =
                <img
                  src={flagUrls[toCur]}
                  alt={`${toCur} flag`}
                  className="w-8 border border-indigo-600"
                />
                {output} {toCur}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
