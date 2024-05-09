import { diskStorage } from 'multer';
// import { join } from 'path';
import { tmpdir } from 'os';

export const defaultMulterConfig = {
  storage: diskStorage({
    destination: tmpdir(),
    filename: (req, file, callback) => {
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  }),
};

export const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 2; // 2MiB
export const DOCUMENT_MIME_TYPES = /(text|application)/;
export const IMAGE_MIME_TYPES = /image\/(apng|gif|jpeg|png|svg\+xml|webp)/;
