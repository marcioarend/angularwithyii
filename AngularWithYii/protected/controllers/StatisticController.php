<?php
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");

class StatisticController extends Controller
{
	public function actionIndex()
	{
		$model=new Statistic();
		
		
		$this->layout=false;
		header('Content-type: application/json');
		
		$postdata = file_get_contents("php://input");
		$request = CJSON::decode($postdata);
		
		
		if(isset($request))
		{
			
			$modelElement = Elements::model()->findByAttributes(array("Name"=> $request["idElement"]));
			if ( !isset($modelElement)){
				$modelElement = new Elements();
				$modelElement->attributes = array("Name"=> $request["idElement"]);
				$modelElement->save();
			}	
			$request["Elements_id"] = $modelElement->id;
	  		$model->attributes=$request;
 			
 			if($model->save()){
 				echo CJSON::encode(array('id'=>$model->id));
 			}
		
// 			var_dump($model->errors);	
				
		}
	
		Yii::app()->end();
		
	}
	
	
	
	public function actionPosition(){
		
		$model=new Position();
		
		
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
		
			// 			var_dump($model->errors);
		
		}
		
		Yii::app()->end();
		
		
		
		
	}

	// Uncomment the following methods and override them if needed
	/*
	public function filters()
	{
		// return the filter configuration for this controller, e.g.:
		return array(
			'inlineFilterName',
			array(
				'class'=>'path.to.FilterClass',
				'propertyName'=>'propertyValue',
			),
		);
	}

	public function actions()
	{
		// return external action classes, e.g.:
		return array(
			'action1'=>'path.to.ActionClass',
			'action2'=>array(
				'class'=>'path.to.AnotherActionClass',
				'propertyName'=>'propertyValue',
			),
		);
	}
	*/
}