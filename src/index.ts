import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const dir = args[0] || __dirname;
const metaDataFolderPath = args[1] || __dirname;

const readJsonFilesFromFolder = (folderPath:string) => {
  const fileNames = fs.readdirSync(folderPath);
  const jsonDataArray = fileNames.map(fileName => {
    const filePath = path.join(folderPath, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
  });
  return [fileNames, jsonDataArray];
};

const downloadFromIPFS = async (gatewayUrl: string, ipfsUrl:string, fileName:string, dir:string) => {
  try {
    console.log(`Starting download for ${fileName} from ${ipfsUrl}`);
    const hash = ipfsUrl.split('ipfs://')[1];
    const response = await axios({
      url: `${gatewayUrl}/${hash}`,
      method: 'GET',
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data, 'binary');
    fs.writeFileSync(path.join(dir, fileName), buffer);
    console.log(`Successfully downloaded ${fileName}`);
  } catch (error) {
    console.error(`Error downloading ${ipfsUrl}: ${error}`);
    fs.appendFileSync('failedDownloads.txt', `Failed to download ${fileName} from ${ipfsUrl}. Error: ${error}\n`);
  }
};

const main = async () => {
  const gateway =  process.env.Gateway_URL as string;
  console.log(`Files will be downloaded to: ${dir}`);
  const [fileNames, jsonDataArray] = readJsonFilesFromFolder(metaDataFolderPath);

  for (let i=0; i<fileNames.length; i++) {

    const { name, image, animation_url, avatar_url } = jsonDataArray[i];

    await downloadFromIPFS(gateway, image, `${fileNames[i]}.png`, dir);
    await downloadFromIPFS(gateway, animation_url, `${fileNames[i]}.mp4`, dir);
    await downloadFromIPFS(gateway, avatar_url, `${fileNames[i]}.vrm`, dir);
  }
};

main();
