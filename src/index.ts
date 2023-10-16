import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const dir = args[0] || __dirname;
const metaDataFolderPath = args[1] || __dirname;

const readJsonFilesFromFolder = (folderPath:string) => {
  const fileNames = fs.readdirSync(folderPath);
  return fileNames.map(fileName => {
    const filePath = path.join(folderPath, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
  });
};

const downloadFromIPFS = async (ipfsUrl:string, fileName:string, dir:string) => {
    console.log(ipfsUrl, fileName, dir);
//   try {
//     console.log(`Starting download for ${fileName} from ${ipfsUrl}`);
//     const hash = ipfsUrl.split('ipfs://')[1];
//     const response = await axios({
//       url: `https://ipfs.io/ipfs/${hash}`,
//       method: 'GET',
//       responseType: 'arraybuffer',
//     });
//     const buffer = Buffer.from(response.data, 'binary');
//     fs.writeFileSync(path.join(dir, fileName), buffer);
//     console.log(`Successfully downloaded ${fileName}`);
//   } catch (error) {
//     console.error(`Error downloading ${ipfsUrl}: ${error}`);
//     fs.appendFileSync('failedDownloads.txt', `Failed to download ${fileName} from ${ipfsUrl}. Error: ${error}\n`);
//   }
};

const main = async () => {
  console.log(`Files will be downloaded to: ${dir}`);
  const jsonDataArray = readJsonFilesFromFolder(metaDataFolderPath);

  for (const jsonData of jsonDataArray) {
    const { name, image, animation_url, avatar_url } = jsonData;

    await downloadFromIPFS(image, `${name}_image.png`, dir);
    await downloadFromIPFS(animation_url, `${name}_animation.mp4`, dir);
    await downloadFromIPFS(avatar_url, `${name}_avatar.vrm`, dir);
  }
};

main();
