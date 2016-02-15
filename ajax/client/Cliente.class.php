<?php 
	require_once("../../lib/Crud.php");

	class Cliente Extends Crud {
		
			# Your Table name 
			protected $table = 'clientes';
			
			# Primary Key of the Table
			protected $pk	 = 'id';
	}

?>
