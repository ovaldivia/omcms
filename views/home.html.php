

<?include_once "views/helpers/header.html.php"?>

<?foreach  ($this->articles as $article):?>
<div id="whiteboxhome">
    <section style="display:block;float:left;width:28%">
        <img src="<?= $article->thumb_image?>" alt="" style="margin-left: 20px; border-radius: 5px;" class="img-fluid d-block mx-auto" width="100%">
    </section>

    <section style="display:block;float:left;width:63%;margin-left: 5%;">

        <h1><a href="/<?= $article->url?>"><?= $article->title?></a></h1>
        <section style=" margin-top: 20px;">

            <p><?= $article->meta_description?></p>

            <p style="position: absolute; bottom: 20px; right:33px;"><a href="/<?= $article->url?>" class="redlink" style=" margin: 0px;"><b>More</b></a></p>
        </section>

    </section>
</div>
<?endforeach;?>

<?include_once "views/helpers/footer.html.php"?>
