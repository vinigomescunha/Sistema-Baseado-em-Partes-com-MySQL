	var callbacks = [];//coloco os callbacks em um array
//constroi url a partir de um objeto 
var buildUrlParams = function ( data ) {
	var ret = [];
	for (var d in data)
		ret.push(d + "=" + data[d]);
	return "?" + ret.join("&");
}
/*obtem os parametros da url como um objeto*/
var getUrlParams = function() {
	var params = {}, q, temp, i, l;
	q = window.location.search.replace("?", "").split("&");
	for ( var i = 0, l = q.length; i < l; i++ ) {
		temp = q[i].split('=');
		params[temp[0]] = temp[1];
	} 
	return params;
};
var str = getUrlParams();//pego a query string
/*busca os parametros da url e recarrega a pagina*/
var searchUrlReload = function (resp) {
	params = getUrlParams();
	var object = $.extend({}, params, resp);
	window.location.search = buildUrlParams(object);
}
//adiciono alerta no form
var addAlert = function (a) {
	if($('#' + a.formId + ' #'+ a.modalId).length == 0){
		$('#' + a.formId).prepend('<div id="' + a.modalId + '" class="alert alert-danger">' + a.textHtml + '</div>');
	} else {
		$('#' + a.formId + ' #'+ a.modalId).html(a.textHtml);
	}
}
//formatar data 	//new Date('2015-01-02 15:08:00').format('d/m/Y')
var dateFormat = function(date, format) {
	return DateFormat.format.date(date, format)
}

//reconstruo a variavel searched que coloca os parametros via ajax resp significa que vai receber da url
var rebuildSearched =  function() {
	for(var l in searched) {
		if(str.hasOwnProperty(l)){
				searched[l].value = unescape(str[l]);
		}
	}
}
var initialLoad;
 /* carrega lista de dados via get */
var loadData = function () {
	if(typeof initialLoad == 'undefined'){
		rebuildSearched();
		initialLoad=true;
	}	
	var searchArguments={};//verifico se existe valores nos campos
	for(var sindex in searched){
		if(searched[sindex].value) {searchArguments[sindex]=searched[sindex].value;}
	}
	$.get(ajaxurl, {a:'list', page: page, limit: limit, search:searchArguments},function(data, status){if(status == 'success'){info = data; populate(labels, data, fields);}});
}
/*pego o cabeçalho dos dados da primeira linha e exporto os dados do csv a partir dos campos, depois comparo com variavel fields para saber se existe o campo na lista*/
var exportCSV = function(data, filename) {
	var keys = Object.keys(data[0] ? data[0] :[]), headerCSV = '';
	var csvKeys = [];
	for(var i in keys) {
		if(!fields[keys[i]]) continue;
		csvKeys.push(keys[i]);
		headerCSV += fields[keys[i]].label + ";"
	}
	var csv = buildCSVbyField(data, csvKeys);
	csv = headerCSV + "\n" + csv;
	var file = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
	saveAs(file, filename + '(page-' + page + ')' + DateFormat.format.date(new Date(),'d-M-yyyy HH:mm') + '.csv');
}
/*paginação da tabela*/
var pagination = function (num){
	var params = getUrlParams();
	var actualPage = params.page ? params.page : 1;
	var numbers = Math.ceil(num/limit), i = 1, temp, format = "<ul class='pagination'>";
	if(numbers < 1) {return null;}
	while(i <= numbers) {
		params.page = i;
		temp = buildUrlParams(params);
		format += (actualPage == params.page) ? "<li class='active'>" : "<li>" ;
		format += "<a href=" + temp + ">" + i + "</a>";
		format += "</li>";
		i++;
	}
	format += "</ul>";
	return format;
}
/*cria os dados do form vindo de inputs, selects e textareas*/
var buildresponse = function (el) {
	values = {}, flag = true;
	var inputs = $('#' + el + ' input, #' + el + ' textarea, #' + el + ' select');//varrer as inputs
	 var a = {formId: 'form1', textHtml: '<b>Erro!</b> Verifique os dados do formulário!', modalId: 'alertModal'};
		inputs.each(function() { 
			if($(this).hasClass('email') && !ValidateEmail($(this).val())){
				$(this).addClass('focusedinput');
				addAlert(a);
				flag = false;
			} else if ($(this).hasClass('require') && $(this).val() == "" ) {
				$(this).addClass('focusedinput');
				addAlert(a);
				flag = false;
			} else {
				$(this).removeClass('focusedinput');
				values[this.name] = $(this).val(); 
			}
		});
	return flag == true ? values : flag;
}
/*modal informações de uma tabela*/
var infoTable = function (data) {
	var html = "";
	for(var i in fields) {
		html += '<div class="form-group line-custom">\
					<div class="form-control-static"><b>' + fields[i].label + ' : </b>\
					' + (data && data[i] ? data[i] : "") + '</div> \
				</div>';
	}
		return '<div class="form-panel" style="padding:3px">\
					' + html + ' \
				</div>';
}
/*obtem um campo no formato para bootstrap*/
var getField = function(data) {
	var formField = {};
	formField['p'] = '<p class="form-control ' + data.classe + '"">' + (data && data.data ? data.data : "") + '</p>';
	formField['input'] = '<input type="text" class="form-control ' + data.classe + '" id="' + data.id + '"  name="' + data.id + '" placeholder=" ' + data.label + '..." value="' + (data && data.data ? data.data : "") + '">';
	formField['textarea'] = '<textarea class="form-control ' + data.classe + '" id="' + data.id + '" name="' + data.id + '" placeholder=" ' + data.label + '..." rows="5">' + (data && data.data ? data.data : "") + '</textarea>'; 
	formField['select'] = '<select class="form-control" id="' + data.id + '" name="' + data.id + '"></select>';
	return formField[data.type];
}
/*cria um form com os campos definidos em data*/
var formTable = function (data) {
	var html = "";
	for(var i in fields) {
		if(!fields[i].type) continue;
		var help_text = fields[i].help_text ? '<span class="help-block">' + fields[i].help_text + '</span>' : '';
		var formField = getField({type:fields[i].type, classe: fields[i].classe, id: i, label:fields[i].label, data:(data && data[i] ? data[i] : "")});
		//chamo callback do formField
		if( fields[i].callback )
			callbacks.push(fields[i].callback);
		
		html += '<div class="form-group has-f">\
			<label class="col-sm-2 col-sm-2 control-label">' + fields[i].label + '</label>\
			<div class="col-sm-10">\
				' +formField + '\
				' + help_text + ' \
			</div>\
		</div>';
	}

	return '<div class="form-panel">\
				<form id="form1" class="form-horizontal style-form" method="get">\
					' + html + ' \
				</form>\
			</div>';
}
/*modal utilizado para confirmação de deleção, update dos dados, criação de registro e visualização dos dados*/
var modalFooter = function(text) {

	return '<div class="modal-footer">\
					<button type="button" id="save" class="btn btn-primary fa fa-check"> ' + text + '</button>\
					<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>\
			</div>';
}
/*converte json em csv*/
var buildCSVbyField = function(data, field) {
	var line = "";
	for(var i in data) {
		for(var f in field) {
			str = data[i][field[f]] ? data[i][field[f]] : " ";
			line += str + ";";
		}
		line += '\r\n';
	}
	return line;
}
/*salva qualquer arquivo via js*/
var saveAs = function(uri, filename) {
	var link = document.createElement('a');
	if (typeof link.download === 'string') {
 		link.href = uri;
  		link.download = filename;
  		//Firefox requires the link to be in the body
  		document.body.appendChild(link);
  		//simulate click
  		link.click();
  		document.body.removeChild(link);
 	} else {
		window.open(uri);
	}
}
/*executa um callback com a função e um parametro*/
var functionExecute = function (func, param) {
	var funcCall = func + "(" + param + ");";
	return eval( funcCall );
}
//função de notificação com delay de 5 segs
var notificationStatus = function (title, text) {
	$.gritter.add({title: title, text: text, sticky: false, time: '5000', class_name: 'my-sticky-class'});
}
//reg de validação de email
var ValidateEmail = function (mail) { 
	if(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{1,4})+$/.test(mail)) { 
		return true;
	} 
	return false; 
} 
//uma chamada comum de ajax com um callback a executar
var commomajax = function(info) {
	$.ajaxSetup({
  	async: true
	});
	$.get(info.url, info.params,function(data, status){
		if(status == 'success') {
			globalAjaxData = {};//armazeno dados globais para saber o ultimos dados em ajax
			globalAjaxData['status'] = status;
			globalAjaxData['data'] = data;
			if(data && typeof data.error == 'undefined') {
				functionExecute(info.callback, info.callbackParams);
			} else {
				$('#myModal').remove();
			}
			return data;
		}
	});
}
/*modal customizado para o crud*/
var modalCustom = function( id, func, info ) {
	var textData = ['deleteData','updateData', 'viewData'];
	textData['deleteData'] = {title:"Deletar", body:"Deseja mesmo deletar?", footer: modalFooter('Confirmar')};
	textData['updateData'] = {title:"Atualizar", body: (info? formTable(info) : "Nada Encontrado"), footer: modalFooter('Salvar Alterações')};
	textData['createData'] = {title:"Novo Registro", body: formTable(null) , footer: modalFooter('Salvar')};
	textData['viewData'] = {title:"Dados do Usuario: " + (info ? info.nome : "Nada Encontrado") , body: (info? infoTable(info) : "Nada Encontrado") , footer: ""};

	$('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
						<h4 class="modal-title" id="myModalLabel">' + textData[func].title + '</h4>\
					</div>\
					<div class="modal-body">\
					' + textData[func].body + '\
					</div>\
					' + textData[func].footer + '\
				</div>\
			</div>\
		</div>')
	.modal({backdrop: false})
	.find('#save')
	.click(function () {
		functionExecute(func, id);
	});

}
//notificação com texto e callback
var messageInfoModalHide = function (message, text, callback) {
	notificationStatus(message, text); 	
	if(callback !== '')
	eval(callback);
	$('#myModal').remove();
}
//create função de callback quando salva o modal após aparecer o modal executa a função de save
var createData = function () {
	var message = ['"Criado com sucesso!"', '"Novo registro na base de dados"','notifications()'];
	values = {};
	values = buildresponse('form1');
	if(values != false) {
		values['a'] = "create";
		infoCreate = commomajax({url:ajaxurl, params:values, callback:"messageInfoModalHide", callbackParams: message.join() });
	}
	setTimeout("loadData()",1000);
}
//função de callback de deleção do modal, após aparecer o modal executa a função de save
var deleteData = function (id) {
	var message =['"Deletado com sucesso!"','"Os dados foram deletados com sucesso"', 'notifications()'];
	$('#aluno' + id).remove();
	info = commomajax({url:ajaxurl, params:{a:'delete', id:id}, callback:"messageInfoModalHide", callbackParams: message.join() });
	setTimeout("loadData()",1000);
}
//função de callback quando salva o modal após aparecer o modal executa a função de save
var viewData = function () {
	$('#myModal').remove();
}
//função de callback quando salva o modal após aparecer o modal executa a função de save
var updateData = function (id) {
	var message = ['"Atualizado com sucesso!"', '"Os dados foram atualizados com sucesso"', 'loadData'];
	values = {};
	values = buildresponse('form1');
	if(values != false) {
		values['id'] = id;
		values['a'] = "update";
		info = commomajax({url:ajaxurl, params:values, callback:"messageInfoModalHide", callbackParams: message.join() });
	}
	setTimeout("loadData()",1000);
}
/*cria as notificações da barra lateral*/
var notifications = function() {
	$.get("ajax/notifications", {a:'list', limit: 6},function(data, status){
		var inf = data.data, lines = "";
		for(var i in inf) {
			lines += '<div class="desc">\
						  <div class="thumb">\
						  	<span class="badge bg-theme"><i class="fa fa-book"></i></span>\
						  </div>\
						  <div class="details">\
						  		<p><muted>' + dateFormat(inf[i].date_insert, 'dd/mm/yyyy HH:mm') + '</muted><br/>\
									' + inf[i].info + '<br/>\
						  		</p>\
						  </div>\
						 </div>';			
		}
		$('#lo-activities').html(lines);
	});
}

//botões de delete e edit e o header da tabela
var tableButtonsControl = function (local, id) {
	if(local == "th"){
		return '<th class="buttons"><i class=" fa fa-edit"></i></th>';
	} else {
	return '<td class="buttons">\
				<button data-id="' + id + '" class="view-modal btn btn-regular btn-xs"><i class="fa fa-eye"></i></button>\
				<button data-id="' + id + '" class="edit-modal btn btn-primary btn-xs"><i class="fa fa-pencil"></i></button>\
				<button data-id="' + id + '" class="trash-modal btn btn-danger btn-xs"><i class="fa fa-trash-o "></i></button>\
			</td>';
	}
}
//popula dropdown de quantidade de itens na tela
var preTableDropDownLimit = function () {
	var params = getUrlParams(), temp = {}; lim = ['10', '15', '25', '50', '75'], link = "";
	for(var i in lim) {
		params.limit = lim[i];
		params.page=1;
		temp[lim[i]]= buildUrlParams(params);
		link += '<li><a href="' + temp[lim[i]] + '">' + lim[i] + '</a></li>';
	}
	return '<div class="btn-group pull-right">\
				<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">&nbsp;<span class="caret"></span></button>\
				<ul class="dropdown-menu min60">' + link + '</ul>\
			</div>';
}
var searchBlock =  function () {
	var searchFields = "", hasSearch = false;
	
	for(var i in searched) {
		if(searched[i].value)
		hasSearch = true ;
		searchFields += '<div class="has-feedback"><input type="text" class="form-control hasclear" id="' + i + '" name="' + i + '" placeholder="' + (searched[i].placeholder ? searched[i].placeholder : "") + '" value="' + (hasSearch ? searched[i].value : "") + '">\n\
		<span class="clearer glyphicon glyphicon-remove-circle form-control-feedback" style="display:' + (searched[i].value == ''? 'none' : 'inline') + '"></span></div>';
	
	}
	return '<div id="collapse-group" class="pull-left col-md-8">\
			 		<div><a class="btn searchDetails btn-default fa fa-search" href="#"> Procurar </a></div>\
			 		<div class="collapse' + ( hasSearch ? " in " : "" ) + '">\
			 			<form id="formSearch" class="form-horizontal style-form" method="get">\
							<div class="form-group">\
								<div class="col-sm-10">\
									' + searchFields + ' \
								<button type="submit" class="btn btn-theme">Buscar</button>\
								</div>\
							</div>\
						</form>\
						</div>\
				</div>';
			}
//botão de inserção de dados na tabela
var preTable = function () {
	
	var exportCSV = '<div class="btn-group pull-right"> \
						<button class="btn btn-default create-modal" data-toggle="modal"><i class="fa fa-plus"></i> Novo Registro </button>\
						<button type="button" class="btn btn-default fa fa-file-excel-o" onclick="exportCSV(info[\'data\'], \'' + str.r + '\')" title="Exportar como CSV"> CSV </button> \
					</div>'; //export csv
	var concatenate = "";
	concatenate = preTableDropDownLimit() + exportCSV + searchBlock() ;
	return concatenate;
}
var tableRow = function(line) {
	var id = line && line['id'] ? line['id'] : null;
		var row = ""; 
			row += '<tr id="aluno' + id + '">';
		for(var i in labels) { //loop de campos
			var classe = (typeof fields[labels[i]]['tdClass']!== 'undefined'? ' class="' + fields[labels[i]]['tdClass'] + '" ': '');
			row += '<td' + classe + '>' + (line[labels[i]] ? line[labels[i]] : "") + '</td>';
		}
		row += ( line && line['id'] ? tableButtonsControl(null, line['id']) : null);
		row += '</tr>';
		return row;
}
//os dados da tabela
var tableData = function(data) 	{
	var info = {head_table:'', body_table:''};//head e body table é variavel para popular o cabeçalho da tabela 	
	//populo o header da tabela
	info['head_table'] = '<tr>';
	for(var i in labels) {
		var classe = (typeof fields[labels[i]]['tdClass']!== 'undefined'? ' class="' + fields[labels[i]]['tdClass'] + '" ': '');
		info['head_table'] += '<th' + classe + '>' + fields[labels[i]].label + '</th>';
	}
	info['head_table'] += tableButtonsControl('th', null);
	info['head_table'] += '</tr>';
	//populo o body da tabela
	for(var d in data) {
		info['body_table'] += tableRow(data[d]);
	}
	
	info['pre_table'] = preTable();
	
	return info;
}
//populador de dados na tabela
var populate = function (labels, info, fields) {
	$('#pre_table').html('');
	$('#head_table').html('');
	$('#body_table').html('');
	$('#pagination').html('');

	var data_table = tableData(info['data']);

	$('#pre_table').prepend(data_table.pre_table);
	$('#head_table').html(data_table.head_table);//append no header
	$('#body_table').append(data_table.body_table);//append no body
	$('#pagination').append(pagination(info['rows']));//insiro paginação
 }
/*collapse da busca*/
$(document).on( 'click', '.searchDetails', function(e) {
	e.defaultPrevented;
	var collapse = $('#collapse-group').find('.collapse');
	collapse.collapse('toggle');
	if($('#formSearch:visible').length == 0){
		$(this).hide();
	}else {
		$(this).show();
	}
});
//executado quando submete uma busca
$(document).on( 'submit', '#formSearch', function(e) {
	e.defaultPrevented;
	resp = buildresponse('formSearch');//pego os valores da busca
	page=1;//mudo na variavel de consulta
	str['page']=page;//mudo na url da querystring
	//loop nos campos disponiveis para busca e os removo os que ja estejam em query string
	searchUrlReload(resp);
	return false;
});
 $(document).on('keyup', ".hasclear", function () {
  var t = $(this);
  t.next('span').toggle(Boolean(t.val()));
});
$(document).on('click', '.clearer', function () {
  $(this).prev('input').val('').focus();
  $(this).hide();
});

//evento javascript on click delete, edite, criar e view modal
 $(document).on('click', '.trash-modal, .edit-modal, .create-modal, .view-modal', function () {
 	var id = $(this).attr('data-id');
 	$('#myModal').remove(); //caso tenha modal aberto fecha esse modal e abre outro
 	if($(this).hasClass('trash-modal')) {
 		modalCustom(id,'deleteData', null);
 	} else if ($(this).hasClass('edit-modal')){	//carrego os dados para popular modal de update
 		$.get(ajaxurl, {a:'retrieve', id: id},function(data, status){if(status == 'success'){	modalCustom(id,'updateData', data);	}});
 	} else if ($(this).hasClass('create-modal')) {//modal de criaçao
 		modalCustom(id,'createData', null);
 	}else if ($(this).hasClass('view-modal')) {//modal de visualização
 		$.get(ajaxurl, {a:'retrieve', id: id},function(data, status){if(status == 'success'){	modalCustom(id,'viewData', data);}});
 	}
 });
notifications();//chama de inicio as notificações laterais
$('#unseen #body_table').attr('disabled', 'disabled').html("<tr><td>Loading...</td></tr>");
