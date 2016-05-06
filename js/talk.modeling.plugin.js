(function(BpmnModeler) {
	this.TalkModeling = function () {
		this.landing = `<?xml version="1.0" encoding="UTF-8"?>
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

		this.BootstrapDialogMessages = {
			createTalk: '\
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
					</form>'
		}

		this.renderer = new BpmnModeler({container: $("#js-canvas")}), // modeler do bpmn.io;
		this.project = JSON.parse(localStorage.getItem('current-project'));
		this.currentId = this.project.currentId;
		this.panelListTalks =  $('#list-talks');
		this.listTalks = $('#list-talks').find('.list-group');
	}

	var getUpdateForm = function(element){
		return '\
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
					</form>';
	};

	TalkModeling.prototype.importXML = function(xml) {
		this.renderer.importXML(xml, function(error) {
			var container = $('#content-modeler .content')
		    if (error) {
		    	container.removeClass('with-diagram').addClass('with-error');
		    	console.error(error);
		    } else {
		    	container.removeClass('with-error').addClass('with-diagram');
		    }
		});
	};

	TalkModeling.prototype.setEvents = function(){
		var eventBus = this.renderer.get('eventBus');
		eventBus.on('shape.added', function(event){
			console.log('adicionou');
		});

		eventBus.on('create.start', function(event){
			console.log('criando');
		});
	}

	TalkModeling.prototype.init = function() {
	 	console.log(this);
		//Carrega o xml do primeiro elemento do projeto
		this.importXML(this.project.talks[0].xml); 

		//testes para criação de eventos
		this.setEvents();

		//Preenche a lista de conversas
		this.fillListTalks();
	}; 

	TalkModeling.prototype.checkUniqueName = function(element) {
		var finded = _.find(this.project.talks, function(el){ 
			return el.id != element.id && el.name.toUpperCase() == element.name.toUpperCase();
		});

		return typeof(finded) != 'undefined' && finded != null;
	};

	TalkModeling.prototype.fillListTalks = function() {
		var list = this.listTalks;
		list.empty();

		this.project.talks.forEach(function(element){
			list
			.append(
				$('<a href="#" data-id="' + element.id + '" class="list-group-item link-talk'+ (element.isDefault ? ' active' : '') +'">' + element.name + '</a>')
				.append(
					'<div class="pull-right">\
						<button class="btn btn-info btn-xs btn-edit-talk"><i class="fa fa-pencil"></i></button>\
		          		<button class="btn btn-danger btn-xs btn-remove-talk"><i class="fa fa-remove"></i></button>\
					</div>'
				)
			);
		});
	};

	TalkModeling.prototype.getElement = function(id) {
		return _.find(this.project.talks, function(el){ return el.id == id });
	}

	TalkModeling.prototype.setIdElement = function() {
		this.currentElementId++;
		return TalkModeling.currentElementId;
	};

	TalkModeling.prototype.setIdTalk = function() {
		this.currentTalkId++;
		return this.currentTalkId;
	};

	TalkModeling.prototype.createTalk = function() {
		BootstrapDialog.show({
    		title: 'Criar Conversa',
    		message: this.BootstrapDialogMessages.createTalk,
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
    					
    					//Verifica se não está vazio o campo
    					if(nameTalk.length){
    						
    						//Verifica se já existe uma conversa com o nome inserido
    						var verifyName = _.find(project.talks, function(el){return el.name.toUpperCase() == nameTalk.toUpperCase() });
    						if(verifyName != undefined){
    							BootstrapDialog.alert({
	    							message: "Já existe uma conversa com esse nome.",
	    							type: BootstrapDialog.TYPE_DANGER
	    						});
	    						return;
    						}

    						var newTalk = 
    							{
                                    id: this.setIdTalk(),
    								name: nameTalk,
    								xml: landing,
                                    isDefault: isDefault,
                                    elements: [
                                        {
                                            id: this.setIdElement(), 
                                            type: 'start', 
                                            connections: []
                                        }
                                    ]
    							};

    						if(newTalk.isDefault) project.talks.forEach(function(el){el.isDefault = undefined})
    						project.talks.push(newTalk);

    						//Insere o projeto no localStorage
    						localStorage.setItem('current-project', JSON.stringify(this.project));
    						this.fillListTalks();
    						dialog.close();
    					} else{
    						BootstrapDialog.alert({
    							message: "Insira o nome da conversa.",
    							type: BootstrapDialog.TYPE_DANGER
    						});
    					}
    				}
    			}
    		]
    	});
	};

	TalkModeling.prototype.updateTalk = function(id) {
		var element = getElement(id);

		BootstrapDialog.show({
    		title: 'Editar Conversa',
    		message: getUpdateForm(element),
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
	    				} else if(!this.checkUniqueName(element)){
	    					BootstrapDialog.alert({
    							message: "Já existe uma conversa com esse nome",
    							type: BootstrapDialog.TYPE_DANGER
    						});
	    				} else{
	    					project.talks.forEach(function(el, index){
	    						if(element.id == el.id){
	    							this.project.talks[index] = element;
	    						} else if(element.isDefault) el.isDefault = undefined;
							});

	    					this.fillListTalks();
							dialog.close();
	    				}
    				}
    			}
    		]
    	});
	};

	TalkModeling.prototype.removeTalk = function(id) {
		var element = getElement(id);

		BootstrapDialog.confirm({
    		title: 'Remover Conversa',
    		message: 'Deseja realmente remover essa conversa?',
    		type: BootstrapDialog.TYPE_DANGER,
    		buttonCancelLabel: 'Cancelar',
    		buttonOKLabel: 'Confirmar',
    		callback: function(result){
    			if(result){
    				this.project.talks = _.remove(project.talks, function(el){return el.id == element.id});
    				TalkModeling.fillListTalks();
    			}
    		}
    	});
	};

	TalkModeling.prototype.openDiagram = function(id) {
		var element = getElement(id);
		importXML(element.xml);
	};


}(window.BpmnJS))