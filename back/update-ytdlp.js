import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const updateFile = path.join(__dirname, ".ytdlp-update");

export function checkAndUpdateYtDlp() {
  try {
    const now = Date.now();
    const lastUpdate = fs.existsSync(updateFile) ? parseInt(fs.readFileSync(updateFile, "utf8")) : 0;
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    if (now - lastUpdate > weekMs) {
      console.log("📦 Updating yt-dlp...");
      execSync("npm update yt-dlp", { cwd: __dirname, stdio: "inherit" });
      fs.writeFileSync(updateFile, now.toString());
      console.log("✅ yt-dlp updated");
    }
  } catch (err) {
    console.error("⚠️  yt-dlp update failed:", err.message);
  }
}
