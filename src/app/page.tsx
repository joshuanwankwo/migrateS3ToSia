"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { downloadFromS3 } from "./utils/s3Utils";
import { downloadFromRentred, register, uploadToRenterd } from "./utils/siaUtils";
import { handleMigration } from "./utils/migrate";

export default function Migrate() {
  const [fileList, setFileList] = useState<any[]>([]);
  const [siafiles, setSiaFiles] = useState<any[]>([]);

  useEffect(() => {
    const getS3files = async () => {
      const files = await downloadFromS3();
      setFileList(files);
      const files2 = await downloadFromRentred();
      setSiaFiles(files2);
    };
    getS3files();
  }, []);

  const handleMigrate = async (file: string) => {
    handleMigration(file);
  };

  const handleFileInput = async (e: any) => {
      await uploadToRenterd(e.target.files[0]);  
  };

  return (
    <div>
      <h1>File Migration</h1>
      <button onClick={() => register()}>Register</button>
      <ul>
        {fileList.map((file) => (
          <li key={file.key}>
            <Image src={file.url} height={300} width={300} alt="Image from s3" />
            <button onClick={() => handleMigrate(file)}>Migrate</button>
          </li>
        ))}
      </ul>
      <h1>Sia renterd file</h1>
      <input type="file" name="" id="" onChange={handleFileInput} />
      <ul>
        {siafiles.map((file) => (
          <li key={file.name}>
            <Image
              src={file.url}
              height={300}
              width={300}
              alt="Image from s3"
            />
          </li>
        ))}
      </ul>

    </div>
  );
}
