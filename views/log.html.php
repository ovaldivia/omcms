<div class="main">
    <div><?=date("Y-m-d H:i:s", strtotime('-5 hours'))?> Pan</div>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">User</th>
            <th scope="col">Event</th>
            <th scope="col">Description</th>
            <th scope="col">Date</th>
        </tr>
        </thead>
        <tbody>

        <?foreach ($this->form->list as $item):?>
        <tr>
            <th scope="row"><?=ucfirst($item->username)?></th>
            <td><?=$item->event?></td>
            <td><?=$item->description?></td>
            <td><?= date("Y-m-d H:i:s", strtotime($item->add_date) - 60*60*5) ?></td>
        </tr>
        <?endforeach;?>
        </tbody>
    </table>

</div>
