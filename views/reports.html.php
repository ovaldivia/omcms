<div class="main">

    <h1>Artículos</h1>
    <div>
    <select id="typeReport" name="type">
        <option value="this_week" <?=($_REQUEST['type']=='this_week'?'selected':'')?>>This week</option>
        <option value="last_week" <?=($_REQUEST['type']=='last_week'?'selected':'')?>>Last week</option>
    </select>

    <select id="eventType" name="event">
        <option value="create_article" <?=($_REQUEST['event']=='create_article'?'selected':'')?>>Create Article</option>
        <option value="deploy_production" <?=($_REQUEST['event']=='deploy_production'?'selected':'')?>>Deploy Production</option>
    </select>

    </div>

    <div id="container" style="width: 75%;">
        <canvas id="myChart"></canvas>
    </div>

    <div style="margin-top: 30px;"><?=date("Y/m/d H:i:s", strtotime('-5 hours'))?> Pan</div>

</div>

