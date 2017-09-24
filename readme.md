## Functionality

The wayback crawler generates sequential PDF renderings of any given website archived in the [WayBack Machine](https://archive.org/web/). It uses the largest dominant screen size at the time the snapshot was taken according to statistics from the Nielsen Norman Group and StatCounter.

* 19.. - 2002: 800px*600px
* 2003 - 2008: 1024px*768px
* 2009 - 2011: 1440px*900px
* 2012 - 2015: 1920px*1080px

## Components

The web archive crawler requires [node.js](https://nodejs.org/) and [wkhtmltopdf](http://wkhtmltopdf.org/) in order to function.

`converter.command` is an [ImageMagick](http://www.imagemagick.org/script/index.php) script to batch convert the PDFs to raster PNG images. Alternatively, just use Photoshop's Image Processor script for more control.

## Usage

1. Open a terminal in this project's directory
2. Run the script with node as follows:
  * `node crawler.js www.google.com 19900000000000`
  * Dates are formatted according to the WayBack Machine's URL pattern like so:
    * `YYYYMMDDHHMMSS`
