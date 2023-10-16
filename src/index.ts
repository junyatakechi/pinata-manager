import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// コマンドライン引数を取得（Node.jsの実行パスとスクリプトのファイルパスを除く）
const args = process.argv.slice(2);

// 最初の引数をダウンロード先ディレクトリとして使用
const dir = args[0] || __dirname;

// JSONデータの例（本当はファイルから読み込む）
const jsonData = [
    {
      name: "Metaani GEN#09514",
      image: "ipfs://QmbwFruhuCU6aUuihXurorE5or5kooPocGDCQTo4KGEHXH",
      animation_url: "ipfs://QmbwFruhuCU6aUuihXurorE5or5kooPocGDCQTo4KGEHXH",
      avatar_url: "ipfs://QmbwFruhuCU6aUuihXurorE5or5kooPocGDCQTo4KGEHXH",
    }
    // 他の999個のJSONデータ
  ];

const downloadFromIPFS = async (ipfsUrl: string, fileName: string, dir:string) => {
  try {
    console.log(`Starting download for ${fileName} from ${ipfsUrl}`);
    const hash = ipfsUrl.split('ipfs://')[1];
    const response = await axios({
      url: `https://ipfs.io/ipfs/${hash}`,
      method: 'GET',
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data, 'binary');
    fs.writeFileSync(path.join(dir, fileName), buffer);
    console.log(`Successfully downloaded ${fileName}`);
  } catch (error) {
    console.error(`Error downloading ${ipfsUrl}: ${error}`);
  }
};

const main = async () => {
  console.log(`Files will be downloaded to: ${dir}`);

  for (const data of jsonData) {
    const { name, image, animation_url, avatar_url } = data;

    await downloadFromIPFS(image, `${name}_image.png`, dir);
    await downloadFromIPFS(animation_url, `${name}_animation.mp4`, dir);
    await downloadFromIPFS(avatar_url, `${name}_avatar.vrm`, dir);
  }
};

main();
