let fs = require('fs');

const readConfig = () => {
  let data = fs.readFileSync(process.env.DATA_FILE);
  if (data)
    return JSON.parse(data);
  else
    return {page: 0, number_of_connect_last_time: 0, total_connect:0}
}

const writeConfig = (data) => {
  var jsonContent = JSON.stringify(data);
  fs.writeFileSync(process.env.DATA_FILE, jsonContent);
}

exports.readConfig = readConfig;
exports.writeConfig = writeConfig;
