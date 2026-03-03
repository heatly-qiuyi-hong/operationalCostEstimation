import axios from "axios";
async function getManufacturers() {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: "user=eyJhbGciOiJIUzI1NiIsImtpZCI6Ijk3MTNmN2UzLTJjN2QtNDcwZC04Mzk4LTM5MzE3NDAxNWM4ZCIsInR5cCI6IkpXVCIsInVzZSI6InNpZyJ9.eyJ1c2VySWQiOiI2NDkiLCJyb2xlSWQiOiI3IiwiYnVzaW5lc3NJZCI6Ijc0NiIsImxvY2FsZUlkIjoiMSIsImRvbWFpbiI6IjAiLCJwYWNrYWdlSWQiOiI0IiwibmJmIjoxNzcyNTQ2ODI0LCJleHAiOjE3NzI1OTAwMjQsImlhdCI6MTc3MjU0NjgyNCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdCJ9.SBx6sXYQxEJzIibU2Uq9YPGT9joi4R162bsc2KI8gMU",
    };
    try {
        const response = await axios.get("https://dev01.heatly.tech/v1/heatpump/manufacturer", {
            headers: headers,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching manufacturers:", error);
        throw error;
    }
}
// const res = await getManufacturers();
// console.log(res);
export default getManufacturers;
