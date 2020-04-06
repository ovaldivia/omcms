
<link href="//vjs.zencdn.net/7.3.0/video-js.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/videojs-playlist-ui@3.5.2/dist/videojs-playlist-ui.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/videojs-playlist-ui@3.5.2/dist/videojs-playlist-ui.vertical.css">
<link rel="stylesheet" href="../assets/css/scroller.css">

<script src="//vjs.zencdn.net/7.3.0/video.min.js"></script>
<script src="https://unpkg.com/videojs-playlist@4.2.6/dist/videojs-playlist.js"></script>
<script src="https://cdn.jsdelivr.net/npm/videojs-playlist-ui@3.5.2/dist/videojs-playlist-ui.js"></script>
<script src="https://cdn.jsdelivr.net/npm/videojs-flash@2/dist/videojs-flash.min.js"></script>
<script src="../assets/javascript/WellScroller.min.js"></script>

 <?include_once "views/helpers/header.html.php"?>

<!-- Page title -->
<section class=" desktop-display">
    <div class="container">
        <div class="row space">
            <div class="col-md-12">
                <div class="page-title clearfix">
                    <div class="pull-left">
                        <h2>
                            <?=ucfirst($this->form->tags)?>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Page Title Ends -->
<section class="<? if($this->form->tags === 'NOVEDADES') { echo 'Novedades'; } elseif ($this->form->tags === 'DEPORTES') {echo 'deportes';} echo ' desktop-display' ?>">
    <div class="container" style="width: 960px;">
        <div class="row" style="background: white;">
            <div class="col col-12 col-lg-12 post-content">
                <article>
                    <h1>
                        <?=$this->form->title?>
                    </h1>
                    <p class="news-meta"><span class="news-author"><i class="fa fa-user"></i>
                            <?= ucfirst($this->form->author)?></span> - <span class="news-date"><i class="fas fa-calendar-alt"></i>
                            <?= date_format( date_create($this->form->date), $this->formatDate)?></span></p>
                    <p>
                        <?=$this->form->content?>
                    </p>
                </article>
            </div>

        </div>
    </div>
</section>

<section class="">


    <div class="container" style="width: 960px;">
        <div class="row">


                <div class="galerias-uno" style="padding:0 ">
                    <h2 class="galeria-tittle">Recent</h2>
                    <div class="row">
                        <?foreach ($this->ultimos as $article):?>
                            <div class="col-sm-3 galeria-post" style="">
                                <div class="post-img">
                                    <a href="/<?=$article->url?>">
                                        <img src="<?=$article->thumb_image?>" alt="" class="img-fluid">
                                    </a>
                                </div>
                                <h3>
                                    <a href="/<?=$article->url?>">
                                        <?= $article->title?>
                                    </a>
                                </h3>
                            </div>
                        <?endforeach;?>
                    </div>
                </div>

	    </div>
<!--
            <div class="col-4">
                <img class="publicidad" src="/assets/image/336x280-publicidad-aqui.jpg">
                <br><br>
                <img class="publicidad" src="/assets/image/336x280-publicidad-aqui.jpg">
            </div>
-->
        </div>
    <?include_once "views/helpers/footer.html.php"?>
    </div>



</section>


<script>
    var options = {
        fluid: true
    };

    var player = videojs('my-player', options, function onPlayerReady() {
        videojs.log('Your player is ready!');

        // In this context, this is the player that was created by Video.js.
        // this.play();

        // How about an event listener?
        this.on('ended', function() {
            videojs.log('Awww...over so soon?!');
        });

    });
    player.playlist([
        <?foreach ($this->popularVideos as $video):?>
        {
        name: 'Todo sobre el Comic-Con Panamá 2018',
        sources: [
            { src: '<?=$video->video_url?>', type: 'video/mp4' }
        ],
        // you can use <picture> syntax to display responsive images
        thumbnail: [
            {
                srcset: '<?=$video->thumb_image?>',
                type: 'image/png',
                media: '(min-width: 600px;)'
            },
            {
                src: '<?=$video->thumb_image?>'
            }
        ]
        }
        <?endforeach;?>
    ]);
    // Initialize the playlist-ui plugin with no option (i.e. the defaults).
    player.playlistUi({
        className: 'video-play'
    });
    wellScroller(document.querySelector('.scrollBox'), {
        scrollDownBtn : document.querySelector('.scrollDown')
    });


    // $('.vjs-playlist-thumbnail ').append ('<div class= "overlay"></div>')



</script>
