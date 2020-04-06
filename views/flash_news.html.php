<div class="main">
    <?include_once "views/helpers/messages.html.php"?>
    <br>
    <?if ($this->isAdmin || $this->isFlashManager):?><a href="/admin/flash_new" class="btn btn-primary" style="color:white;">Add Flash News</a><?endif?>

    <br> <br>

    <div style="display: block;margin-left: 20px;">
        <input type="radio" name="status" class="form-check-input jFilterStatus" id="activeFlashNews" value="0" <?if (!$_REQUEST['del']):?>checked<?endif?>> Active &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input type="radio" name="status" class="form-check-input jFilterStatus" id="deletedFlashNews" value="1" <?if ($_REQUEST['del']):?>checked<?endif?>> Deleted
    </div>


    <table class="table">
        <thead>
        <tr>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
            <th scope="col">User</th>
            <th scope="col"></th>
        </tr>
        </thead>
        <tbody>

        <?foreach ($this->form->list as $item):?>
        <tr>

            <td><a href="/admin/flash_new?id=<?=$item->id?>"><?=$item->title?></a></td>
            <td><?=$item->add_date?></td>
            <td scope="row"><?=ucfirst($item->username)?></td>
            <td>
                <?if ($this->isAdmin || $this->isFlashManager):?>
                    <?if (!$item->deleted):?>
                        <a href="/admin/flash_new_status?s=1&id=<?=$item->id?>">Del</a>
                    <?else:?>
                        <a href="/admin/flash_new_status?s=0&id=<?=$item->id?>">Restore</a>
                    <?endif?>
                <?endif?>
            </td>
        </tr>
        <?endforeach;?>
        </tbody>
    </table>

</div>
