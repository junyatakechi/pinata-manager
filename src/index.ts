import pinataSDK from "@pinata/sdk";
import dotenv from "dotenv";
dotenv.config();

//
const main = async function(){
    console.log(process.env.API_Key);
    const pinata = new pinataSDK("", "");
    // const res = await pinata.testAuthentication()
    // console.log(res)
}
main();