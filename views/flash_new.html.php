

<div class="container">
    <?include_once "views/helpers/messages.html.php"?>

    <form method="POST" id="formArticle" action="/admin/flash_new" class="mt-4 mb-4">
        <div class="form-group">
            <label for="title">Title</label>
            <input type="text" name="title" class="form-control" id="title" placeholder="Title" value="<?=htmlspecialchars($this->form->title)?>" required minlength="10" maxlength="69">
        </div>


        <div class="form-group">
            <label for="">Author:</label>
            <span style="font-weight: bold"><?=ucfirst($this->form->author)?></span>

        </div>


        <div class="form-group">
            <label for="content">Content</label>
            <textarea class="form-control" id="content" name="content" rows="2" required maxlength="800"><?=$this->form->content?></textarea>
        </div>
        <div>
            <button type="submit" class="btn btn-success">Save</button>
            &nbsp;<a href="/admin/flash_news">Back to list</a>
        </div>
        <input type="hidden" name="deleted" value="<?=$this->form->deleted?:0?>">
        <input type="hidden" name="id" value="<?=$_REQUEST['id']?:0?>">

    </form>
</div>





