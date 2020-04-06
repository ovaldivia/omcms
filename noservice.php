<?php
    require __DIR__ . '/vendor/autoload.php';
    $dotenv = new \Dotenv\Dotenv(__DIR__ . '/config');
    $dotenv->overload();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title><?=env('APP_NAME')?></title>
    <style>
        body { text-align: center; padding: 150px; }
        h1 { font-size: 50px; }
        body { font: 20px Helvetica, sans-serif; color: #333; }
        article { display: block; text-align: left; width: 650px; margin: 0 auto; }
        a { color: #dc8100; text-decoration: none; }
        a:hover { color: #333; text-decoration: none; }
    </style>

</head>
<body>
<article>
    <h1><?=env('APP_NAME')?></h1>
    <div>
        <p>Este sitio no esta disponible en su país.</p>

    </div>
</article>
</body>
</html>



