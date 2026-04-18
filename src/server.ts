import app from "./app";
import { envVars } from "./app/config/env";




// Start the server
const main = () => {
	try {
		app.listen(envVars.PORT, () => {
			console.log(`Server is running on http://localhost:${envVars.PORT}`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);
	}
}

main();