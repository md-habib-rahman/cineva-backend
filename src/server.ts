import app from "./app";




// Start the server
const main = () => {
	try {
		app.listen(5000, () => {
			console.log(`Server is running on http://localhost:5000`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);
	}
}

main();