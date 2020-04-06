<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js"></script>
<script>

    $(function(){

        var ctx = document.getElementById("myChart");



        var barChartData = {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],

            datasets: [
            <?$prefix = ''?>
            <?foreach ($this->report as $user=>$report):?>
            <?=$prefix?>
            {
                label: '<?=ucfirst($user)?>',
                backgroundColor: '#<?=stringToColorCode($user)?>',
                borderColor: 'rgb(47, 99, 87)',
                borderWidth: 1,
                data: [
                    <?=$report->monday?>,
                    <?=$report->tuesday?>,
                    <?=$report->wednesday?>,
                    <?=$report->thursday?>,
                    <?=$report->friday?>,
                    <?=$report->saturday?>,
                    <?=$report->sunday?>
                ]
            }
            <?$prefix = ','?>
            <?endforeach;?>

            ]

        };

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) { if (Number.isInteger(value)) { return value; } },
                            stepSize: 1
                        }
                    }]
                }
            }
        });


        $('#typeReport').change(function(){
            var type = $(this).val();
            var event = $('#eventType').val();

            document.location = '/admin/reports?type='+type + '&event=' + event;
        });

        $('#eventType').change(function(){
            var type = $('#typeReport').val();
            var event = $(this).val();

            document.location = '/admin/reports?type='+type + '&event=' + event;
        });
    })
</script>