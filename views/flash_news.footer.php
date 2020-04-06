<script>

    $(function(){
        $('#activeFlashNews').click(function () {
            document.location = '/admin/flash_news'
        });

        $('#deletedFlashNews').click(function () {
            document.location = '/admin/flash_news?del=1'
        });

    })
</script>