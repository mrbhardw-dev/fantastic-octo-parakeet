import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export function generateSignedUploadParams() {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const params = {
    timestamp,
    folder: 'baile-fyi',
    transformation: 'c_limit,w_800,f_auto,q_auto',
  }
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!,
  )
  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder: 'baile-fyi',
  }
}
