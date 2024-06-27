const fs = require("fs");
const yargs = require("yargs");

const argv = yargs
  .usage("Usage: $0 [filename]")
  .help("h", "Display help information")
  .alias("h", "help")
  .describe("filename", "Name of the file to write to").argv;

const fileName = argv.filename || "default.txt"; // Default filename if none provided

const fileHistoryPath = "file_history.txt"; // Path for storing file history

// Function to check if a file exists
function fileExists(filePath) {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      resolve(!err); // File exists if no error
    });
  });
}

async function writeToFile(fileName) {
  const fileExistsCheck = await fileExists(fileName);

  if (fileExistsCheck) {
    console.error(
      `File '${fileName}' already exists. Please enter a new filename:`
    );
    const newFileName = await promptForFilename();
    return writeToFile(newFileName); // Recursively call to write to new file
  }

  // Write "You are awesome!" to the new file
  fs.writeFile(fileName, "You are awesome!", (err) => {
    if (err) {
      console.error("Error writing to file:", err.message);
    } else {
      console.log(`Successfully wrote to file: ${fileName}`);
      // Append filename to file history
      fs.appendFileSync(fileHistoryPath, `${fileName}\n`);
    }
  });
}

// Function to prompt user for filename
function promptForFilename() {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readline.question("Enter new filename: ", (newFileName) => {
      readline.close();
      resolve(newFileName);
    });
  });
}

// Load file history (optional, for reference)
let fileHistory;
try {
  fileHistory = fs.readFileSync(fileHistoryPath, "utf8").split("\n");
} catch (err) {
  // Handle potential errors during history loading (e.g., file not found)
  console.warn("Error loading file history:", err.message);
  fileHistory = []; // Create an empty array if loading fails
}

// Main execution
writeToFile(fileName);
