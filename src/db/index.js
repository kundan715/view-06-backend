import monogoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";

dotenv.config();


const connectToDb = async () => {
    try {
        const connectionInstance = await monogoose.connect(process.env.monogodb_url + DB_NAME);
        console.log("connected to db");
        console.log("connection instance", connectionInstance.connection.host,
        connectionInstance.connection.port, connectionInstance.connection .name);

    }
    catch (error) {
        console.error("error connecting to db", error);
        process.exit(1); // Exit the process with a failure code
    }
}

export default connectToDb;