<?php 
require("Cliente.class.php");
require("../notifications/Notifications.class.php");
/*
nome
email
excluido
endereco
complemento
bairro
cep
telefone_fixo
telefone_celular
responsavel
pai
telefone_pai
email_pai
mae
telefone_mae
email_mae
*/
header('Content-Type: application/json;charset=utf-8');

$cliente  = new Cliente();
function create($info, $data) {
	$notifications = new Notifications();
	$notifications->info = $info;
	$notifications->data  = $data;
	return $notifications->Create();
}
function get_filter($field){
    $input = filter_input(INPUT_GET, $field , FILTER_SANITIZE_SPECIAL_CHARS);
    return utf8_decode($input);
}
//verifico se é requisição ajax
if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') { 
	$action = get_filter('a');
} else {
	echo json_encode(['deny'=> true]);
	exit;
}
//ação de criar aluno/cliente
if($action == 'create') {
	$cliente->nome = get_filter('nome');
	$cliente->email = get_filter('email');
	$cliente->endereco = get_filter('endereco');
	$cliente->complemento = get_filter('complemento');
	$cliente->bairro = get_filter('bairro');
	$cliente->cep = get_filter('cep');
	$cliente->telefone_fixo = get_filter('telefone_fixo');
	$cliente->telefone_celular = get_filter('telefone_celular');
	$cliente->responsavel = get_filter('responsavel');
	$cliente->pai = get_filter('pai');
	$cliente->telefone_pai = get_filter('telefone_pai');
	$cliente->email_pai = get_filter('email_pai');
	$cliente->mae = get_filter('mae');
	$cliente->telefone_mae = get_filter('telefone_mae');
	$cliente->email_mae = get_filter('email_mae');
	$cliente->observacao = get_filter('observacao');
	
	$creation = $cliente->Create();
	create("Usuario " . $cliente->nome . " Criado", var_export($creation, true));
	if(isset($creation) && !empty($creation)) {
		echo json_encode($creation);
	} else {
		echo json_encode(['error' =>'true']);
	}
}
 //ação de atualizar cliente
if($action == 'update') {
	$cliente->id = get_filter('id');
	$cliente->nome = get_filter('nome');
	$cliente->email = get_filter('email');
	$cliente->endereco = get_filter('endereco');
	$cliente->complemento = get_filter('complemento');
	$cliente->bairro = get_filter('bairro');
	$cliente->cep = get_filter('cep');
	$cliente->telefone_fixo = get_filter('telefone_fixo');
	$cliente->telefone_celular = get_filter('telefone_celular');
	$cliente->responsavel = get_filter('responsavel');
	$cliente->pai = get_filter('pai');
	$cliente->telefone_pai = get_filter('telefone_pai');
	$cliente->email_pai = get_filter('email_pai');
	$cliente->mae = get_filter('mae');
	$cliente->telefone_mae = get_filter('telefone_mae');
	$cliente->email_mae = get_filter('email_mae');
	$cliente->observacao = get_filter('observacao');

	$update = $cliente->Save();
	if($update == 1) {
		echo json_encode(['success' => true]);
	} else {
		echo json_encode(['error' =>'true']);
	}
}
//ação de deletar cliente
if($action == 'delete') {
	$cliente->id = get_filter('id');
	$delete = $cliente->Delete();
	if($delete == 1) {
		echo json_encode(['success' => true]);
	} else {
		echo json_encode(['error' =>'true']);
	}
}
//ação de retrieve/busca de informação unica
if($action == 'retrieve'){
	$cliente->id = get_filter('id');	  
	$cliente->Find();
	echo json_encode($cliente->variables);
}
//ação de lista de dados
if($action == 'list') {
	$cliente->search = (isset($_GET['search']) && !empty($_GET['search'])) ? array_filter($_GET['search']) : "";
	$page = (isset($_GET['page']) && !empty($_GET['page']) && $_GET['page'] >=1 )? intval($_GET['page'])-1 : 0;
	$limit = (isset($_GET['limit']) && !empty($_GET['limit']) )? intval($_GET['limit']) : $cliente->limit;
	$cliente->limit = $limit;//defino a quantidade de resultados
	$cliente->orderby = "id";
	$cliente->order = " DESC ";
	$cliente->ListAll($page);
	$data = ['data' => $cliente->variables, 'rows' => $cliente->rows];
	echo json_encode($data);
}

