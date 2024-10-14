
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const app = express();
const ip = '172.16.2.113'

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const httpPort = 8001; // Update to desired HTTP port
const httpsPort = 8081; // Update to desired HTTPS port

const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'selfsigned.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'selfsigned.crt'))
};

app.get('/get_wafer_number', async (req, res) => {
    const body = req.query;
    var con = mysql.createConnection({
        host: "172.16.2.16",
        user: "sdroot",
        password: "cmisd032018",
        database: "tpc_prod_dbs"
    });
    var con2 = mysql.createConnection({
        host: "172.16.2.16",
        user: "sdroot",
        password: "cmisd032018",
        database: "tpc_dbs"
    });
    const assignment_id = body.assignment_id;
    const SubPid = body.SubPid;
    const parts_number = body.parts_number;
    const revision_number = body.revision_number;
    const lot_number = body.lot_number;
    const line_number = body.line_number;
    const operator_number = body.operator_number;
    const sequence_number = body.sequence_number;

    con.connect(function (err) {
        if (err) throw err;
        const sql = "SELECT t1.*, t2.hadan FROM tpc_prod_dbs.`tpc_main_tbl` t1 LEFT JOIN tpc_dbs.`setup_sub_process_tbl` t2 ON t2.SubPid = t1.SubPid WHERE t1.`assignment_id` = ? AND t1.`item_parts_number` = ? AND t1.`revision_number` = ? AND t1.`lot_number` = ? AND t1.`sequence_number` < ? AND t1.`tpc_sub_status` = 'Done' AND t2.`hadan` = '1' ORDER BY t1.`main_prd_id` DESC LIMIT 1";
        con.query(sql, [assignment_id, parts_number, revision_number, lot_number, sequence_number], function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            if (result.length > 0) {
                const sql2 = "SELECT * FROM `batch_process_wafer_tbl` WHERE `parts_number` = ? AND `revision_number` = ? AND `lot_number` = ? AND `SubPid` = ? ORDER BY `batch_wafer_id` DESC";
                con2.query(sql2, [result[0].item_parts_number, result[0].revision_number, result[0].lot_number, result[0].SubPid], function (err2, result2, fields2) {
                    if (err2) throw err2;
                    console.log(result2);
                    res.json({ success: true, message: 'Wafer Number has been successfully fetched!', data: result2 });
                    con2.destroy();
                });
                con.destroy();
            } else {
                con.destroy();
            }

        });
    });
})

app.use((req, res, next) => {
    if (req.secure) {
        // Request was via https, so do no special handling
        next();
    } else {
        // Request was via http, so redirect to https
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
});
http.createServer(app).listen(httpPort, ip, () => {
    console.log(`HTTP Server listening on http://${ip}:${httpPort}`);
});

// Create HTTPS server
https.createServer(options, app).listen(httpsPort, ip, () => {
    console.log(`HTTPS Server listening on https://${ip}:${httpsPort}`);
});

// // Start the server
// server.listen(port, ip, () => {
//     console.log(`Server running at http://${ip}:${port}`);
// });
