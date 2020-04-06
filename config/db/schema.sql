CREATE DATABASE IF NOT EXISTS omcms;

CREATE TABLE IF NOT EXISTS `articles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `url` varchar(100) NOT NULL,
  `thumb_image` varchar(100) NOT NULL,
  `large_image` varchar(100) NOT NULL,
  `video_url` varchar(100) NOT NULL DEFAULT '',
  `tags` varchar(100) NOT NULL,
  `meta_keywords` varchar(200) NOT NULL DEFAULT '',
  `meta_description` varchar(200) NOT NULL DEFAULT '',
  `countries` varchar(1000) NOT NULL DEFAULT '',
  `title` varchar(100) NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_bin,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `counter` int NOT NULL DEFAULT 0,
  `order` int DEFAULT 0 NOT NULL,
  `uid` int NOT NULL,
  `date` DATETIME NOT NULL,
  `last_updated` DATETIME NOT NULL,
  `reviewer_id` int DEFAULT 0 NULL,
  `permanent` tinyint(4) NOT NULL DEFAULT '0',
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `add_date` (`add_date`),
  KEY `url` (`url`),
  KEY `order` (`order`),
  KEY `status` (`status`),
  KEY `tags` (`tags`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `schedule_deployment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `article_id` bigint(20) NOT NULL,
  `uid` int NOT NULL,
  `deployment_time` int NOT NULL,
  `deployed` tinyint(4) NOT NULL DEFAULT '1',
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `add_date` (`add_date`),
  KEY `article_id` (`article_id`),
  KEY `deployed` (`deployed`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `banners` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_bin,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `order` int DEFAULT 50 NOT NULL,
  `uid` int NOT NULL,
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `add_date` (`add_date`),
  KEY `order` (`order`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `images` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `url` varchar(100) NOT NULL,
  `category` varchar(20) NOT NULL,
  `keywords` varchar(500) NOT NULL,
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `url` (`url`),
  KEY `category` (`category`),
  KEY `keywords` (`keywords`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users` (
  `uid` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(50) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `profile_image` varchar(100) NOT NULL,
  `permission` tinyint(4) NOT NULL DEFAULT '1',
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `change_password` tinyint(4) NOT NULL DEFAULT '0',
  `locked` tinyint(4) NOT NULL DEFAULT '0',
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `audit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL,
  `event` varchar(50) NOT NULL,
  `description` varchar(800) NOT NULL,
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event` (`event`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  `order` tinyint(4) NOT NULL DEFAULT '0',
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `flash_news` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(800) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO users(username, password, first_name, last_name, permission, email,profile_image) VALUES ('flash', SHA1('flashpwd'), 'flash_manager', 'flash_manager', 3, 'flash@yopmail.com','/assets/image/no-photo-large.png');
INSERT INTO users(username, password, first_name, last_name, permission, email,profile_image) VALUES ('admin', SHA1('adminpwd'), 'admin', 'admin', 2, 'admin@yopmail.com','/assets/image/no-photo-large.png');
INSERT INTO users(username, password, first_name, last_name, permission, email,profile_image) VALUES ('writer', SHA1('writerpwd'), 'Writer', 'Writer', 1, 'writer@yopmail.com','/assets/image/no-photo-large.png');


INSERT INTO categories(category) VALUES ("Novedades");
INSERT INTO categories(category) VALUES ("Entretenimiento");
INSERT INTO categories(category) VALUES ("Juegos");
INSERT INTO categories(category) VALUES ("Deportes");
INSERT INTO categories(category) VALUES ("Lifestyle");
INSERT INTO categories(category) VALUES ("Cultura");

INSERT INTO categories(category) VALUES ("Influencers");


--update users set profile_image="/assets/image/no-photo-large.png";
--alter table users add column `profile_image` varchar(100) NOT NULL;
--alter table users add column `email` varchar(50) NOT NULL;

--alter table images add column `category` varchar(20) NOT NULL;
--alter table images add column `keywords` varchar(500) NOT NULL;

--alter table articles add column `permanent` tinyint(4) NOT NULL DEFAULT '0';