<?include_once "views/helpers/header.html.php"?>

<!-- Page title -->
<section class="">
    <div class="container">
        <div class="row space">
            <div class="col-md-12">
                <div class="page-title clearfix">
                    <div class="pull-left">
                        <h2><?=ucfirst($this->tag)?></h2>
                    </div>
                    <div class="pull-left">
                        <ol class="breadcrumb">
                            <li>
                                <a href="/" class="fas fa-home"> </a>
                            </li>

                            <li class="active" style="color:white;"><?=ucfirst($this->tag)?></li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Page Title Ends -->


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
<footer>
    <ul class="footlist">
        <li><a href="http://idrt.com/aboutIDRT.php" class="footlink"><b>About Us</b></a></li>
        <li><a href="/contact" class="footlink"><b>Contact Us</b></a></li>
        <li><a href="http://idrt.com/policies.php" class="footlink"><b>Policies</b></a></li>
    </ul><br>

    <p class="centeredtxt">©&nbsp;2019 Institute for Disabilities Research and Training, Inc. All Rights Reserved.<br>
        11323 Amherst Avenue, Wheaton, Maryland 20902<br>
        Phone or TTY: (301) 942-4326&nbsp;&nbsp;•&nbsp;&nbsp;FAX: (301) 942-4439<br>
        EMAIL: <a href="mailto:idrt@idrt.com" class="emaillink">idrt@idrt.com</a></p>
</footer>