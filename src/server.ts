import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import rolesRoutes from "./handlers/role";

const corsOptions = {
  origin: "http://someotherdomain.com",
  OptionSuccessStatus: 200,
};
const app: express.Application = express();
const port: number = 3000;

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript");
});

rolesRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
