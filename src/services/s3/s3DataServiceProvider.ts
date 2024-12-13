import {GetObjectCommand,ObjectCannedACL,PutObjectCommand,S3Client} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Config } from '../../config/s3Config'

interface Config {
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    },
    region: string,
    s3_bucket: string,
    expires: number,
    useAccelerateEndpoint?: boolean;
}

class S3FileService {

    config: Config;
    s3Client: S3Client;
    constructor() {
        this.config = {
            credentials: {
                accessKeyId: s3Config.access_key_id!,//! it must be not null
                secretAccessKey: s3Config.secret_access_key!
            },
            region: s3Config.buket_region!,
            s3_bucket: s3Config.bucket!,
            expires: 3600
        };
        this.s3Client = new S3Client(this.config);
    }

    // Generate upload presigned URL
    generateUploadPresignedUrl = async (fileKey: string, fileType: string) => {
        fileKey =  'attachments/' + fileKey;

        let acl: ObjectCannedACL = "private";

        const params = {
            Bucket: s3Config.bucket,
            Key: fileKey,
            ContentType: fileType,
            ACL: acl
        };

        try {
            const command = new PutObjectCommand(params);
            const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

            return { target_url: presignedUrl, file_key: fileKey };
        } catch (error) {
            throw error;
        }
    };

    generateDownloadPresignedUrl = async (fileKey: string) => {

        const params = {
            Bucket: s3Config.bucket,
            Key: fileKey
        };

        try {
            const command = new GetObjectCommand(params);
            const downloadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });


            return { download_url: downloadUrl };
        } catch (error) {
            throw error;
        }
    };

}

export default S3FileService;