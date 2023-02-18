const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
client.on("error", function (err) {
  console.log("Error " + err);
});
client.on('connect', function () {
  console.log('redis is connected!');

});
const setValue = async (key, value, expire) => {
  if (expire) {
    client.expire(key, expire)
    return await client.set(key, value, 'EX', expire);
  } else {
    return await client.set(key, value);
  }
};

const getValue = async (key) => {
  let val = await client.get(key);
  return val;
};
const getAll = async () => {
  const keys = await client.keys("*");
  if(keys.length > 0) {
    return await client.mget(keys);
  }else {
    return [];
  }

}
const deleteValue = async (key) => {
  let val = await client.del(key);
  return val;
};
module.exports = {
  setValue,
  getValue,
  deleteValue,
  getAll
}