// executeJava.js
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filepath, input) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.class`); // Use .class file extension
  const inputPath = path.join(outputPath, `${jobId}.txt`); // New input file path

  return new Promise((resolve, reject) => {
    fs.writeFile(inputPath, input, (error) => {
      if (error) {
        reject(error);
      } else {
        exec(
          `javac ${filepath} -d ${outputPath} && cd ${outputPath} && java ${jobId} < ${inputPath}`, // Use .class file and provide correct classpath
          (error, stdout, stderr) => {
            fs.unlink(outPath, () => {}); // Remove the .class file
            fs.unlink(inputPath, () => {});
            if (error) {
              reject({ error, stderr });
            }
            if (stderr) {
              reject(stderr);
            }
            resolve(stdout);
          }
        );
      }
    });
  });
};

export default executeJava;