<?php
define('BASE_TEMPLATES', 'parts/');
define('BASE_EXT', '.php');
define('BASE_FILE_TEMPLATE', 'main');
define('BASE_404', '404');
$data = []; //array de dados adicionais
/*js adicional*/
$data['main']['scripts'] = ["./js/chartjs.conf.js"];
$data['graficos']['scripts'] = ["./js/raphael.min.js", "./js/morris.min.js", "./js/morris.conf.js"];
$data['todo_list']['scripts'] = ["./js/jquery.ui.min.js", "./js/tasks.min.js", "./js/todo.min.js" ];
