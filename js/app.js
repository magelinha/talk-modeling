(function(){
	
	var modeler = new TalkModeling();
	modeler.init();
	
	/******** CRUD de Conversas **************/
	//Create
	$(".btn-add-talk").click(function(e){
		e.preventDefault();
		modeler.createTalk();
		//createTalk()
	})

	//Update
	$(document).on('click', '.btn-edit-talk', function(e){
		e.preventDefault();
		e.stopPropagation();
		var id = parseInt($(this).parents('a').data('id'));

		updateTalk(id);
	});

	//Delete
	$(document).on('click', '.btn-remove-talk', function(e){
		e.preventDefault();
		e.stopPropagation();
		var id = parseInt($(this).parents('a').data('id'));

		modeler.removeTalk(id);
	});

	/******** Abrir conversa **************/
	$(document).on('click', '.link-talk', function(e){
		e.preventDefault();
		var id = parseInt($(this).parents('a').data('id'));
		
		modeler.openDiagram(id);
	});

	/******** Importar e Exportar projeto **************/

	/******** CRUD de Entidades **************/
	$('#crud-entities').click(function(e){
		e.preventDefault();
		BootstrapDialog.alert({
			title: "Cadastro de Entidades",
			message: $('<div />').load('crud-entities.html'),
			
		})		
	})
	/******** Update on Renderer **************/	

})();

