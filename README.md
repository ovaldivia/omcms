OMCMS - Simple PHP 7.1 CMS for News/Magazines
-

This is a simple CMS built from the ground-up to be easy to use and simple to maintain.

**Example**
http://worldfreightrates.news/

**Features**

- Responsive design for news/articles
- Fast image loading. Images optimize, and a low resolution version is shown first, so the pages loads faster.
- Higlight main news in desktop version
- Popular news column
- Popular videos column
- Flash news banner
- Password require administration Console
- Admin and Writer roles
- Developer view, where articles could be previewed
- Set article status: Production Deployed, Dev Deployed, Saved, Archived
- Article editing where tags, videos and HTML text can be added
- Saves images to AWS S3, optimizes, resize.
- Creates site map files

**Requirements**

PHP >7.1, Apache 2.* , Mysql >5, composer

PHP INI: short_open_tag must be enable

**Installation**

**_APP_**: Using composer:

_composer create-project ovaldivia/omcms omcms_

**_DB_**: Use the db/schema.sql to create the database on mysql

**_Upload folder_**: Create uploads folder

**_xmls folder_**: Create xmls folders

**_Robot.txt_**: Update the file with your domain name

**_Optional_**: Add google analytics and conversion scripts to:

- views/helpers/analytics.js.php
- views/helpers/conversion.js.php



**Admin Console**

/omcmsadmin
