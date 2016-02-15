<?php 
	require_once("../../lib/Crud.php");

	class Notifications Extends Crud {
		
			# Your Table name 
			protected $table = 'notificacoes';
			
			# Primary Key of the Table
			protected $pk	 = 'id';
	}

?>
