import 'dotenv/config';
import app from './app';
import imageClassificationRoutes from "./routes/imageClassification.routes";

const PORT = Number(process.env.PORT) || 5000;
app.use(
  "/api/image-classification",
  imageClassificationRoutes
);
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});