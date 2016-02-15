<?php 
require("Notifications.class.php");
header('Content-Type: application/json');
$notifications  = new Notifications();

//verifico se é requisição ajax
if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') { 
    $action = $_GET['a'];
} else {
    echo json_encode(['deny'=> true]);
    exit;
}
//ação de criar aluno/cliente
if($action == 'create') {
    $notifications->info = $_GET['info'];
    $notifications->data  = $_GET['data'];
    $creation = $notifications->Create();
    if(isset($creation) && !empty($creation)) {
        echo json_encode($creation);
    } else {
        echo json_encode(['error' =>'true']);
    }
}
//ação de retrieve/busca de informação unica
if($action == 'retrieve'){
    $notifications->id = $_GET['id'];      
    $notifications->Find();
    echo json_encode($notifications->variables);
}
//ação de lista de dados
if($action == 'list') {
    $page = (isset($_GET['page']) && !empty($_GET['page']) && $_GET['page'] >=1 )? intval($_GET['page'])-1 : 0;
    $limit = (isset($_GET['limit']) && !empty($_GET['limit']) )? intval($_GET['limit']) : $notifications->limit;
    $notifications->limit = $limit;//defino a quantidade de resultados
    $notifications->orderby = "id";
    $notifications->order = " DESC ";
    $notifications->ListAll($page);
    $data = ['data' => $notifications->variables, 'rows' => $notifications->rows];
    echo json_encode($data);
}
