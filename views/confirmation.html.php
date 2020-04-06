<?php

?>
<style>
    h1 {font-family: sans-serif, Verdana; font-size: 18pt; font-weight: bold}
    h2 {font-family: sans-serif, Verdana; font-size: 13pt; font-weight: bold}
    p {font-family: sans-serif, Verdana; font-size: 11pt;}

</style>

<?include_once "views/helpers/header.html.php"?>

<div class="container" style="
    width: 100%;
    margin-top: 62px;
    background-color: white; height: 600px;">

<?if (!empty($_REQUEST['rf']) && $_REQUEST['rf']=='2g23g2323322323'):?>
<h1 style="margin-left:10px; ">Thanks for confirming your subscription! </h1>

    <br>

    <p style="margin-left:10px; text-align: justify; ">

        Click here to download your FREE summer vocabulary SIGNO cards <a target="_blank" href="https://idrt-myasltech.s3.amazonaws.com/FREE+SignO+Summer+Themed+Template.pdf" download>here</a>

    </p>

<?else:?>
    <br>
    Invalid confirmation

<?endif?>

</div>



<?include_once "views/helpers/footer.html.php"?>
