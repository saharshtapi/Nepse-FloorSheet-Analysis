import { React, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import SearchBox from "./SearchBox";
import TableOutput from "./TableOutput";
import Papa from "papaparse";
import Loader from "./Loader";
import "./style.css";

export default function App() {
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [query,setQuery]=useState('');
  const [loading, setloading] = useState(true);
  const [searchclicked, setsearchclicked] = useState(false);
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState("");

  function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          setText(allText);
        }
      }
    };
    rawFile.send(null);
  }

  function fetchData() {
    fetch(
      `https://raw.githubusercontent.com/saharshtapi/Nepse-FloorSheet-Analysis/main/Data/${date
        .toISOString()
        .substring(0, 10)}-data.csv`
    )
      .then((res) => {
        if (res.status === 404) {
          setDate(date.setDate(date.getDate() - 1));
          console.log(date.toISOString().substring(0, 10));
          fetchData();
        } else if (res.status === 200) {
          Papa.parse(
            `https://raw.githubusercontent.com/saharshtapi/Nepse-FloorSheet-Analysis/main/Data/${date
              .toISOString()
              .substring(0, 10)}-data.csv`,
            {
              download: true,
              header: true,
              complete: function (results) {
                setParsedCsvData(results.data);
                setMainData(results.data);
                setloading(false);
              },
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    readTextFile(
      "https://raw.githubusercontent.com/saharshtapi/Nepse-FloorSheet-Analysis/main/last_update.txt"
    );
    fetchData();
  }, []);
  function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

  function searchSellers(query) {
    setQuery('SELLER')
    const mainDataRef = JSON.parse(JSON.stringify(mainData));
    let newarray = [];
    if (isNaN(query)) {
      query = query.toUpperCase();
      newarray = mainDataRef.filter(function (row) {
        return row.SStock === query;
      });
    } else {
      newarray = mainDataRef.filter(function (row) {
        return row.Seller === query;
      });
    }

    newarray.sort(function (a, b) {
      if (parseInt(a.SQty) < parseInt(b.SQty)) return 1;
      else if (parseInt(a.SQty) > parseInt(b.SQty)) return -1;
      else return 0;
    });
    newarray.forEach((obj) => renameKey(obj, "Seller", "Broker"));
    newarray.forEach((obj) => renameKey(obj, "SQty", "Qty"));
    newarray.forEach((obj) => renameKey(obj, "SStock", "Stock"));
    setParsedCsvData(newarray);
    setsearchclicked(true);
  }

  function searchBuyers(query) {
    setQuery('BUYER');
    const mainDataRef = JSON.parse(JSON.stringify(mainData));
    let newarray = [];
    if (isNaN(query)) {
      query = query.toUpperCase();
      newarray = mainDataRef.filter(function (row) {
        return row.BStock === query;
      });
    } else {
      newarray = mainDataRef.filter(function (row) {
        return row.Buyer === query;
      });
    }
    newarray.sort(function (a, b) {
      if (parseInt(a.BQty) < parseInt(b.BQty)) return 1;
      else if (parseInt(a.BQty) > parseInt(b.BQty)) return -1;
      else return 0;
    });
    newarray.forEach((obj) => renameKey(obj, "Buyer", "Broker"));
    newarray.forEach((obj) => renameKey(obj, "BQty", "Qty"));
    newarray.forEach((obj) => renameKey(obj, "BStock", "Stock"));
    setParsedCsvData(newarray);
    setsearchclicked(true);
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <SearchBox
            searchSellers={searchSellers}
            searchBuyers={searchBuyers}
          />
          <p className="last-updated">
            <b>Last Updated:&nbsp;</b>
            {text}
          </p>
          {searchclicked ? <TableOutput data={parsedCsvData} query={query}/> : null}
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
