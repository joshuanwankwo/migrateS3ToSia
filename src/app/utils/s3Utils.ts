import AWS from "aws-sdk";


//Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
  signatureVersion: "v4",
});

//Initialize S3
const s3 = new AWS.S3();

//Handles S3 file deletion
export const handleS3Delete = (key: string) => {
  console.log("Deleting file...");

  const params = {
    Bucket: "miuve",
    Key: key,
  };
  s3.deleteObject(params, (error) => {
    if (error) {
      console.error("Error deleting file:", error);
    } else {
      console.log("File deleted successfully");
    }
  });
};

//Handles S3 file upload
export const downloadFromS3 = async (): Promise<any[]> => {
  console.log("Downloading...");
  const params = {
    Bucket: "miuve",
  };

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const fileKeys: any = data.Contents?.map((file) => {
          return {
            key: file.Key,
            //This returns the file url(key) so we are making another request with each key to get the actual file content using a seperate function(convertUrlToFilePath) to make our code cleaner
            url: convertUrlToFile(file.Key),
            body: file,
          };
        });
        resolve(fileKeys);
        console.log("Done Downloading...");
      }
    });
  });
};

//handles S3 file upload
export const uploadToS3 = async (selectedFile: File) => {
  console.log("Uploading...");

  if (!selectedFile) {
    return;
  }
  try {
    const params = {
      Bucket: "miuve",
      Key: `${Date.now()}.${selectedFile.name}` || "",
      Body: selectedFile,
    };
    await s3.upload(params).promise();
    console.log("Done Uploading!");
  } catch (err) {
    console.log(err);
  }
};

//Gets file content based on the file key
export const convertUrlToFile = (key: any) => {
  const params = {
    Bucket: "miuve",
    Key: key,
  };
  const signedUrl = s3.getSignedUrl("getObject", params);
  return signedUrl;
};
