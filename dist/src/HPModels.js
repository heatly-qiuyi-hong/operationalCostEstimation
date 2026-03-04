import axios from "axios";
async function getHPModels(manufacturerId) {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: "user=eyJhbGciOiJIUzI1NiIsImtpZCI6Ijk3MTNmN2UzLTJjN2QtNDcwZC04Mzk4LTM5MzE3NDAxNWM4ZCIsInR5cCI6IkpXVCIsInVzZSI6InNpZyJ9.eyJ1c2VySWQiOiI2NDkiLCJyb2xlSWQiOiI3IiwiYnVzaW5lc3NJZCI6Ijc0NiIsImxvY2FsZUlkIjoiMSIsImRvbWFpbiI6IjAiLCJwYWNrYWdlSWQiOiI0IiwibmJmIjoxNzcyNjE2NDAxLCJleHAiOjE3NzI2NTk2MDEsImlhdCI6MTc3MjYxNjQwMSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdCJ9.ZZyJc9su4mX-i97RY_MbV-rVnP5VV5x_LU4y-xDAhhI",
    };
    const params = {
        id: manufacturerId,
    };
    try {
        const response = await axios.get(`https://dev01.heatly.tech/v1/heatpump/manufacturer/${manufacturerId}/brief`, {
            params: params,
            headers: headers,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching heat pump models:", error);
        throw error;
    }
}
const res = await getHPModels(752);
console.log(res);
export default getHPModels;
