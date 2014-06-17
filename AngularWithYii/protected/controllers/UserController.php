<?php
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
class UserController extends Controller
{
	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	// for testing I am using the layout, but to Json return I "turn it off"
 	public $layout='//layouts/column2';

 	
	/**
	 * @return array action filters
	 */
	public function filters()
	{
		
		//@TODO verificacao se o usuario esta logado
// 		$values = apache_request_headers();
// 		echo $values["Authorization"];
// 		die();
// 		throw new CHttpException(404,'The requested page does not exist.');
// 		throw new CHttpException(403,"you must login first");
		
			

	}
	
	public function validate($values , $role = ""){ 
		if (isset($values["Authorization"])){
			$val = $values["Authorization"];
		
			$subString = substr($val, -3);
			if ($subString === $role){
				return true;
			}	
		}
		return false;
	}

	public function actionLogin(){

		$this->layout=false;
		$values = apache_request_headers();
		
		
		header('Content-type: application/json');
		$postdata = file_get_contents("php://input");
		$request = CJSON::decode($postdata);
		$user = array();
		
		if (empty($values["Authorization"])){
			if ($request["password"] == "admin" and $request["username"] == "admin"){
					$user["sessionId"]= uniqid() . "_adm";
					$user["role"] = "admin";
					$user["id"] = 1;
					$user["name"] = "Administrador";
			}else {
					$user["sessionId"]= uniqid() .  "_usr";
					$user["role"] = "user";
					$user["id"] = 2;
					$user["name"] = "Marcio Arend";
			}
			
			echo CJSON::encode($user);
		}else {
			echo $values["Authorization"];
		}
		
		// 		$result = $this->loadModel($id);
		// 		echo CJSON::encode($result);
		die();
		// 		$this->render('view',array(
		// 			'model'=>$this->loadModel($id),
		// 		));
	
	
	
	}
	
	
	/**
	 * Specifies the access control rules.
	 * This method is used by the 'accessControl' filter.
	 * @return array access control rules
	 */
	public function accessRules()
	{
// 		return array(
// 			array('allow',  // allow all users to perform 'index' and 'view' actions
// 				'actions'=>array('index','view'),
// 				'users'=>array('*'),
// 			),
// 			array('allow', // allow authenticated user to perform 'create' and 'update' actions
// 				'actions'=>array('create','update'),
// 				'users'=>array('*'),
// 			),
// 			array('allow', // allow admin user to perform 'admin' and 'delete' actions
// 				'actions'=>array('admin','delete'),
// 				'users'=>array('*'),
// 			),
// 			array('deny',  // deny all users
// 				'users'=>array('*'),
// 			),
// 		);
	}

	/**
	 * Displays a particular model.
	 * @param integer $id the ID of the model to be displayed
	 */
	public function actionView($id)
	{
		
		$this->layout=false;
		
		$values = apache_request_headers();
		if ( $this->validate($values,"adm") == true ){
			header('Content-type: application/json');
			$postdata = file_get_contents("php://input");
			$request = CJSON::decode($postdata);
			$result = $this->loadModel($id);
			echo CJSON::encode($result);
		}else {
			header('HTTP/1.0 403 Error');
		}
		
		die();
// 		$this->render('view',array(
// 			'model'=>$this->loadModel($id),
// 		));
	}

	/**
	 * Creates a new model.
	 * If creation is successful, the browser will be redirected to the 'view' page.
	 */
	public function actionCreate()
	{
		$model=new User;
	
		$this->layout=false;
		header('Content-type: application/json');

		$postdata = file_get_contents("php://input");
		$request = CJSON::decode($postdata);
		
		if(isset($request))
		{
			$model->attributes=$request;
			if($model->save()){
				echo CJSON::encode(array('id'=>$model->id));
			}
				
			
			
		}
		
		Yii::app()->end();
		
	}

	/**
	 * Updates a particular model.
	 * If update is successful, the browser will be redirected to the 'view' page.
	 * @param integer $id the ID of the model to be updated
	 */
	public function actionUpdate()
	{
		$model=new User;
	
		$this->layout=false;
		header('Content-type: application/json');

		$postdata = file_get_contents("php://input");
		$request = CJSON::decode($postdata);
		
		if(isset($request))
		{
			$model = User::model()->findByPK($request["id"]);
			$model->setAttributes($request);
			
			if($model->update()){
				echo CJSON::encode(array('id'=>$model->id));
			}
				
			
			
		}
		
		Yii::app()->end();
	}

	/**
	 * Deletes a particular model.
	 * If deletion is successful, the browser will be redirected to the 'admin' page.
	 * @param integer $id the ID of the model to be deleted
	 */
	public function actionDelete($id)
	{
		$this->loadModel($id)->delete();

		// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
		if(!isset($_GET['ajax']))
			$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
	}

	/**
	 * Lists all models.
	 */
	public function actionIndex()
	{
		
		
		$values = apache_request_headers();
		
		
		if ($this->validate($values,"adm")== true  or $this->validate($values,"usr") == true){
			$dataProvider=new CActiveDataProvider('User');
			$stats = User::model()->findAll();
			$retornoJson = CJSON::encode($stats);
			echo $retornoJson;
		} else {
			header('HTTP/1.0 401 Error');
		}
			
		
		
		die();
// 		$this->render('index',array(
// 			'dataProvider'=>$dataProvider,
// 		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new User('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['User']))
			$model->attributes=$_GET['User'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return User the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=User::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param User $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='user-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
}
