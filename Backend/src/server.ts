import app from "./app";
import connectToDatabase from "./db/db";
import seedData from "./db/seedData";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDatabase();
    await seedData();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
