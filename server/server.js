import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import { generateResponse } from "./src/services/ai.service.js";

connectToDB();

generateResponse()

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
