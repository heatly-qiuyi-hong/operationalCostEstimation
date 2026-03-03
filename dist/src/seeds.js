import mongoose from "mongoose";
import Household from "../models/households.js";
mongoose
    .connect("mongodb://127.0.0.1:27017/operationalCostEstimation")
    .then(() => {
    console.log("Mongo Connection Open!");
})
    .catch((err) => {
    console.log("Mongo Error:");
    console.log(err);
});
const p = new Household({
    name: "Mike",
    address: "1 Henry Terrace, LS19 7JG",
    latitude: 53.8654,
    longitude: 1.6999,
    heatingResource: "gas boiler",
});
p.save()
    .then((p) => {
    console.log(p);
})
    .catch((e) => {
    console.log(e);
});
