import { Injectable } from '@nestjs/common';
import { PathLike } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {
  getDestinationPath() {
    return join(__dirname, '../../storage/photos');
  }

  async upload(photo: Express.Multer.File, filename: string) {
    try {
      const path: PathLike = join(this.getDestinationPath(), filename);

      await writeFile(path, photo.buffer);

      return path;
    } catch {
      return false;
    }
  }
}
