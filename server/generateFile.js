import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content) => {
  const jobID = uuid();
  console.log('h11')
  const filename = `${jobID}.${format}`;
  console.log('h12')
  const filePath = path.join(dirCodes, filename);
  await fs.promises.writeFile(filePath, content);
  return filePath;
};

export default generateFile;