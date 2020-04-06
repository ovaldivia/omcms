<script>

    var preloader = new Image() ;
    preloader.src = '/assets/image/ajax-loader-large.gif' ;

    function isMobile(){
        return $(this).width() <= 550;
    }

    function showMoreButton(){
        if (isMobile() && thereAreMore){
            $('#loadMore').show();
        }else{
            $('#loadMore').hide();
        }
    }

    function reloadClass(className) {

        $('.' + className).each(function () {
            var self = $(this);
            var url = self.css('background-image');
            url = url.replace('.min.jpg','.jpg').replace(/"|\(|\)/g,'').replace('url','');
            var tmpImg = new Image() ;
            tmpImg.src = url ;
            tmpImg.onload = function() {
                self.css('background-image','url('+url+')');
                self.removeClass(className);
            } ;
        });
    }



    function loadArticle(offset){
        $.ajax({
            url: "/page?limit=8&tag=<?=$this->tag?>&offset=" + offset,
            beforeSend: function () {
                $('#loaderPage').show();
                $('#loadMore').hide();
            },
            type:'GET',
            complete: function () {
                $('#loaderPage').hide();
                showMoreButton();
            },
            success: function(html){

                if (html.trim()==''){
                    thereAreMore = false;
                    showMoreButton();
                }

                else
                    $("#listEnd").append(html);
            }
        });
        return false;
    }

    var offset = 20;
    var thereAreMore = true;

    $(function () {

        reloadClass('background-blur');
        
        $('.jArticle').click(function () {
            var url = $(this).data('article');

            document.location = url;
        });

        $(window).resize(function () {
            showMoreButton();
        });

        $(window).scroll(function(){
            if  (!isMobile() && ($(window).scrollTop() == $(document).height() - $(window).height()) && thereAreMore){
                loadArticle(offset);
                offset+=8;
            }
        });

        $('#loadMore').click(function () {
            loadArticle(offset);
            offset+=8;
        });

        showMoreButton();
    })
</script>
