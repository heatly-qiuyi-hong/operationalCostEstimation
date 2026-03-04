import axios from "axios";
async function heatPumpConsumption(gasConsumption, weatherDataHourly, manufacturerId) {
    // Desigining a heating curve
    const pointOne = [20, 20];
    const pointTwo = [-20, 75];
    const slope = (pointTwo[1] - pointOne[1]) / (pointTwo[0] - pointOne[0]);
    const intercept = pointOne[1] - slope * pointOne[0];
    // Calculate the flow temperature based on the heating curve
    const flowTemp = weatherDataHourly.map((temp) => slope * temp + intercept);
    const copValues = [];
    for (let i = 0; i < weatherDataHourly.length; i++) {
        console.log(`Outdoor Temp: ${weatherDataHourly[i]}°C, Flow Temp: ${flowTemp[i]}°C`);
        const params = {
            copOutputKey: `A${Math.round(weatherDataHourly[i])}W${Math.round(flowTemp[i])}`,
        };
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Cookie: "user=eyJhbGciOiJIUzI1NiIsImtpZCI6Ijk3MTNmN2UzLTJjN2QtNDcwZC04Mzk4LTM5MzE3NDAxNWM4ZCIsInR5cCI6IkpXVCIsInVzZSI6InNpZyJ9.eyJ1c2VySWQiOiI2NDkiLCJyb2xlSWQiOiI3IiwiYnVzaW5lc3NJZCI6Ijc0NiIsImxvY2FsZUlkIjoiMSIsImRvbWFpbiI6IjAiLCJwYWNrYWdlSWQiOiI0IiwibmJmIjoxNzcyNjE2NDAxLCJleHAiOjE3NzI2NTk2MDEsImlhdCI6MTc3MjYxNjQwMSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdCJ9.ZZyJc9su4mX-i97RY_MbV-rVnP5VV5x_LU4y-xDAhhI",
        };
        async function getUser() {
            try {
                // const request = await axios.post(
                //     "https://dev01.heatly.tech/v1/user/login",
                //     {
                //       emailOrUsername: "Qiuyi.Hong@heatly.com",
                //       password: "Hong07927164256$",
                //     },
                // ).then((res) => {
                //   console.log("Login successful:", res.data);
                // }).catch((err) => {
                //   console.error("Login failed:", err);
                //   throw err;
                // });
                const response = await axios.get(`https://dev01.heatly.tech/v1/heatpump/metrics/${params.copOutputKey}`, {
                    params: params,
                    headers: headers,
                });
                const copValue = response.data.find((item) => item.manufacturerId === manufacturerId)?.metrics?.cop;
                return copValue;
            }
            catch (error) {
                console.error(error);
            }
        }
        copValues.push(await getUser());
    }
    let elecConsumption = [];
    for (let i = 0; i < copValues.length; i++) {
        elecConsumption.push((gasConsumption[i] * 0.9) / copValues[i]);
    }
    return elecConsumption;
}
async function HPConsumption(
// This function select the manufacturer first and then find the corresponding cop values, which will call API only once.
gasConsumption, weatherDataHourly, manufacturerId) {
    // Desigining a heating curve
    const pointOne = [20, 20];
    const pointTwo = [-20, 75];
    const slope = (pointTwo[1] - pointOne[1]) / (pointTwo[0] - pointOne[0]);
    const intercept = pointOne[1] - slope * pointOne[0];
    // Calculate the flow temperature based on the heating curve
    const flowTemp = weatherDataHourly.map((temp) => slope * temp + intercept);
    const copValues = [];
    const headers = {
        // Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: "user=eyJhbGciOiJIUzI1NiIsImtpZCI6Ijk3MTNmN2UzLTJjN2QtNDcwZC04Mzk4LTM5MzE3NDAxNWM4ZCIsInR5cCI6IkpXVCIsInVzZSI6InNpZyJ9.eyJ1c2VySWQiOiI2NDkiLCJyb2xlSWQiOiI3IiwiYnVzaW5lc3NJZCI6Ijc0NiIsImxvY2FsZUlkIjoiMSIsImRvbWFpbiI6IjAiLCJwYWNrYWdlSWQiOiI0IiwibmJmIjoxNzcyNTQ2ODI0LCJleHAiOjE3NzI1OTAwMjQsImlhdCI6MTc3MjU0NjgyNCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdCJ9.SBx6sXYQxEJzIibU2Uq9YPGT9joi4R162bsc2KI8gMU",
    };
    try {
        const response = await axios.get(`https://dev01.heatly.tech/v1/heatpump/${manufacturerId}`, {
            params: { id: manufacturerId },
            headers: headers,
        });
        const jsonData = response.data.result.outputCopJson;
        const copData = JSON.parse(jsonData);
        for (let i = 0; i < weatherDataHourly.length; i++) {
            const copValue = copData.find((item) => item.key ===
                `A${Math.round(weatherDataHourly[i])}W${Math.round(flowTemp[i])}`)?.value?.cop;
            copValues.push(copValue);
        }
        let elecConsumption = [];
        for (let i = 0; i < copValues.length; i++) {
            elecConsumption.push((gasConsumption[i] * 0.9) / copValues[i]);
        }
        return elecConsumption;
    }
    catch (error) {
        console.error(error);
    }
}
const res = await HPConsumption([10, 20, 30, 40, 50], [8, 8, 0, 5, 8], 749);
console.log(res);
export { heatPumpConsumption, HPConsumption };
