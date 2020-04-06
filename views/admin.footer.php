<script>

    function changeStatus(id, status, banner){
        $('<form method="POST" action="/admin/status"><input type="hidden" name="banner" value="'+(banner?'true':'false')+'"><input type="hidden" name="id" value="'+id+'"><input type="hidden" name="status" value="'+status+'"></form>').appendTo('body').submit();

    }

    function updateQueryString(key, value, url) {
        if (!url) url = window.location.href;
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
            hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null)
                return url.replace(re, '$1' + key + "=" + value + '$2$3');
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
        }
        else {
            if (typeof value !== 'undefined' && value !== null) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
            else
                return url;
        }
    }

    $(function(){
        $(".jDeploy").click(function(){
           var self = $(this);
           var status = self.data('status');
           var id = self.data('id');
           var banner = self.data('banner');

           changeStatus(id, status, banner);
        });

        $('.jCheckedReviewer').click(function () {
            var checked = this.checked;

            if (checked){
                $('.jDeployProd').prop('disabled', false);
            }else{
                $('.jDeployProd').prop('disabled', true);
            }
        });

        $(".jRestore").click(function(){
            var self = $(this);
            var id = self.data('id');
            var banner = self.data('banner');
            changeStatus(id, 1, banner);
        });

        $('#reviewerModal').on('show.bs.modal', function (e) {
            var self = $(this);
            var origin = $(e.relatedTarget);
            self.data('id', origin.data('id'));
            self.data('status', origin.data('status'));
        });

        $('#reviewerModal').on('hide.bs.modal', function (e) {
            var self = $(this);
            self.data('id', '');
            self.data('status', '');
            $('.jDeployProd').prop('disabled', true);
            $('#reviewerChecked').get(0).checked = false;
        });

        $('#deployArticle').click(function () {
            var id = $('#reviewerModal').data('id');
            var status = $('#reviewerModal').data('status');
            $('#reviewerModal').modal('hide');
            changeStatus(id, status);
        })


        $('#deleteModal').on('show.bs.modal', function (e) {
            var self = $(this);
            var origin = $(e.relatedTarget);
            self.data('id', origin.data('id'));
            self.data('banner', origin.data('id'));
        });

        $('#deleteModal').on('hide.bs.modal', function (e) {
            var self = $(this);
            self.data('id', '');
            self.data('banner', '');
        });

        $('.jNext').click(function(){
            var self = $(this);
            var id = self.data('id');
            var banner = self.data('banner');

            if (!banner){

                document.location = "/admin/next?id=" + id;
            }
        });

        $('.jPrevious').click(function () {
            var self = $(this);
            var id = self.data('id');
            var banner = self.data('banner');

            if (!banner){

                document.location = "/admin/previous?id=" + id;
            }

        });

        $('.jPermanent').click(function () {
            var self = $(this);
            var id = self.data('id');

            if (id){
                document.location = "/admin/make_permanent?id=" + id;
            }

        });

        $('.jRemovePermanent').click(function () {
            var self = $(this);
            var id = self.data('id');

            if (id){
                document.location = "/admin/remove_permanent?id=" + id;
            }

        });

        $('#bannerModal').on('show.bs.modal', function (e) {
            var self = $(this);
            var origin = $(e.relatedTarget);
            var id =  origin.data('id');
            self.data('id', id);
            $('#bannerHeader').val('Add Banner');
            $('#orderDiv').hide();

            if (id){
                $('#bannerHeader').val('Edit Banner');
                $('#orderDiv').show();
                $.ajax({
                    url: "/banner?id=" + id,
                    method: 'GET',
                    dataType: 'json',
                    success: function(response){
                        if (response.success){
                            $('#bannerName').val(response.name);
                            $('#bannerType').val(response.type);
                            $('#bannerCode').val(response.code);
                            $('#bannerOrder').val(response.order);

                        }else{
                            alert("There was an error, please try again. " + response.errors);
                        }
                    },
                    error: function(){
                        alert("There was an error, please try again.");
                    }
                });

            }

        });

        $('#saveBanner').click(function(){

            var data = {
                name: $('#bannerName').val(),
                content: $('#bannerCode').val(),
                type: $('#bannerType').val(),
                order: $('#bannerOrder').val(),
                id: $('#bannerModal').data('id')
            };


            $.ajax({
                url: "/banner",
                method: 'POST',
                dataType: 'json',
                data: data,
                success: function(response){
                    if (response.success){
                        document.location = '/admin/list';

                    }else{
                        $('#bannerMessage').html(response.errors);

                    }
                },
                error: function(){
                    $('#bannerMessage').html("There was an error, please try again.");
                }
            });



        });

        $('#bannerModal').on('hide.bs.modal', function (e) {
            var self = $(this);
            self.data('id', '');
            $('#bannerName').val("");
            $('#bannerType').val("");
            $('#bannerCode').val("");
            $('#bannerOrder').val("");
        });

        $("#deleteArticle").click(function(){

            var id = $('#deleteModal').data('id');
            var banner = $('#deleteModal').data('banner');

            changeStatus(id, '0', banner);
        });

        $("#searchButton").click(function(){
            var status = '';
            var search = $('#searchText').val().toLowerCase() ||'';
            search = encodeURIComponent(search);

            $('.jFilterStatus').each(function (i,obj) {
                if (obj.checked){
                    status += "&status[]=" + obj.value;
                }
            });

            document.location = "/admin/list?s=" + search + status;
        });

        $('.jFilterStatus').click(function () {
            var obj = $(this);
            if (!obj.get(0).checked){

                if($('.jFilterStatus:checked').length==0){

                    alert("At least one filter should be checked");

                    obj.prop('checked', true);

                }

            }

        })

        $('#scheduleModal').on('show.bs.modal', function (e) {
            var self = $(this);
            var origin = $(e.relatedTarget);
            var id =  origin.data('id');
            self.data('id', id);
        });

        $('#scheduleModal').on('hide.bs.modal', function (e) {
            var self = $(this);
            self.data('id', '');
        });



        $('#scheduleArticle').click(function () {
            var id = $('#scheduleModal').data('id');

            var data = {
                'day'  : $('#scheduleDay').val(),
                'id' : id,
                'time' : $('#scheduleHour').val() + ':' +  $('#scheduleMin').val() + ' ' + $('#scheduleLate').val()
            };

            $.ajax({
                url: "/schedule",
                method: 'POST',
                dataType: 'json',
                data: data,
                success: function(response){
                    if (response.success){
                        document.location = '/admin/list';

                    }else{
                        $('#scheduleError').html(response.errors);

                    }
                },
                error: function(){
                    $('#scheduleError').html("There was an error, please try again.");
                }
            });

        });

        $('#removeScheduleModal').on('show.bs.modal', function (e) {
            var self = $(this);
            var origin = $(e.relatedTarget);
            var id =  origin.data('id');
            $('#scheduledDate').html(origin.data('scheduled'));
            self.data('id', id);
        });

        $('#removeScheduleModal').on('hide.bs.modal', function (e) {
            var self = $(this);
            self.data('id', '');
            $('.jDeployProd').prop('disabled', true);
        });

        $('.jNextPage').click(function(){

            var currentOffset = $(this).data('offset');

            var url = window.location.href;

            var nextOffset = currentOffset+40;

            url = updateQueryString('offset', nextOffset  , url);

            document.location = url;


        });

        $('.jPreviousPage').click(function(){

            var currentOffset = $(this).data('offset');

            var url = window.location.href;

            var previousOffset = currentOffset-40;

            if (previousOffset<0) previousOffset = 0;

            url = updateQueryString('offset', previousOffset  , url);

            document.location = url;


        });


        $('#removeSchedule').click(function () {
            var id = $('#removeScheduleModal').data('id');

            var data = {
                'id' : id
            };

            $.ajax({
                url: "/remove_schedule",
                method: 'POST',
                dataType: 'json',
                data: data,
                success: function(response){
                    if (response.success){
                        document.location = '/admin/list';

                    }else{
                        $('#removeScheduleError').html(response.errors);

                    }
                },
                error: function(){
                    $('#removeScheduleError').html("There was an error, please try again.");
                }
            });

        });

    });
</script>