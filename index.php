<?php

// Require composer autoloader
require __DIR__ . '/vendor/autoload.php';
use \App\Controllers\Main;
use \App\Controllers\Admin;
use \Dotenv\Dotenv;
use \Bramus\Router\Router;

//env
$dotenv = new Dotenv(__DIR__ . '/config');
$dotenv->load();

// Create Router instance
$router = new Router();

// Define routes
$router->set404(function() {
    header('HTTP/1.1 404 Not Found');
    $app = new Main();
    $app->_404Action();
    exit();
});

$router->get('/', '\App\Controllers\Main@homeAction');

$router->get('/page', '\App\Controllers\Main@paginationAction');

$router->get('/signup', '\App\Controllers\Main@signupAction');

$router->post('/signup', '\App\Controllers\Main@signupRegisterAction');

$router->get('/subscribirte-gracias', '\App\Controllers\Main@subscribeThanksAction');

$router->get('/teacher-of-the-deaf', '\App\Controllers\Main@filterTagAction');

$router->get('/assistive-technology-tools', '\App\Controllers\Main@filterTagAction');

$router->get('/deaf-education', '\App\Controllers\Main@filterTagAction');

$router->get('/american-sign-language', '\App\Controllers\Main@filterTagAction');

$router->get('/asl-supported-resources', '\App\Controllers\Main@filterTagAction');

$router->get('/tos', '\App\Controllers\Main@tosAction');

$router->get('/confirmed', '\App\Controllers\Main@confirmAction');

$router->get('/privacy', '\App\Controllers\Main@privacyAction');

$router->get('/about', '\App\Controllers\Main@aboutAction');

$router->get('/contact', '\App\Controllers\Main@contactAction');

$router->post('/contact', '\App\Controllers\Main@contactPostAction');

$router->get('/hash/[a-z0-9_-]+', '\App\Controllers\Main@filterHashAction');

$router->get('/categoria/[a-z0-9_-]+', '\App\Controllers\Main@categoryAction');

$router->get('/agregar', '\App\Controllers\Main@bookmarkAction');

$router->post('/schedule', '\App\Controllers\Admin@scheduleAction');

$router->post('/remove_schedule', '\App\Controllers\Admin@removeScheduleAction');

$router->get('/hash', '\App\Controllers\Main@hashAction');

$router->post('/hash', '\App\Controllers\Main@getHashAction');

$router->get('/omcmsadmin', '\App\Controllers\Admin@loginAction');

$router->post('/omcmsadmin', '\App\Controllers\Admin@loginCheckAction');

$router->get('/admin/logout', '\App\Controllers\Admin@logoutAction');

$router->get('/banner', '\App\Controllers\Admin@bannerAction');

$router->post('/banner', '\App\Controllers\Admin@bannerSaveAction');

$router->get('/admin/list', '\App\Controllers\Admin@listAction');

$router->get('/admin/logs', '\App\Controllers\Admin@logAction');

$router->get('/admin/reports', '\App\Controllers\Admin@reportsAction');

$router->get('/flash_news', '\App\Controllers\Main@flashNewsAction');

$router->get('/admin/flash_news', '\App\Controllers\Admin@flashNewsAction');

$router->get('/admin/flash_new', '\App\Controllers\Admin@editFlashNewsAction');

$router->get('/admin/flash_new_status', '\App\Controllers\Admin@changeStatusFlashNewsAction');

$router->post('/admin/flash_new', '\App\Controllers\Admin@saveFlashNewsSaveAction');

$router->get('/admin/next', '\App\Controllers\Admin@moveNextAction');

$router->get('/admin/previous', '\App\Controllers\Admin@movePreviousAction');

$router->get('/admin/edit', '\App\Controllers\Admin@editAction');

$router->get('/admin/profile', '\App\Controllers\Admin@profileAction');

$router->post('/admin/profile', '\App\Controllers\Admin@profileSaveAction');

$router->post('/admin/change_password', '\App\Controllers\Admin@changePasswordAction');

$router->post('/admin/edit', '\App\Controllers\Admin@saveAction');

$router->post('/admin/status', '\App\Controllers\Admin@changeStatusAction');

$router->get('/proxy', '\App\Controllers\Admin@proxyAction');

$router->get('/admin/imagelib', '\App\Controllers\Admin@imageLibAction');

$router->get('/admin/make_permanent', '\App\Controllers\Admin@makePermanentAction');

$router->get('/admin/remove_permanent', '\App\Controllers\Admin@removePermanentAction');

$router->post('/admin/imagelib', '\App\Controllers\Admin@imageLibSaveAction');

$router->get('/admin/delete_image', '\App\Controllers\Admin@deleteImageAction');

$router->post('/crop', '\App\Controllers\Admin@cropAction');

$router->post('/upload', '\App\Controllers\Admin@uploadAction');

$router->get('/[a-z0-9_-]+', '\App\Controllers\Main@newsAction');

// Run it!
$router->run();
