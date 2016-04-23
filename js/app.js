(function(BpmnModeler, $){
	var landing = `<?xml version="1.0" encoding="UTF-8"?>
						<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
  							<bpmn2:process id="Process_1" isExecutable="false">
    							<bpmn2:startEvent id="StartEvent_1"/>
  							</bpmn2:process>
  							<bpmndi:BPMNDiagram id="BPMNDiagram_1">
    							<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      								<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        								<dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
      								</bpmndi:BPMNShape>
    							</bpmndi:BPMNPlane>
  							</bpmndi:BPMNDiagram>
						</bpmn2:definitions>`;

	var importXML = function(xml){
		renderer.importXML(xml, function(error) {
			var container = $('#content-modeler .content')
		    if (error) {
		    	container.removeClass('with-diagram').addClass('with-error');
		    	console.error(error);
		    } else {
		    	alert('carregou');
		    	container.removeClass('with-error').addClass('with-diagram');
		    }
		});	
	};

	var setId = function(){
		var max = 0;
		project.talks.forEach(function(el){
			if(el.id > max) max = el.id;
		});

		return max+1;
	}

	var fillListTalks = function(){
		console.log(project.talks);
		listTaks.empty();
		project.talks.forEach(function(element){
			listTaks
			.append(
				$('<a href="#" data-id="' + element.id + '" class="list-group-item'+ (element.isDefault ? ' active' : '') +'">' + element.name + '</a>')
				.append(
					'<div class="pull-right">\
						<button class="btn btn-info btn-xs btn-edit-talk"><i class="fa fa-pencil"></i></button>\
		          		<button class="btn btn-danger btn-xs btn-remove-talk"><i class="fa fa-remove"></i></button>\
					</div>'
				)
			);
		});
	};

	var createTalk = function(){
		BootstrapDialog.show({
    		title: 'Criar Conversa',
    		message: '\
    				<form class="form-horizonal">\
						<div class="form-group">\
							<label class="control-label col-sm-2">Nome</label>\
							<div class="col-sm-10">\
								<input type="text" class="form-control" id="name-talk" />\
							</div>\
						</div>\
						<div class="form-group">\
							<div class="col-sm-10 col-md-offset-2">\
								<div class="checkbox">\
									<label>\
										<input type="checkbox" id="start-talk"> Conversa Inicial\
									</label>\
								</div>\
							</div>\
						</div>\
					</form>',
    		type: BootstrapDialog.TYPE_SUCCESS,
    		buttons: [
    			{
    				label:"Cancelar",
    				action: function(dialog){
    					dialog.close();
    				}
    			},
    			{
    				label: "Criar",
    				cssClass: "btn-success",
    				action: function(dialog){
    					var nameTalk = dialog.$modalContent.find('#name-talk').val();
    					var isDefault = dialog.$modalContent.find('#start-talk').is(':checked');
    					if(nameTalk.length){
    						var newTalk = 
    							{
                                    id: setId(),
    								name: nameTalk,
    								xml: landing,
                                    isDefault: isDefault
    							};

    						if(newTalk.isDefault) project.talks.forEach(function(el){el.isDefault = undefined})
    						project.talks.push(newTalk);

    						//Insere o projeto no localStorage
    						localStorage.setItem('current-project', JSON.stringify(project));
    						fillListTalks();
    						dialog.close();
    					}else{
    						BootstrapDialog.alert({
    							message: "Insira o nome da conversa",
    							type: BootstrapDialog.TYPE_DANGER
    						});
    					}
    				}
    			}
    		]
    	});
	}

	var updateTalk = function(element){
		BootstrapDialog.show({
    		title: 'Editar Conversa',
    		message: '\
    				<form class="form-horizonal">\
						<div class="form-group">\
							<label class="control-label col-sm-2">Nome</label>\
							<div class="col-sm-10">\
								<input type="text" class="form-control" id="name-talk" value="'+ element.name + '" />\
							</div>\
						</div>\
						<div class="form-group">\
							<div class="col-sm-10 col-md-offset-2">\
								<div class="checkbox">\
									<label>\
										<input type="checkbox" id="start-talk" '+(element.isDefault ? "checked" : "")+' /> Conversa Inicial\
									</label>\
								</div>\
							</div>\
						</div>\
					</form>',
    		type: BootstrapDialog.TYPE_WARNING,
    		buttons: [
    			{
    				label:"Cancelar",
    				action: function(dialog){
    					dialog.close();
    				}
    			},
    			{
    				label: "Confirmar",
    				action: function(dialog){
    					element.name = dialog.$modalContent.find('#name-talk').val();
	    				element.isDefault = dialog.$modalContent.find('#start-talk').is(':checked') ? true : undefined;
	    				if(!element.name.length){
	    					BootstrapDialog.alert({
    							message: "O nome da conversa é obrigatório",
    							type: BootstrapDialog.TYPE_DANGER
    						});
	    				}else{
	    					project.talks.forEach(function(el, index){
	    						console.log(el,index);
	    						if(element.id == el.id){
	    							project.talks[index] = element;
	    						} else if(element.isDefault) el.isDefault = undefined;
							});

	    					fillListTalks();
							dialog.close();
	    				}
    				}
    			}
    		]
    	});
	}

	var removeTalk = function(element){
		BootstrapDialog.confirm({
    		title: 'Remover Conversa',
    		message: 'Deseja realmente remover essa conversa?',
    		type: BootstrapDialog.TYPE_DANGER,
    		buttonCancelLabel: 'Cancelar',
    		buttonOKLabel: 'Confirmar',
    		callback: function(result){
    			if(result){
    				 project.talks = _.remove(project.talks, function(el){return el.id == element.id});
    				fillListTalks();
    			}
    		}
    	});
	}

	var project = JSON.parse(localStorage.getItem('current-project'));

	/***** Chamada do Modeler com o xml landing ******/
	var renderer = new BpmnModeler({
		container: $("#js-canvas")
	});

	importXML(project.talks[0].xml);
	
	/******** CRUD de Conversas **************/
	//Create
	$(".btn-add-talk").click(function(e){
		e.preventDefault();
		createTalk()
	})

	//Read
	var panelListTalks = $('#list-talks');
	var listTaks = panelListTalks.find('.list-group');
	fillListTalks();

	//Update
	$(document).on('click', '.btn-edit-talk', function(e){
		e.preventDefault();
		var id = parseInt($(this).parents('a').data('id'));

		updateTalk(_.find(project.talks, function(el){ return el.id == id }));
	});

	//Delete
	$(document).on('click', '.btn-remove-talk', function(e){
		e.preventDefault();
		var id = parseInt($(this).parents('a').data('id'));
		removeTalk(_.find(project.talks, function(el){ return el.id == id }));
	});

})(window.BpmnJS, jQuery);

