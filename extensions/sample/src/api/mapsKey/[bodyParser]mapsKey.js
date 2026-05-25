export default async function mapsKey(request, response) {
  return response.json({ key: process.env.GOOGLE_MAPS_API_KEY || '' });
}
