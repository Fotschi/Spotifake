// logger middleware
export default function logging(request, response, next) {
  console.log(
      new Date().toISOString(),
      request.method,
      request.hostname,
      request.path,
      request.socket.remoteAddress);
  next();
}
