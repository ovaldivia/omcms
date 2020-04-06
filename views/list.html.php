 <?foreach ($this->list as $article):?>
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
 <?if (count($this->list)):?>
     <script>reloadClass('background-blur');</script>
 <?endif;?>





