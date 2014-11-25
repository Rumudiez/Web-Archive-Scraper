var wkhtmltopdf = require('wkhtmltopdf');
var http = require('http');
var mkdirp = require('mkdirp');

var date = 19920000000000; // 1992 January 1st 00:00:00
var site = process.argv[2]; // first passed argument
if (process.argv[3]) { // second passed argument
  if (process.argv[3] > 19900000000000) {
    var date = process.argv[3];
    console.log("Starting from " + date + ".");
  } else { console.log("Please provide a date newer than 19900000000000 (1990 00/00 00:00:00)."); return; }
} else { console.log("Starting from 1992.") }

if (site) {
  // Create directory for generated content
  mkdirp(process.cwd() + "/" + site, function (err) {
    if (err) {
      console.error(err)
    } else {
      console.log("Using directory at " + process.cwd() + "/" + site);
      console.log("Crawling archive.org for " + site + "...");
      init(date);
    }
  });
} else {
  console.log("Please provide a valid URL to crawl.");
  return;
}

function init(date) {
/*
Date.prototype.myMethod = function() {
    this.getUTCYear();
}
*/
  if (date <= 20141124000000) { // don't bother trying to look into the future
    var path = "/wayback/available?url=" + site + "&timestamp=" + date;
    checkArchive(path);
  } else {
    console.log("Finished!")
    return;
  }
}

function checkArchive(path) {
  var options = {
    host: 'archive.org',
    port: 80,
    path: path,
    method: 'GET'
  };

  http.request(options, function(res) {
    // console.log("status: " + res.statusCode);
    // console.log("headers: " + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      createSnapshot(JSON.parse(chunk));
    });
  }).end();
}

function createSnapshot(chunk) {
  var timestamp = chunk.archived_snapshots.closest.timestamp;
  if (chunk.archived_snapshots.closest.available) {
    if (timestamp >= date - 15000000) { // if timestamp is more recent than 15d prior to this date
      var name = site + "/" + timestamp + ".pdf";
        
      var screen = {
        width: 480,
        height: 270
      } // 1920x1080
      if (date < 20030101000000) { // until 2002
        screen.width = 200;  // 800px
        screen.height = 150; // 600px
      } else if (date < 20090101000000) { // until 2008
        screen.width = 256; // 1024px
        screen.height = 192; // 768px
      } else if (date < 20120101000000) { // 2012 January 1
        screen.width = 360; // 1440px
        screen.height = 225; // 900px
      }
      screen.height = 270; // force screen height to 1080 for editing

      date = parseInt(timestamp) + 100000000; // +1m 0d 00:00:00
      wkhtmltopdf(chunk.archived_snapshots.closest.url, {
        B: 0,
        L: 0,
        R: 0,
        T: 0,
        pageWidth: screen.width,
        pageHeight: screen.height,
        userStyleSheet: "uass.css",
        output: name
      }, function(err) {
        if (err) {
            console.log(err);
            init(date);
        } else {
          console.log("Created " + name);
          init(date);
        }
      });
      // init(date); // Disable the immediately above line and enable this one for testing
    } else {
      console.log("No snapshot available for " + date + ". Continuing...");
      date = parseInt(date) + 5000000; // +5d 00:00:00
      init(date);
    }
  } else {
    console.log("No snapshots found :(");
    return;
  }
}
