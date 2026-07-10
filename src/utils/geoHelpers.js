export const toPostGISPoint = (lat, lng) => `POINT(${lng} ${lat})`

export const fromPostGISPoint = ({ lat, lng }) => ({ lat: Number(lat), lng: Number(lng) })
