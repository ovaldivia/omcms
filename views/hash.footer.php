

<script>

    function getHash(){

        var data = {
            'text' : $('#hashInput').val().trim()
        };

        if (!data.text){
            alert("String cannot be emty!")
            return;
        }

        $.ajax({
            url: '/hash',
            type: 'POST',
            cache: false,
            dataType: 'json',
            async: true,
            data: data,

            success: function (response) {
                if (response && response.success) {
                    $('#hashResult').html(response.hash);
                } else if (response.errors) {
                    alert(response.errors);
                }
            },
            error: function () {
                alert("There was an error. Please try again.");

            }
        });

    }


    $(function(){
        $('#getHash').click(function(){

            getHash();
        });

    })





</script>
