// logger middleware
export default function logging(request, response, next) {
  console.log(                        // Ausgabe aller Parameter mit Leerzeichen getrennt
      new Date().toISOString(),       // Datum im ISO-8601-Format
      request.method,                 // HTTP-Methode
      request.hostname,               // Value des Host-Request-Headers
      request.path,                   // URL-Pfad (alles nach Protokoll, Host und Port)
      request.socket.remoteAddress);  // Client IP(v4 oder v6, je nach listen-Call)
  next();                             // nächste middleware-function aufrufen
}