### Image manuell bauen
`docker build -t auth_express_js:latest .`

### Container mit gebautem Image ausführen + Umgebungsvariable
`docker run -d -p 8003:3000 -e audience='docker experts' auth_express_js`

### DB-Container mit Volume starten
`docker run --name medt-db -e MARIADB_ROOT_PASSWORD=4xhits_MEDT -v /C/tmp/mariadb_4xhits/data:/var/lib/mysql:Z -p 33306:3306 mariadb`

### DB-Container mit network:
`docker network create -d bridge medt-network`
`docker run --name medt-db -e MARIADB_ROOT_PASSWORD=4xhits_MEDT -v /C/tmp/mariadb_4xhits/data:/var/lib/mysql:Z -p 33306:3306 --network medt-network mariadb`