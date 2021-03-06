<?php
namespace App\Services;
use App\Services\Service;
use App\Includes\S3;
use App\Includes\Utils;

class Articles extends Service {

    const DELETED_STATUS = 0;
    const SAVED_STATUS = 1;
    const DEPLOYED_DEV_STATUS = 2;
    const DEPLOYED_PROD_STATUS = 3;
    const ARCHIVED_STATUS = 4;

    //excluding autogenerated fields like add_date and last_updated
    const ARTICLE_FIELDS = array('url', 'title', 'tags','meta_keywords','meta_description','content','status','uid','date','id','large_image','thumb_image','order');

    function __construct(){
        parent::__construct();
    }

    public function loadList($filter = array()){

        $list = array();

        $where = $filter['where']?:'1';
        $order = $filter['order']?:'';
        $fields = $filter['fields']?:'*';
        $limit = $filter['limit']?:'';
        $offset = $filter['offset']?:'0';

        $pagination = '';

        if ($limit){

            $pagination = "LIMIT $limit OFFSET $offset";

        }

        $query = "SELECT $fields FROM articles WHERE $where $order $pagination";



        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){

                $obj = (object) $row;
                $obj->large_image_min = str_replace('.jpg','.min.jpg',$obj->large_image);
                $obj->thumb_image_min = str_replace('.jpg','.min.jpg',$obj->thumb_image);
                $list[] = $obj;
            }

        }
        mysqli_free_result($result);

        return $list;
    }


    public function addArticleCounter($articleId){

        $query = "UPDATE articles SET counter = counter + 1 WHERE id ='$articleId'";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

    }
    public function loadFlashNews(){

        $list = array();

        $query = "SELECT * FROM flash_news WHERE deleted = 0 ORDER BY add_date DESC";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){

                $obj = (object) $row;
                $list[] = $obj;
            }

        }

        return $list;
    }

    public function loadFlashNew($id){

        $obj = false;

        $query = "SELECT * FROM flash_news WHERE id = $id";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            $row = mysqli_fetch_array($result,MYSQLI_ASSOC);

            $obj = (object) $row;



        }

        return $obj;
    }

    //public function load

    public function loadImages($filter = array()){

        $list = array();

        $where = $filter['where']?:'1';
        $order = $filter['order']?:'';
        $fields = $filter['fields']?:'*';

        $paging = $filter['limit']?'LIMIT '.$filter['limit'] .($filter['offset']?' OFFSET '.$filter['offset']:'')  : '';

        $query = "SELECT $fields FROM images WHERE $where $order $paging";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){

                $obj = (object) $row;
                $list[] = $obj;
            }

        }
        mysqli_free_result($result);

        return $list;
    }

    public function loadCategories(){

        $list = array();


        $query = "SELECT * FROM categories order by category ASC";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){

                $obj = (object) $row;
                $list[] = $obj;
            }

        }
        mysqli_free_result($result);

        return $list;
    }


    public function loadImagesTotal($filter = array()){

        $obj = new \stdClass();

        $where = $filter['where']?:'1';

        $query = "SELECT count(*) as total FROM images WHERE $where  ";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            $row = mysqli_fetch_array($result,MYSQLI_ASSOC);


            $obj = (object) $row;


        }
        mysqli_free_result($result);

        return $obj;
    }


    public function load($id){

        $rtn = false;

        $query = "SELECT articles.*, (SELECT username FROM users WHERE users.uid = articles.uid ) author, (SELECT username FROM users WHERE users.uid = articles.reviewer_id ) reviewer FROM articles WHERE id = $id";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            $rtn = (object) $result->fetch_assoc();
        }
        mysqli_free_result($result);

        return $rtn;
    }

    public function loadByUrl($url){

        $rtn = false;

        $query = "SELECT *, (SELECT username FROM users WHERE users.uid = articles.uid ) author FROM articles WHERE url = \"$url\"";

        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            $rtn = (object) $result->fetch_assoc();

        }
        mysqli_free_result($result);

        return $rtn;
    }

    public function insert($form)
    {
        $id = false;

        if ($form) {

            unset($form->id);

            $query = 'INSERT INTO articles SET ' . $this->getFields($form, array('add_date','date')) ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);

            $id = mysqli_insert_id($this->conn);
        }

        return $id;
    }

    public function addImage($form){
        $id = false;

        if ($form) {

            $query = 'INSERT INTO images SET ' . $this->getFields($form, array('add_date')) ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);

            $id = mysqli_insert_id($this->conn);
        }

        return $id;
    }

    public function deleteImage($id){

        if ($id) {

            $query = 'DELETE FROM images WHERE id = ' . $id ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);
        }
    }

    public function update($id, $form){

        if ($form) {

            unset($form->uid);

            $query = 'UPDATE articles SET ' . $this->getFields($form) . ' WHERE id = ' . $id ;

            $result = mysqli_query($this->conn, $query);

            if ($result===false) throw new \Exception("DB Query problem:" . $query);
        }
    }

    public function save(&$form){

        $errors = $this->validate($form);

        if (count($errors)) return $errors;

        $form->last_updated = strftime("%Y-%m-%d %H:%M:%S", time());

        if ($form->_video_temp_file){
            $form->video_url = $this->uploadVideo($form->_video_temp_file);
        }

        if (isset($form->id) && is_numeric($form->id) && $form->id>0){

            $this->update($form->id, $form);

        }else{

            $form->id = $this->insert($form);

        }

        return $errors;
    }

    public function previousOrderRecord($id){
        return $this->getOrderRecord($id,false);
    }

    public function nextOrderRecord($id){
        return $this->getOrderRecord($id, true);
    }

    public function getHighestOrder(){
        return $this->getOrder(0,true) + 100;
    }

    public function getStatusName($status){

        $rtn = '';

        if ($status == self::DELETED_STATUS){
            $rtn = 'deleted';
        }elseif($status == self::SAVED_STATUS){
            $rtn = 'saved';
        }elseif($status == self::DEPLOYED_DEV_STATUS){
            $rtn = 'deployed to dev';
        }elseif($status == self::DEPLOYED_PROD_STATUS){
            $rtn = 'deployed to production';
        }elseif($status == self::ARCHIVED_STATUS){
            $rtn = 'archived';
        }

        return $rtn;

    }

    private function getOrder($excludeId=0, $max=true){
        $rtn = 100;

        $obj = $this->getOrderRecord($excludeId, $max);

        if ($obj!==false){
            $rtn = $obj->order;
        }

        return $rtn;
    }

    private function getOrderRecord($excludeId=0, $max=true){
        $rtn = false;

        $order = $max? 'max(`order`)':'min(`order`)';

        $where = '';
        if ($excludeId && $max){
            //next
            $where = " select max(`order`) from articles where  `order` < (select `order` from articles  WHERE id = $excludeId) ";
        }elseif ($excludeId && !$max){
            //previous
            $where = " select min(`order`) from articles where  `order` > (select `order` from articles  WHERE id = $excludeId) ";
        }else
            $where = "select $order from articles";

        $query = "select id, `order` from articles where `order` = ($where) limit 1";
        $result = mysqli_query($this->conn, $query);

        if ($result===false) throw new \Exception("DB Query problem:" . $query);

        $rows = mysqli_num_rows($result);

        if ($rows){
            $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
            $rtn = (object) $row;
        }
        mysqli_free_result($result);

        return $rtn;
    }

    private function uploadVideo($filepath){

        $video_url = false;

        $root = dirname(dirname(__FILE__));

        require_once $root."/includes/S3.php";

        $s3 = new S3(env('AWS_ACCESS_KEY_ID'), env('AWS_ACCESS_SECRET'));

        $newVideoName = uniqid('video').'.mp4';

        $uri = 'videos/' . $newVideoName;

        if($s3->putObjectFile($filepath , env('AWS_OMCMS_BUCKET') , $uri, S3::ACL_PUBLIC_READ, array(),'video/mp4')
        ){
            $video_url = 'https://s3.amazonaws.com/'. env('AWS_OMCMS_BUCKET').'/'.$uri;
        }

        unlink($filepath);

        return $video_url;
    }

    private function validate($form){

        $errors = array();

        if (!$form->url)
            $errors[] = 'URL cannot be empty';

        if (!$form->title)
            $errors[] = 'Title cannot be empty';

        if (strlen($form->url)>100)
            $errors[] = 'Title cannot larger than 100 chars';

        if (strlen($form->url)>100)
            $errors[] = 'URL cannot larger than 100 chars';

        if (preg_match('/[^a-zA-Z0-9\-]/s',$form->url)){
            $errors[] = 'Invalid characters in the url. Only alphanumeric characters and hyphen(-) are allowed';
        }

        if (trim($form->tags)=='')
            $errors[] = 'You must include at least one tag';

        if (!$form->meta_keywords)
            $errors[] = 'Meta keywords cannot be empty';

        if (!$form->meta_description)
            $errors[] = 'Meta description cannot be empty';

        if (strlen($form->meta_keywords)>200)
            $errors[] = 'Meta keywords cannot larger than 200 chars';

        if (strlen($form->meta_description)>200)
            $errors[] = 'Meta description cannot larger than 200 chars';

        if (!$form->content)
            $errors[] = 'Content cannot be empty';

        if (!$form->status)
            $errors[] = 'Status cannot be empty';

        if (!$form->uid)
            $errors[] = 'User id cannot be empty';

        if (!$form->date)
            $errors[] = 'Article date cannot be empty';

        if (!$form->thumb_image || !$form->large_image)
            $errors[] = 'You must upload the article images';

        if ($form->_video_temp_file && $form->_video_temp_type!='video/mp4')
            $errors[] = 'Video must be mp4.';

        if ($form->_video_temp_file && filesize($form->_video_temp_file) > 5242880)
            $errors[] = 'Video must be less than 5MB';



        if (!Utils::is_date($form->date))
            $errors[] = 'Article date is invalid';

        $otherObj = $this->loadByUrl($form->url);

        if ($otherObj!==false && ($form->id!=$otherObj->id))
            $errors[] = 'URL is already used by another article';

        return $errors;
    }
}