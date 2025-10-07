const NotFoundImage = '/images/notFound.jpg';

export interface ImageObject {
  path: string;
  [key: string]: unknown;
}

export type ImageInput = string | ImageObject | ImageObject[];

function isImageDefined(image: unknown): image is ImageObject {
  return typeof image === 'object' && image !== null && 'path' in image;
}

export function get_path_img(image: ImageInput | undefined | null): string {
  if (!image || image === '[]' || JSON.stringify(image) === '[]') {
    return NotFoundImage;
  }

  if (typeof image === 'string') {
    try {
      const parsed = JSON.parse(image);
      const first = Array.isArray(parsed) ? parsed[0] : parsed;
      if (first?.path) {
        return check_path_string(first.path);
      }
    } catch {
      // ignore JSON parse error
    }

    return check_path_string(image);
  }

  // Nếu là array, lấy phần tử đầu
  if (Array.isArray(image) && image.length > 0) {
    image = image[0];
  }

  if (isImageDefined(image)) {
    return check_path_string(image.path);
  }

  return NotFoundImage;
}

function check_path_string(path: string): string {
  if (!path || path === '[]') return NotFoundImage;

  const replace_media = process.env.NEXT_PUBLIC_REPLACE_MEDIA || '/media/';
  const replace_files = process.env.NEXT_PUBLIC_REPLACE_FILE || '/files/';
  const baseUrl = process.env.NEXT_PUBLIC_URL_IMAGE || '';

  if (path.includes(replace_media)) {
    return baseUrl + replace_media + path.split(replace_media)[1];
  }

  if (path.includes(replace_files)) {
    return baseUrl + replace_files + path.split(replace_files)[1];
  }

  if (path.startsWith('media/') || path.startsWith('files/')) {
    return baseUrl + '/' + path;
  }

  return path;
}
