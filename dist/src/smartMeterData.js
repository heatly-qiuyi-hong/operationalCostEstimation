import axios from "axios";
async function smartMeterData(startTime = "2025-11-18T00:00:00", endTime = "2025-11-18T23:59:59") {
    const userId = "a1537c6d-d28d-4c7f-8df4-0504aac59492";
    const resouresId = {
        gasCost: "851ff122-83d7-41fc-88c5-ff46c6d8e9f7",
        gasConsumption: "6fa5d699-5555-4101-8e04-1e63070d92c5",
        electricityCost: "bcdabaa6-776a-4d38-96e0-708c4c257851",
        electricityConsumption: "b3eb8cd6-7847-437f-beb2-341109cd79d3",
    };
    const auth = {
        appKey: "0H7JaAOy2gKY8z9rHBnQ",
        appSecret: "RKCmHYaFFg7dN6B0GqBYTtf5Y2pCnx",
    };
    const params = {
        period: "PT1H",
        function: "sum",
        from: startTime,
        to: endTime,
        offset: 0,
    };
    const headers = {
        accpet: "application/json",
        userId: userId,
        resoureId: resouresId.gasConsumption,
        Authorization: `Basic ${Buffer.from(`${auth.appKey}:${auth.appSecret}`).toString("base64")}`,
    };
    async function getUser() {
        try {
            const response = await axios.get(`https://api.glowmarkt.com/api/v0-1/resource/${headers.resoureId}/readings`, {
                params: params,
                headers: headers,
            });
            // console.log(response.data.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
    const res = await getUser();
    // console.log(res.data);
    // console.log(res.data.length, "datapoints retrieved");
    return res;
}
// const energyData = await smartMeterData();
// console.log(energyData.data.map((d: any) => d[1]));
export default smartMeterData;
