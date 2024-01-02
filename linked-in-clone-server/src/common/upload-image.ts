import { diskStorage } from 'multer';
import { CONSTANTS, CONSTANT_STRINGS } from './constant';

export const saveImageConfig = {
  storage: diskStorage({
    destination: './user-profile-pictures/',
    filename: (err, file, cb) => {
      const fileName = Date.now() + '-' + file.originalname;
      console.log('saved');

      cb(null, fileName);
    },
  }),
  fileFilter(req, file, callback) {
    const validFileMimeTypes = CONSTANTS.validFileMimeTypes;
    const error = new Error(CONSTANT_STRINGS.unacceptableFileType);
    return validFileMimeTypes.includes(file.mimetype) ? callback(null, true) : callback(error, false);
  },
};
