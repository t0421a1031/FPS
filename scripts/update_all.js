import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting full data update workflow...");

try {
    console.log("\n[1/3] Fetching latest YouTube videos...");
    execSync('node ' + path.join(__dirname, 'youtube_fetcher.js'), { stdio: 'inherit' });

    console.log("\n[2/3] Fetching latest Gadget prices...");
    execSync('node ' + path.join(__dirname, 'gadget_fetcher.js'), { stdio: 'inherit' });

    console.log("\n[3/3] Analyzing tournament data for Rankings...");
    execSync('node ' + path.join(__dirname, 'ranking_updater.js'), { stdio: 'inherit' });

    console.log("\n✅ All data updated successfully!");
} catch (error) {
    console.error("❌ An error occurred during the update workflow:", error.message);
}
