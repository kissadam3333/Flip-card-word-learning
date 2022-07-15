// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fs = require('fs');

export default function handler(req, res) {
  if (req.method === 'POST') {
    writeToJson(req.body);
    res.status(200).json({ 'succes': true });
  }
  else if (req.method === 'DELETE') {
    deleteFromJsonByTimestamp(req.body.timeStamp);
    //res.status(200).json({ 'succes': true });
  }
  else {
    res.status(200).json(readFromJson());
  }
}


//helper functions
const readFromJson = () => {
  return JSON.parse(fs.readFileSync('./tempDb.json', 'utf8'));
};
const writeToJson = (data) => {
  const current = readFromJson();
  current.push(data);
  fs.writeFileSync('./tempDb.json', JSON.stringify(current));
}
const deleteFromJsonByTimestamp = (timestamp) => {
  let current = readFromJson();
  current = current.filter(e => e.timeStamp !== timestamp);
  fs.writeFileSync('./tempDb.json', JSON.stringify(current));
}
