<?if ($this->totalRecords):?>
<div style="clear:left;">
    <nav aria-label="Pages">
        <ul class="pagination">
            <li class="page-item <?=($this->page==1)?'disabled':''?>" ><a class="page-link" href="<?=($this->page==1)?'#':'/admin/imagelib?cat='.$_REQUEST['cat'].'&p='. ($this->page-1)?>">Previous</a></li>
            <?for ($i=1 ; $i <= $this->totalPages; $i++):?>
                <li class="page-item <?=($this->page==$i?'active':'')?>"><a class="page-link" href="/admin/imagelib?cat=<?=$_REQUEST['cat']?>&p=<?=$i?>"><?=$i?></a></li>
            <?endfor;?>
            <li class="page-item <?=($this->page==$this->totalPages)?'disabled':''?>"><a class="page-link" href="<?=($this->page==$this->totalPages)?'#':'/admin/imagelib?cat='.$_REQUEST['cat'].'&p='. ($this->page+1)?>">Next</a></li>
        </ul>
    </nav>
</div>

<?endif?>