import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import MapComponent from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./utils";
import "leaflet/dist/leaflet.css";

function App() {
  const [contries, setContries] = useState([]);
  const [country, setCountry] = useState(["worldwide"]);
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0, lng: 78.0 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch(`https://disease.sh/v3/covid-19/all`)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const allCountries = data.map((c) => ({
            name: c.country,
            value: c.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setContries(allCountries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(`${url}`)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        console.log(data);
        countryCode === "worldwide"
          ? setMapCenter({ lat: 34.80746, lng: -40.4796 })
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={(event) => onCountryChange(event)}
              value={country}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {contries.map((c, index) => (
                <MenuItem key={index} value={c.value}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            active={casesType === 'cases'}
            onClick = {e => {setCasesType('cases')}}
            title="Coronavirus cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
          <InfoBox
            isGreen
            active={casesType === 'recovered'}
            onClick = {e => {setCasesType('recovered')}}
            title="Recoverd"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          />
          <InfoBox
          isRed
           active={casesType === 'deaths'}
            onClick = {e => {setCasesType('deaths')}}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>
        <div className="app__map">
          <MapComponent
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
            casesType={casesType}
          />
        </div>
      </div>
      
        <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <LineGraph className="app__graph" casesType={casesType} />
          </CardContent>
        </Card>
     
    </div>
  );
}

export default App;
