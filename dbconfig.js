require("mssql/msnodesqlv8");

var config = {
    database: 'WEPPO-Project',
    server: 'localhost',
    port: 1433,
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
}

module.exports = config;