import "./App.css";

import axios from "axios";
import * as d3 from "d3";
import React from "react";

import BarChart from "./BarChart";

function App() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      await axios.get("/order/dish_stats/").then((res) => {
        setData(res.data);
        setLoading(false);
      });
    }
    fetchData();
    return () => undefined;
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {loading && <div>loading</div>}
        {!loading && <BarChart data={data} />}
      </header>
    </div>
  );
}

export default App;
