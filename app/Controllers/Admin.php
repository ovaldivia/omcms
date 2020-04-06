<?php
namespace App\Controllers;

use \App\Includes\Utils;
use \App\Includes\Setup;
use \App\Includes\S3;
use \App\Includes\FileUpload;
use App\Controllers\Controller;
use App\Services\Audit;
use App\Services\FlashNews;
use App\Services\Reports;
use App\Services\Banner;
use App\Services\Articles;
use App\Services\Schedules;
use App\Services\User;

class Admin extends Controller{

    function __construct(){
        parent::__construct();
        Setup::startSession();
        $this->mainLayout = 'layouts/admin.layout.php';
        $this->auditObject = new Audit();
        $this->id = $this->getInt('id')?:'';
        $this->uid = $_SESSION && isset($_SESSION['uid'])?$_SESSION['uid']:0;

        $this->home = '/';

        if (!empty($_SESSION['permission'])){
            $this->permission = $_SESSION['permission'];
            $this->isAdmin = $this->permission == 2;
            $this->isFlashManager = $this->permission == 3;
        }
    }

    public function loginAction(){
        $this->view = "views/login.html.php";
        $this->render();
    }

    public function loginCheckAction(){

        $form = $this->getLoginFormRequest();

        $obj = $this->validateLoginForm($form);

        if ($obj===false){
            $url = '/omcmsadmin?e=t&u=' . $form->username;

        }else{
            $_SESSION['uid'] = $obj->uid;
            $_SESSION['profile_image'] = $obj->profile_image;
            $_SESSION['permission'] = $obj->permission;
            $url = '/admin/list';

            $auditObject = new Audit();
            $ip = Utils::getIPClientAddress();
            $auditObject->addEvent($obj->uid, Audit::LOGIN_EVENT, array('IP_ADDRESS'=>$ip));
        }
        $this->redirect($url);
    }

    public function logoutAction(){
        Setup::destroySession();

        $this->redirect('/omcmsadmin');
    }

    public function bannerAction(){
        Setup::redirectIfNotLogged();

        $id = $this->getInt('id')?:'';

        $banners = new Banner();

        Setup::jsonHeaders();

        $result = array('success'=>false, 'error'=>'');

        $banner = $banners->load($id);

        if ($banner){
            $result['success'] = true;
            $result['code'] = $banner->content;
            $result['name'] = $banner->name;
            $result['type'] = $banner->type;
            $result['order'] = $banner->order;
        }

        echo json_encode($result);

        exit();

    }

    public function bannerSaveAction(){

        Setup::redirectIfNotLogged();

        Setup::jsonHeaders();

        $result = array('success'=>false, 'error'=>'');

        $banners = new Banner();
        $articles = new Articles();

        $banner = new \stdClass();

        $banner->id = $this->getInt('id')?:'';
        $banner->uid = $_SESSION['uid'];
        $banner->content = $_REQUEST['content'];
        $banner->name = $_REQUEST['name'];
        $banner->type = $_REQUEST['type'];


        $order = $articles->getHighestOrder();

        $banner->order = $_REQUEST['order']?:$order;

        $errors = $banners->save($banner);

        if (count($errors)){

            $result['errors'] = $this->formatHtml($errors);

        }else{
            $_SESSION['success'] = 'Banner was successfully saved';

            $result['success'] = true;
        }

        echo json_encode($result);

        exit();

    }

    public function scheduleAction(){

        Setup::redirectIfNotLogged();

        Setup::jsonHeaders();

        $result = array('success'=>false, 'error'=>'');

        $schedules = new Schedules();

        $schedule = new \stdClass();

        $UTC = new \DateTimeZone("UTC");
        $PanTZ = new \DateTimeZone("America/Panama");

        $date = new \DateTime( $_REQUEST['day'] . ' ' . $_REQUEST['time'], $PanTZ );

        $date->setTimezone( $UTC );

        $unix = $date->getTimestamp(); //convert to GMT

        $schedule->article_id = $this->getInt('id')?:'';
        $schedule->deployed = 0;
        $schedule->uid = $_SESSION['uid'];
        $schedule->deployment_time = $unix;

        $errors = $schedules->save($schedule);

        if (count($errors)){

            $result['errors'] = $this->formatHtml($errors);

        }else{
            $_SESSION['success'] = 'Article was successfully scheduled for deployment';

            $result['success'] = true;
        }

        echo json_encode($result);

        exit();

    }

    public function removeScheduleAction(){

        Setup::redirectIfNotLogged();

        Setup::jsonHeaders();

        $result = array('success'=>false, 'error'=>'');

        $schedules = new Schedules();

        $id = $this->getInt('id')?:'';

        $schedules->deleteByArticleId($id);

        $_SESSION['success'] = 'Schedule was successfully removed';

        $result['success'] = true;

        echo json_encode($result);

        exit();

    }

    public function logAction(){
        Setup::redirectIfNotLogged();

        $audit = new Audit();

        $this->form->list = $audit->loadList();

        $this->view = "views/log.html.php";

        $this->render();
    }

    public function reportsAction(){
        Setup::redirectIfNotLogged();

        $week = $_REQUEST['type']?:'this_week';
        $event = $_REQUEST['event']?:'create_article';

        $reports = new Reports();

        $this->report = $reports->reportUserArticles($week, $event);

        $this->view = "views/reports.html.php";

        $this->render();
    }

    public function editFlashNewsAction(){
        Setup::redirectIfNotLogged();

        $service = new FlashNews();

        $id = $this->getInt('id')?:0;

        $this->loadMessages();

        $this->form = new \stdClass();

        if ($id)
            $this->form = $service->load($id);

        $this->view = "views/flash_new.html.php";

        $this->render();
    }

    public function changeStatusFlashNewsAction(){
        Setup::redirectIfNotLogged();

        $service = new FlashNews();

        $form = new \stdClass();

        $form->id = $this->getInt('id');

        $form->deleted = $_REQUEST['s']?1:0;

        $status = $form->deleted?'deleted':'restored';

        $service->update($form->id, $form);

        $_SESSION['success'] = "Flash news was successfully $status";

        $this->redirect('/admin/flash_news');

    }

    public function makePermanentAction(){
        Setup::redirectIfNotLogged();

        $article = new Articles();

        $form = new \stdClass();

        $form->permanent = 1;

        $form->id = $this->getInt('id');

        $article->update($form->id, $form);

        $_SESSION['success'] = "Article was successfully marked as permanent";

        $this->redirect('/admin/list');

    }

    public function removePermanentAction(){
        Setup::redirectIfNotLogged();

        $article = new Articles();

        $form = new \stdClass();

        $form->permanent = 0;

        $form->id = $this->getInt('id');

        $article->update($form->id, $form);

        $_SESSION['success'] = "Article was successfully unmarked as permanent";

        $this->redirect('/admin/list');

    }

    public function flashNewsAction(){
        Setup::redirectIfNotLogged();

        $service = new FlashNews();

        $where = 'deleted = 0';

        if ($_REQUEST['del']){
            $where = 'deleted = 1';
        }
        $this->loadMessages();

        $filter = array('where'=>$where);

        $this->form->list = $service->loadList($filter);

        $this->view = "views/flash_news.html.php";

        $this->render();
    }

    public function saveFlashNewsSaveAction(){
        Setup::redirectIfNotLogged();

        $service = new FlashNews();

        $form = $this->getFlashNewsObjectRequest();

        $updated = $form->id;

        $errors = $service->save($form);

        if (count($errors)){

            $_SESSION['__errorform__'] = serialize($form);

            $_SESSION['errors'] = $this->formatHtml($errors);

        }else{

            $eventCode = $updated ? Audit::UPDATE_FLASH_NEWS : Audit::CREATE_FLASH_NEWS;

            $audit = new Audit();

            $audit->addEvent($_SESSION['uid'], $eventCode, array('ID'=>$form->id));


            $_SESSION['success'] = 'Flash news was successfully saved';
        }

        $this->redirect('/admin/flash_new?id=' . $form->id);
    }

    public function editAction(){
        Setup::redirectIfNotLogged();

        $this->view = "views/edit.html.php";

        $this->form = $this->loadForm();

        $this->loadMessages();

        $this->render();
    }

    public function profileAction(){
        Setup::redirectIfNotLogged();

        if (isset($_SESSION['__errorform__'])){

            $this->form = unserialize($_SESSION['__errorform__']);

            unset($_SESSION['__errorform__']);

        }else{

            $user = new User();

            $this->form = $user->getUser($this->uid);

        }

        $this->view = "views/profile.html.php";

        $this->loadMessages();

        $this->render();
    }

    public function changePasswordAction(){
        Setup::redirectIfNotLogged();

        $user = new User();

        $currentUsers = $user->getUser($this->uid);

        $errors = array();

        if ($_REQUEST['current_password']=='') $errors[] = "Current password cannot be blank";
        if ($_REQUEST['new_password']=='') $errors[] = "New password cannot be blank";
        if ($_REQUEST['confirm_password']=='') $errors[] = "Confirm password cannot be blank";

        if (strlen($_REQUEST['current_password'])<6) $errors[] = "Current password must greater than 6 characters";
        if (strlen($_REQUEST['new_password'])<6) $errors[] = "New password must greater than 6 characters";
        if (strlen($_REQUEST['confirm_password'])<6) $errors[] = "Confirm password must greater than 6 characters";
        if ($_REQUEST['new_password']!=$_REQUEST['confirm_password']) $errors[] = "New password and confirm password don't match";

        $obj = $user->checkLogin($currentUsers->username, $_REQUEST['current_password']);

        if ($obj==false) $errors[] = "Invalid current password!";
        if ($_REQUEST['new_password']==$_REQUEST['current_password']) $errors[] = "New password cannot be the same as the current password";

        if (count($errors)==0){

            $user->changePassword($currentUsers->uid, $_REQUEST['new_password']);

            $eventCode = Audit::UPDATE_PASSWORD;

            $audit = new Audit();

            $audit->addEvent($this->uid, $eventCode, array('UID'=>$this->uid));

            $_SESSION['success'] = 'Password was successfully changed';

        }else{

            $_SESSION['errors'] = $this->formatHtml($errors);
        }

        $this->redirect('/admin/profile');
    }

    public function profileSaveAction(){
        Setup::redirectIfNotLogged();

        $user = new User();

        $currentUsers = $user->getUser($this->uid);

        if ($currentUsers->first_name != $_REQUEST['first_name']) $currentUsers->first_name = $_REQUEST['first_name'];
        if ($currentUsers->last_name != $_REQUEST['last_name']) $currentUsers->last_name = $_REQUEST['last_name'];
        if ($currentUsers->email != $_REQUEST['email']) $currentUsers->email = $_REQUEST['email'];
        if ($currentUsers->profile_image != $_REQUEST['profile_image']) $currentUsers->profile_image = $_REQUEST['profile_image'];

        $errors = $user->save($currentUsers);

        if (count($errors)){

            $_SESSION['__errorform__'] = serialize($currentUsers);

            $_SESSION['errors'] = $this->formatHtml($errors);

        }else{

            $_SESSION['profile_image'] = $currentUsers->profile_image;

            $eventCode = Audit::UPDATE_USER_PROFILE;

            $audit = new Audit();

            $audit->addEvent($this->uid, $eventCode, array('UID'=>$this->uid));

            $_SESSION['success'] = 'Profile was successfully updated';
        }

        $this->redirect('/admin/profile');
    }

    public function saveAction(){
        Setup::redirectIfNotLogged();

        $article = new Articles();

        $form = $this->getArticleObjectRequest();

        $errors = $article->save($form);

        if (count($errors)){

            $_SESSION['__errorform__'] = serialize($form);

            $_SESSION['errors'] = $this->formatHtml($errors);

        }else{

            $eventCode = $this->id ? Audit::UPDATE_ARTICLE : Audit::CREATE_ARTICLE;

            $this->id = $form->id;

            $this->auditObject->addEvent($this->uid, $eventCode, array('ID'=>$this->id));

            $this->createSitemap();

            $_SESSION['success'] = 'Article was successfully saved';
        }

        $this->redirect('/admin/edit?id=' . $this->id);
    }

    public function changeStatusAction(){

        $newStatus = $this->getInt('status');

        $banner = $this->get('banner')=='true';

        if ($newStatus!==false){

            if ($banner){

                $this->changeBannerStatus($this->id, $newStatus);

            }else{
                $articles = new Articles();

                $newName = $articles->getStatusName($newStatus);

                $this->auditObject->addEvent($this->uid, Audit::CHANGE_STATUS_ARTICLE, array('STATUS'=>$newName, 'ID'=>$this->id));

                $this->changeArticleStatus($this->id, $newStatus);

                if ($newStatus==Articles::DEPLOYED_PROD_STATUS){

                    $this->updateReviewer($this->id, $this->uid);
                }

            }

            $this->createSitemap();

            $_SESSION['success'] = 'Status updated';

        }else{
            $_SESSION['errors'] = "Invalid status";

        }
        $this->redirect('/admin/list');
    }

    public function movePreviousAction(){
        $this->auditObject->addEvent($this->uid, Audit::MOVE_ARTICLE_PREV, array('ID'=>$this->id));
        $this->switchOrder($this->id, true);
    }

    public function moveNextAction(){
        $this->auditObject->addEvent($this->uid, Audit::MOVE_ARTICLE_NEXT, array('ID'=>$this->id));
        $this->switchOrder($this->id, false);
    }

    public function listAction(){
        Setup::redirectIfNotLogged();

        if (!isset($_REQUEST["status"]))
            $this->redirect('/admin/list?status[]='.Articles::SAVED_STATUS.'&status[]='. Articles::DEPLOYED_DEV_STATUS .'&status[]=' . Articles::DEPLOYED_PROD_STATUS);

        $articles = new Articles();

        $banners = new Banner();

        $filter = $this->getListFilter();

        $articles = $articles->loadList($filter);

        $banners = $banners->loadList($this->getBannerFilter());

        $this->form->list = Utils::mergeBannerArticles($articles, $banners);

        $this->loadMessages();

        $this->offset = intval($filter['offset'])?:0;

        $this->view = "views/admin.html.php";

        $this->render();
    }


    public function imageLibAction(){

        Setup::redirectIfNotLogged();

        $articles = new Articles();

        if ( !(isset($_REQUEST['p']) && is_numeric($_REQUEST['p']))){
            $this->redirect("/admin/imagelib?p=1");
        }

        $filter = $this->getimagesFilter($articles);

        $this->form->images = $articles->loadImages($filter);

        $this->form->categories = $articles->loadCategories();

        $this->loadMessages();

        $this->view = "views/images.html.php";

        $this->render();
    }

    public function imageLibSaveAction(){

        Setup::redirectIfNotLogged();

        $articles = new Articles();

        $form = new \stdClass();

        $form->url = $_REQUEST['url'];

        $form->category = strtolower($_REQUEST['category']?:'');

        $form->keywords = '';

        $id = $articles->addImage($form);

        if ($id===false){

            $_SESSION['__errorform__'] = serialize($form);

            $_SESSION['errors'] = "Image wasn't able to be saved";

        }else{
            $this->id = $form->id;

            $_SESSION['success'] = 'Image was successfully saved';
        }

        $this->redirect('/admin/imagelib');

        $this->render();
    }

    public function deleteImageAction(){

        Setup::redirectIfNotLogged();

        $articles = new Articles();

        $redir = $_REQUEST['ref'];

        $articles->deleteImage($this->id);

        $_SESSION['success'] = 'Image was successfully deleted';

        $this->redirect($redir);
    }


    public function proxyAction(){

        Setup::redirectIfNotLogged();
        //image url
        $url = $_REQUEST['proxy_img'];

        //image size
        $imgData = getimagesize($url);

        header("Content-type: " . $imgData['mime']);
        header("Access-Control-Allow-Origin: *");

        //responds with stream content
        echo file_get_contents($url);

        exit();
    }

    public function uploadAction(){
        Setup::redirectIfNotLogged();

        $uploadDir = $this->root . env("UPLOAD_DIR");

        $uploader = new FileUpload('uploadfile');

        $uploader->allowedExtensions = array('jpg','jpeg','png');
        $uploader->sizeLimit = 20000000;  //default is 20mb

        $ext = $uploader->getExtension(); //get uploaded file ext

        $newTempName = uniqid('img_').'.'.$ext;

        $uploader->newFileName = $newTempName;

        // Handle the upload / saves copy to upload
        $result = $uploader->handleUpload($uploadDir);


        if (!$result) {
            //error while uploading file
            exit(json_encode(array('success' => false, 'msg' => $uploader->getErrorMsg())));
        }
        else{

            $response = array('success' => false, 'msg'=>'');
            $uploads = env("UPLOAD_DIR");
            $uri =  $uploads. '/' . $newTempName;

            $response['success'] = true;
            $response['image_name'] = $uri;

            echo json_encode($response);
        }


    }

    public function cropAction(){

        Setup::redirectIfNotLogged();

        Setup::jsonHeaders();
        header("Access-Control-Allow-Origin: *");

        $result = array('success'=>false, 'errors'=>'','path'=>'');

        $uploadDir = $this->root.env("UPLOAD_DIR");

        //Image url and crop data
        $url = $_REQUEST['url'];
        $type = $_REQUEST['type']?:'thumb';

        //removes query parameters
        $url = strtok($url, '?');

        $path = $this->root.$url;

        $cropData = $_REQUEST['getData'];

        $extension = strtolower(pathinfo($url, PATHINFO_EXTENSION));

        $newTempName =  uniqid('tempcrop_').'.'.$extension;

        try{
            if (count($cropData)){

                $imagick = new \Imagick($path);

                $imagick->cropImage( $cropData['width'], $cropData['height'], $cropData['x'], $cropData['y']);

                $d = $imagick->writeImage($uploadDir.'/'.$newTempName);

                $width = 300;

                if ($type=='large'){
                    $width = 600;
                }elseif ($type=='profile'){
                    $width = 200;
                }

                $prefix = 'img_'; //prefix for thumbnail

                $newImage = $this->createImageThumbnail($uploadDir . '/' .$newTempName, $extension, $prefix, $width);

                unlink($uploadDir. '/' .$newTempName);

                if ($newImage){

                    $basename = pathinfo($newImage, PATHINFO_FILENAME);

                    $lowResolutionTemp = $basename.'.min.jpg';

                    $this->lowResolutionCompress($uploadDir.'/'.$newImage, $uploadDir.'/'.$lowResolutionTemp);

                    $this->compress($uploadDir.'/'.$newImage);

                    $s3 = new S3(env('AWS_ACCESS_KEY_ID'), env('AWS_ACCESS_SECRET'));

                    $uri = $type . '/' . $newImage;

                    $uriLow = $type . '/' . $lowResolutionTemp;

                    if($s3->putObjectFile($uploadDir.'/'.$newImage , env('AWS_OMCMS_BUCKET') , $uri, S3::ACL_PUBLIC_READ) &&
                        $s3->putObjectFile($uploadDir.'/'.$lowResolutionTemp , env('AWS_OMCMS_BUCKET') , $uriLow, S3::ACL_PUBLIC_READ)
                    ){

                        $result['success'] = true;

                        $result['path'] = 'https://s3.amazonaws.com/'. env('AWS_OMCMS_BUCKET').'/'.$uri;

                        $result['name'] = $newImage;

                    }
                    else
                    {
                        $response['errors']="Error while creating live copy. Please try again in a moment.";
                    }
                    unlink($uploadDir.'/'.$lowResolutionTemp);

                }else{

                    $response['errors']="Error while creating a copy. Please try again in a moment.";

                }

                unlink($uploadDir.'/'.$newImage);

            }


        }catch(Exception $e){
            $response['errors']= $e->getMessage();
        }

        unlink($path);



        echo json_encode($result);

        exit();
    }

    private function createImageThumbnail($fullfilename, $extension, $prefix = 'thumb_img', $maxWidth = 300, $maxHeight = null){

        $newfilename = '';

        try{
            $dir = dirname($fullfilename);

            $d = $imagick = new \Imagick($fullfilename);

            $geo = $imagick->getImageGeometry();

            $width  = $geo['width'];
            $height = $geo['height'];


            if ($width > $maxWidth){
                $imagick->scaleImage($maxWidth, 0);
                $width = $maxWidth;

                $geo = $imagick->getImageGeometry();
                $height = $geo['height'];

            }

            $suffix = "_w{$width}_h{$height}";

            $filename = uniqid($prefix) . $suffix . '.' . $extension;


            if ($maxHeight!==null && is_numeric($maxHeight) && $height > $maxHeight){

                $imagick->cropImage($width, $maxHeight, 0, 0);

            }

            $imagick->writeImage($dir.'/' .$filename);


            $newfilename = $filename;


        }catch(Exception $e){
            echo $e;
        }

        return $newfilename;

    }

    private function compress($source){

        \Tinify\setKey(env('TINYPNG_API_KEY'));

        try{

            $bnt = \Tinify\fromFile($source);

            $bnt->toFile($source);

        }catch (Exception $e){

        }


    }

    private function lowResolutionCompress($source, $destination) {

        $info = getimagesize($source);

        if ($info['mime'] == 'image/jpeg')
            $image = imagecreatefromjpeg($source);

        elseif ($info['mime'] == 'image/gif')
            $image = imagecreatefromgif($source);

        elseif ($info['mime'] == 'image/png')
            $image = imagecreatefrompng($source);

        $width = $info[0];
        $height = $info[1];

        $newwidth = $width/7;
        $newheight = $height/7;

        $dest = imagecreatetruecolor($newwidth, $newheight);
        imagecopyresampled($dest, $image, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);


        imagejpeg($dest, $destination);
        imagedestroy($dest);

        return $destination;
    }

    private function getLoginFormRequest(){

        $form = new \stdClass();
        $form->username = trim(strtolower($_REQUEST['username']));
        $form->password = trim($_REQUEST['password']);

        return $form;

    }

    private function validateLoginForm(&$form){

        $user = new User();

        $obj = $user->checkLogin($form->username, $form->password);


        return $obj;

    }

    private function getListFilter(){
        $filter = array();

        $where = '';

        $this->searchText = strtolower($_REQUEST['s'])?:'';

        if ($this->searchText){
            $where.= ' (lower(title) like "%'.$this->searchText.'%" OR lower(content) like "%'.$this->searchText.'%") AND ';
        }

        $this->filterStatuses = $_REQUEST['status'];

        $statuses = '('.implode(',', $this->filterStatuses) . ')';

        $where .= "status in $statuses";

        $filter['fields'] = "articles.*, (SELECT max(`order`) FROM articles) max_order, (SELECT min(`order`) FROM articles) min_order, (SELECT deployment_time FROM schedule_deployment WHERE article_id = articles.id AND deployed=0 limit 1) scheduled ";
        $filter['where'] = $where;
        $filter['order'] = 'ORDER BY `order` DESC';

        $filter['limit'] = $_REQUEST['limit']?:'40';

        $filter['offset'] = $_REQUEST['offset']?:'0';

        return $filter;
    }

    private function getBannerFilter(){
        $filter = array();

        $where = '';

        $this->searchText = strtolower($_REQUEST['s'])?:'';

        if ($this->searchText){
            $where.= ' lower(name) like "%'.$this->searchText.'%" AND ';
        }

        $statuses = '('.implode(',', $_REQUEST['status']) . ')';

        $where .= "status in $statuses";

        $filter['where'] = $where;
        $filter['order'] = 'ORDER BY `order` DESC';

        $filter['limit'] = $_REQUEST['limit']?:'40';

        $filter['offset'] = $_REQUEST['offset']?:'0';

        return $filter;
    }

    private function getFlashNewsObjectRequest(){

        $obj = $this->getInt('id');

        $obj = $this->getObjectRequest(FlashNews::FIELDS);

        $obj->deleted = $obj->deleted?1:0;

        $obj->title = ucfirst($obj->title);

        $obj->uid =  $_SESSION['uid'];

        return $obj;

    }


    private function getImagesFilter($articles){
        $filter = array();

        $pageSize = 15;

        $page = is_numeric($_REQUEST['p'])?  intval($_REQUEST['p']) :1;

        $filter['limit'] = $pageSize;

        $category = $_REQUEST['cat']?:'';

        $keywords = $_REQUEST['keywords']?:'';

        $where = '1';

        if ($category)
            $where = ' lower(category) = "'.  mysqli_escape_string($this->conn,strtolower($category)) .'"';

        if ($keywords)
            $where = ($where?' AND ':'') . ' lower(keywords) like "'.  mysqli_escape_string($this->conn, strtolower($keywords)) .'%"';

        $this->categoryHeader = $category?ucfirst($category):"All";

        $this->pageSize = $pageSize;

        $this->page = $page;

        $filter['where'] = $where;

        $filter['fields'] = " *, (SELECT count(*) FROM images WHERE $where) as total";

        $filter['offset'] = ($page-1) * $pageSize;

        $filter['order'] = 'ORDER BY id DESC';

        $frm = $articles->loadImagesTotal($filter);

        $this->totalRecords = $frm->total;

        $this->totalPages = ceil($this->totalRecords/$pageSize);

        return $filter;
    }

    private function getArticleObjectRequest(){

        $obj = $this->getObjectRequest(Articles::ARTICLE_FIELDS);


        $obj->countries = '';
        if ($_REQUEST['countries'] && is_array($_REQUEST['countries']) && count($_REQUEST['countries'])){
            $obj->countries = implode(',', $_REQUEST['countries']);
        }

        if (isset($_REQUEST['tags']) && is_array($_REQUEST['tags']))
            $obj->tags = implode(',', $_REQUEST['tags']);

        $obj->url = strtolower($obj->url);

        //remove - at end
        if (substr($obj->url, -1)=='-'){
            $obj->url = substr($obj->url, 0, strlen($obj->url) - 1);
        }

        //remove - at beginning
        if (substr($obj->url, 0, 1)=='-'){
            $obj->url = substr($obj->url, 1, strlen($obj->url) );
        }

        if (is_uploaded_file($_FILES['video_url']['tmp_name']) )
        {
            $obj->_video_temp_file = $_FILES['video_url']['tmp_name'];

            $obj->_video_temp_type = $_FILES['video_url']['type'];

        }

        $obj->uid =  $this->uid;

        return $obj;

    }

    private function loadForm(){

        $form = new \stdClass();

        $form->countryList = array();

        if (isset($_SESSION['__errorform__'])){

            $form = unserialize($_SESSION['__errorform__']);

            unset($_SESSION['__errorform__']);

        }elseif ($this->id){

            $article = new Articles();

            $form = $article->load($this->id);

            $form->countryList = array();

            if ($form->countries)
                $form->countryList = explode(',', $form->countries);

        }else{
            $article = new Articles();

            $form->order = $article->getHighestOrder();
        }



        return $form;
    }

    private function switchOrder($id, $prev = true){

        $article = new Articles();

        $obj = $article->load($id);

        if ($obj!==false){

            $form = new \stdClass();

            $currentOrder = $obj->order;

            if ($prev)
                $otherRecord = $article->previousOrderRecord($id);
            else
                $otherRecord = $article->nextOrderRecord($id);

            if ($otherRecord!==false){
                $otherId = $otherRecord->id;
                $form->order = $otherRecord->order;
            }else{
                $otherId = false;

                if ($prev){
                    $form->order = ($currentOrder - 10) ? $currentOrder - 10 : 0;
                }
                else{
                    $form->order = $currentOrder + 100;
                }

            }

            $article->update($id, $form);

            $otherForm = new \stdClass();

            $otherForm->order = $currentOrder;

            if ($otherId)
                $article->update($otherId, $otherForm);

            $_SESSION['success'] = 'Article order changed';

        }else{

            $_SESSION['errors'] = "Couldn't load the record";
        }

        $this->redirect('/admin/list');
    }

    private function createSitemap(){

        $siteUrl = env("APP_URL");

        $sitemap = new \SitemapPHP\Sitemap($siteUrl);
        $sitemap->setPath('xmls/');
        $sitemap->addItem('/', '1.0', 'daily', 'Today');

        $sitemap->addItem('/ocean', '0.8', 'daily', 'Today');
        $sitemap->addItem('/air', '0.8', 'daily', 'Today');
        $sitemap->addItem('/truck', '0.8', 'daily', 'Today');

        $articles = new Articles();

        $filter = array();
        $filter['where'] = ' status in ( '.Articles::DEPLOYED_PROD_STATUS.','.Articles::ARCHIVED_STATUS.' )';
        $filter['order'] = ' ORDER BY `order` DESC, status ASC';

        $list = $articles->loadList($filter);

        foreach ($list as $article){

            $priority = '0.5';
            if ($article->status==Articles::DEPLOYED_PROD_STATUS){
                $priority = '0.9';
            }

            $sitemap->addItem('/' . $article->url, $priority, 'daily', $article->last_updated);
        }


        $sitemap->createSitemapIndex($siteUrl . '/xmls/', 'Today');

    }

    private function changeArticleStatus($id, $status){
        $article = new Articles();

        $form = new \stdClass();

        $form->status = $status;

        $article->update($id, $form);
    }

    private function updateReviewer($id, $reviewerId){

        $article = new Articles();

        $form = new \stdClass();

        $form->reviewer_id = $reviewerId;

        $article->update($id, $form);

    }

    private function changeBannerStatus($id, $status){
        require_once "services/Banner.php";

        $banner = new Banner();

        $form = new \stdClass();

        $form->status = $status;

        $banner->update($id, $form);

    }

}
