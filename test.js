const qiniu = require("qiniu")

// key
var accessKey = 'dmHYf5fDxzyku-IMginXaWje9BvjQqHclf6bU2gq';
var secretKey = '-J6OIjdTsG-L36J1n2h78zZOm_5tinYyqZBiT1uL';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// token
var options = {
  scope: "cloud-obj",
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);


var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;

var localFile = '/Users/dengwenlong/Desktop/数据库语句.md';
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var key='数据库语句.md';
// 文件上传
formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
  respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }

  if (respInfo.statusCode === 200) {
    console.log(respBody);
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
});
  
// 文件下载
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var publicBucketDomain = 'http://qqdllutlg.hd-bkt.clouddn.com';
// 公开空间访问链接
var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
console.log(publicDownloadUrl); 