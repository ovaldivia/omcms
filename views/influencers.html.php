<nav class="navbar navbar-expand-lg menunav nav-section bg_primary desktop-display">
    <div class="container alinear">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="/"><i class="fas fa-home"></i> <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/novedades">Novedades</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/entretenimiento">Entretenimiento</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/deportes">Deportes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/juegos">Juegos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/lifestyle">Lifestyle</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/influencers">Influencers</a>
                </li>

            </ul>
            <!-- <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form> -->

            <div id="wrap">
                <form action="" autocomplete="on">
                    <input id="search" name="search" type="text" placeholder="Buscar...">
                    <!-- <input id="search_submit" value="Rechercher" type="submit"> -->
                    <button class="searchbutton "><i class="fas fa-search"></i> </button>
                </form>
            </div>

        </div>

    </div>
</nav>
<!-- Page title -->
<section class="desktop-display">
    <div class="container">
        <div class="row space">
            <div class="col-md-12">
                <div class="page-title clearfix">
                    <div class="pull-left">
                        <h2>Instagram</h2>
                    </div>
                    <div class="pull-left">
                        <ol class="breadcrumb">
                            <li>
                                <a class="fas fa-home"> </a>
                            </li>
                            <li>
                                <a href="#">Categoria</a>
                            </li>
                            <li class="active">Influencers</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Page Title Ends -->
<section class="desktop-display">
    <div class="container">
        <div class="row">
            <!-- article featured -->
            <div class="col col-12 col-lg-8 category-content-inner clearfix">
                <div class="article-featured">
                    <figure>
                        <a href="/<?=$this->instagram[0]->url?>">
                            <div class="img-featured">
                                <img src="<?= $this->instagram[0]->large_image?>" alt="" class="img-fluid">
                            </div>
                        </a>
                        <figcaption>
                            <p class="cat-featured">Instagram</p>
                            <h2><a href="/<?=$this->instagram[0]->url?>"><?=$this->instagram[0]->title?></a></h2>
                            <p class="news-meta">
                                <span class="news-date"><?= date_format( date_create($this->instagram[0]), $this->formatDate)?></span>
                            </p>
                        </figcaption>
                        <div class="overlay"></div>
                    </figure>
                </div>
                <!-- Article Featured Ends -->
                <!-- category single -->
                <?$total = count($this->instagram);?>
                <?$i = 0;?>
                <?while ($i<$total):?>
                <div class="row">
                    <?$article=$this->instagram[$i++];?>
                    <?if ($article):?>
                    <div class="col-sm-6">

                            <div class="category-single-news">
                                <a href="/<?=$article->url?>">
                                    <div class="image-category">
                                        <img src="<?= $article->thumb_image?>" alt="" class="img-fluid">
                                    </div>
                                </a>
                                <h3><a href="/<?=$article->url?>"><?= $article->title?></a></h3>
                                <p class="news-meta"><span class="news-date"><?= date_format( date_create($article->add_date), $this->formatDate)?></span></p>
                                <p class="news-excerpt"><?= $article->meta_description?></p>
                                <a href="/<?=$article->url?>" class="btn btn-primary">Leer más</a>
                            </div>

                    </div>
                    <?endif;?>

                    <?$article=$this->instagram[$i++];?>
                    <?if ($article):?>
                    <div class="col-sm-6">

                            <div class="category-single-news">
                                <a href="/<?=$article->url?>">
                                    <div class="image-category">
                                        <img src="<?= $article->thumb_image?>" alt="" class="img-fluid">
                                    </div>
                                </a>
                                <h3><a href="/<?=$article->url?>"><?= $article->title?></a></h3>
                                <p class="news-meta"><span class="news-date"><?= date_format( date_create($article->add_date), $this->formatDate)?></span></p>
                                <p class="news-excerpt"><?= $article->meta_description?></p>
                                <a href="/<?=$article->url?>" class="btn btn-primary">Leer más</a>
                            </div>

                    </div>
                    <?endif;?>
                </div>
                <?endwhile;?>
                <!-- ends category single -->
            </div>
            <!-- sidebar -->
            <div class="col col-12 col-lg-4 category-content-sidebar">
                <div class="noti-widget noti-section clearfix">
                    <div class="noti-news">
                        <h2 class="widget-title">Nuevas</h2>
                        <div class="fn-content clearfix text-justify">
                            <div class="row">
                                <?for ($i=0; $i < 3; $i++ ):?>
                                    <?$article = $this->instagram[$i]?>
                                    <div class="col-sm-6 col-xs-6">
                                        <div class="img-noti-widget">
                                            <img src="<?= $article->thumb_image?>" alt="" class="img-fluid">
                                        </div>
                                        <h3><a href="<?=$article->url?>">
                                                <?=$article->title?></a>
                                        </h3>
                                    </div>
                                <?endfor;?>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- RRSS -->
                <?include "views/helpers/social.html.php"?>
                <!-- RRSS ends -->
            </div>
        </div>
        <!-- end sidebar -->
    </div>
    </div>
</section>
<!-- Page title -->
<section class="desktop-display">
    <div class="container">
        <div class="row space">
            <div class="col-md-12">
                <div class="page-title clearfix">
                    <div class="pull-left">
                        <h2>youtube</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Page Title Ends -->
<!-- Page Title Ends -->
<section class="desktop-display">
    <div class="container">
        <div class="row">
            <!-- article featured -->
            <div class="col col-12 col-lg-8 category-content-inner clearfix">
                <div class="article-featured">
                    <figure>
                        <a href="/<?= $this->youtube[0]->url?>">
                            <div class="img-featured">
                                <img src="<?= $this->youtube[0]->large_image?>" alt="" class="img-fluid">
                            </div>
                        </a>
                        <figcaption>
                            <p class="cat-featured">youtube</p>
                            <h2><a href="/<?= $this->youtube[0]->url?>"><?=$this->youtube[0]->title?></a></h2>
                            <p class="news-meta">
                                <span class="news-date"><?= date_format( date_create($this->youtube[0]->add_date), $this->formatDate)?></span>
                            </p>
                        </figcaption>
                        <div class="overlay"></div>
                    </figure>
                </div>
                <!-- Article Featured Ends -->
                <!-- category single -->
                <?$total = count($this->youtube);?>
                <?$i = 0;?>
                <?while ($i<$total):?>
                <div class="row">
                    <?$article=$this->youtube[$i++];?>
                    <?if ($article):?>
                    <div class="col-sm-6">

                        <div class="category-single-news">
                            <a href="/<?=$article->url?>">
                                <div class="image-category">
                                    <img src="<?= $article->thumb_image?>" alt="" class="img-fluid">
                                </div>
                            </a>
                            <h3><a href="/<?=$article->url?>"><?= $article->title?></a></h3>
                            <p class="news-meta"><span class="news-date"><?= date_format( date_create($article->add_date), $this->formatDate)?></span></p>
                            <p class="news-excerpt"><?= $article->meta_description?></p>
                            <a href="/<?=$article->url?>" class="btn btn-primary">Leer más</a>
                        </div>

                    </div>
                    <?endif;?>

                    <?$article=$this->youtube[$i++];?>
                    <?if ($article):?>
                    <div class="col-sm-6">

                        <div class="category-single-news">
                            <a href="/<?=$article->url?>">
                                <div class="image-category">
                                    <img src="<?= $article->thumb_image?>" alt="" class="img-fluid">
                                </div>
                            </a>
                            <h3><a href="/<?=$article->url?>"><?= $article->title?></a></h3>
                            <p class="news-meta"><span class="news-date"><?= date_format( date_create($article->add_date), $this->formatDate)?></span></p>
                            <p class="news-excerpt"><?= $article->meta_description?></p>
                            <a href="/<?=$article->url?>" class="btn btn-primary">Leer más</a>
                        </div>

                    </div>
                    <?endif;?>
                </div>
                <?endwhile;?>
                <!-- ends category single -->
            </div>
            <!-- sidebar -->
            <div class="col col-12 col-lg-4 category-content-sidebar">
                <div class="noti-widget noti-section clearfix">
                    <div class="noti-news">
                        <h2 class="widget-title">Nuevos</h2>
                        <div class="fn-content clearfix text-justify">
                            <div class="row">
                                <?for ($i=0; $i < 3; $i++ ):?>
                                    <?$article = $this->youtube[$i]?>
                                    <div class="col-sm-6 col-xs-6">
                                        <div class="img-noti-widget">
                                            <img src="<?= $article->thumb_image?>" alt="" class="img-fluid">
                                        </div>
                                        <h3><a href="/<?=$article->url?>">
                                                <?=$article->title?></a>
                                        </h3>
                                    </div>
                                <?endfor;?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end sidebar -->
    </div>
    </div>
</section>
<!-- Page title -->
<div class="main mobile-display">

    <h2 class="mt-3">Instagram</h2>
    <div class="mt-4 row text-center text-lg-left">

        <?foreach ($this->instagram as $article):?>
            <div class="col-lg-3 col-md-4 col-xs-6 notinews-thumb" style="">
                <div class="background-blur jArticle" data-article="/<?=$article->url?>" style="background-image: url('<?= $article->thumb_image_min?>');height: 100%; width: 100%; background-size:cover;border-radius: 8px;">
                </div>
                <div class="content" style="border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">
                    <?$tags = ($article->tags?explode(',',$article->tags):array())?>
                    <div class="categories"><?foreach ($tags as $tag):?><span class="category"><?=$tag?></span>&nbsp;<?endforeach;?></div>

                    <h2><a href="/<?=$article->url?>"><?=$article->title?></a></h2>
                </div>
            </div>
        <?endforeach;?>

        <div class="col-lg-3 col-md-4 col-xs-6 notinews-thumb" style="">
            <div class="background" style="background: grey;height: 100%; width: 100%; border-radius: 8px;">

                <a class="more-info" style="color: white;" href="/influencers/instagram">&plus; Más Artículos</a>
            </div>

        </div>

    </div>


    <h2 class="mt-3">Youtube</h2>

    <div class="mt-4 row text-center text-lg-left">

        <?foreach ($this->youtube as $article):?>
            <div class="col-lg-3 col-md-4 col-xs-6 notinews-thumb" style="">
                <div class="background-blur jArticle" data-article="/<?=$article->url?>" style="background-image: url('<?= $article->thumb_image_min?>');height: 100%; width: 100%; background-size:cover;border-radius: 8px;">
                </div>
                <div class="content" style="border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">
                    <?$tags = ($article->tags?explode(',',$article->tags):array())?>
                    <div class="categories"><?foreach ($tags as $tag):?><span class="category"><?=$tag?></span>&nbsp;<?endforeach;?></div>

                    <h2><a href="/<?=$article->url?>"><?=$article->title?></a></h2>
                </div>
            </div>
        <?endforeach;?>

        <div class="col-lg-3 col-md-4 col-xs-6 notinews-thumb" style="">
            <div class="background" style="background: grey;height: 100%; width: 100%; border-radius: 8px;">

                <a class="more-info" style="color: white;" href="/influencers/youtube">&plus; Más Artículos</a>
            </div>

        </div>

    </div>



</div>
<!-- /.container -->

