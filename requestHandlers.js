const queryString = require('querystring'),
  fs = require('fs'),
  formidable = require('formidable');

function start(res) {
  console.log('Request handler \'start\' was called.');

  const body =  '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="file" name="upload" />'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(body);
    res.end();
}

function upload(res, req) {
  console.log('Request handler \'upload\' was called.');

  const form = new formidable.IncomingForm();
  console.log('About to parse');
  form.parse(req, function(error, fields, files) {
    console.log('Parsing done.');

    fs.rename(files.upload.path, './tmp/child.jpeg', function(error) {
      if (error) {
        fs.unlink('./tmp/child.jpeg');
        fs.rename(files.upload.path, './tmp/child.jpeg');
      }
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`Received image: <br />`);
    res.write(`<img src='/show' />`)
    res.end();
  });
}

function show(res) {
  console.log('Request handler \'show\' was called.');
  res.writeHead(200, {'Content-Type': 'image/png'});
  fs.createReadStream('./tmp/child.jpeg').pipe(res);
}

exports.start = start;
exports.upload = upload;
exports.show = show;