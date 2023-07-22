import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, input) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);
    const inputPath = path.join(outputPath, `${jobId}.txt`); // New input file path
  
    return new Promise((resolve, reject) => {
      fs.writeFile(inputPath, input, (error) => {
        if (error) {
          reject(error);
        } else {
          exec(
            `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.exe < ${inputPath}`, // Use input file
            (error, stdout, stderr) => {
                fs.unlink(outPath, () => {}); // Remove the EXE file
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
  
  export default executeCpp;