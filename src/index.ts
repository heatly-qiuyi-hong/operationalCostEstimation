import express from "express";
const app = express();
const port = 3300;
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";

import Household from "../models/households.js";

import smartMeterData from "./smartMeterData.js";
import hourlyWeatherData from "./weather.js";
import { start } from "repl";

mongoose
  .connect("mongodb://127.0.0.1:27017/operationalCostEstimation")
  .then(() => {
    console.log("Mongo Connection Open!");
  })
  .catch((err) => {
    console.log("Mongo Error:");
    console.log(err);
  });

app.set("views", path.join(path.dirname(""), "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// app.get("/products/new", (req, res) => {
//   // res.send("New Product Form will be here!");
//   res.render("products/new", { categories });
// });

// Gas tariff: standing charge: 33.1p/day, average unit rate: 5.4p/kWh
const gasTariff = {
  standingCharge: 0.331,
  unitRate: 0.054,
};

const electricityTariff = {
  standingCharge: 0.527,
  unitRate: 0.234,
};

app.get("/households", async (req, res) => {
  const households = await Household.find({});
  // res.send(households);
  res.render("../views/households/index.ejs", { households });
});

// app.post("/households", async (req, res) => {
//   const household = new Household(req.body.household);
//   await household.save();
//   res.redirect(`/households/${household._id}`);
// });

app.get("/households/:id", async (req, res) => {
  const { id } = req.params;
  const household = await Household.findById(id);
  // console.log(household);
  // res.send('Household Details will be here!');
  // res.send(household);
  res.render("../views/households/show.ejs", { household });
});

app.get("/households/:id/edit", async (req, res) => {
  const { id } = req.params;
  const household = await Household.findById(id);
  res.render("../views/households/edit.ejs", { household });
});

app.put("/households/:id", async (req, res) => {
  const { id } = req.params;
  const household = await Household.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  console.log(req.params);
  console.log(req.body);
  res.redirect(`/households/${household?._id}`);
});

app.get("/households/:id/cost", async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime } = req.query as {
    startTime?: string;
    endTime?: string;
  };

  const household = await Household.findById(id);

  // If user opens the page without query params, don't call APIs.
  if (!startTime || !endTime) {
    return res.render("../views/households/cost.ejs", {
      household,
      energyData: { data: [] },
      weatherData: null,
      weatherDataHourly: [],
      startTime,
      endTime,
      gasCost: "",
      electricityCost: "",
    });
  }

  try {
    const starTimeSmartMeter = `${startTime}:00`;
    const endTimeSmartMeter = `${endTime}:00`;
    const energyData = await smartMeterData(
      starTimeSmartMeter,
      endTimeSmartMeter,
    );
    let gasCost = 0;
    let electricityCost = 0;
    if (energyData.data.length > 0) {
      for (let dailyData of energyData.data) {
        if (energyData.classifier === "gas.consumption") {
          gasCost +=
            dailyData[1] * gasTariff.unitRate + gasTariff.standingCharge;
        } else if (energyData.classifier === "electricity.consumption") {
          electricityCost +=
            dailyData[1] * electricityTariff.unitRate +
            electricityTariff.standingCharge;
        }
      }
    } else {
      console.warn("No energy data retrieved for the specified time range.");
    }

    const startTimeWeather = startTime.split("T")[0];
    const endTimeWeather = endTime.split("T")[0];
    const weatherData = await hourlyWeatherData(
      startTimeWeather,
      endTimeWeather,
      household?.latitude,
      household?.longitude,
    );

    const weatherDataHourly = weatherData.hourly.temperature_2m?.slice(
      0,
      weatherData.hourly.temperature_2m.length - 23,
    );

    return res.render("../views/households/cost.ejs", {
      household,
      energyData,
      weatherData,
      weatherDataHourly,
      startTime,
      endTime,
      gasCost: gasCost.toFixed(2),
      electricityCost: electricityCost.toFixed(2),
    });
  } catch (e) {
    console.error(e);
    return res.status(502).render("../views/households/cost.ejs", {
      household,
      energyData: { data: [] },
      weatherData: null,
      weatherDataHourly: [],
      startTime,
      endTime,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
