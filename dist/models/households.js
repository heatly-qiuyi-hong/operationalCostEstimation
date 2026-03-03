import mongoose from "mongoose";
const householdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    heatingResource: {
        type: String,
        enum: ["heat pump", "gas boiler"],
        required: true,
    },
    gasBoilerCost: {
        type: Number,
        required: false,
    },
    heatPumpCost: {
        type: Number,
        required: false,
    },
});
const Household = mongoose.model("Household", householdSchema);
export default Household;
