<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title><?=$this->pageTitle?> :: <?=env("APP_NAME")?></title>
    <? $this->renderHeader()?>


    <?include_once "views/helpers/analytics.js.php"?>
    <?include_once "views/helpers/googleads.js.php"?>
    <?include_once "views/helpers/conversion.js.php"?>

</head>

<body>



<div id="wrapper">
<? $this->renderView()?>
</div>

<? $this->renderFooter()?>
<?if ($this->success || $this->errors):?>
<script>
    setTimeout(function(){
        $('.jSuccessMessage, .jErrorMessage').fadeOut('slow').hide();
    },9000)
</script>
<?endif?>

</body>

</html>
