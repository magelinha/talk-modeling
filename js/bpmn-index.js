(function(BpmnViewer, $){
	'use strict';

	var bpmnViewer = new BpmnViewer();

	function importXML(xml) {
		// import diagram
		bpmnViewer.importXML(xml, function(error) {
			if (error) {
	        	return console.error('could not import BPMN 2.0 diagram', error);
	      	}else {
	      		console.log('ok');
	      	}
	  	});
	}

	var btnFile = $("#import-xml");
	$("#open-project").click(function(e){
		e.preventDefault();
		btnFile.click();
	});

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

	$("#new-project").click(function(e){
		e.preventDefault();
		BootstrapDialog.show({
    		title: 'Criar Projeto',
    		message: '\
    				<form class="form-horizonal">\
						<div class="form-group">\
							<label class="control-label col-sm-4"> Nome do Projeto </label>\
							<div class="col-sm-8">\
								<input type="text" class="form-control" id="name-project" />\
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
    					var nameProject = dialog.$modalContent.find('#name-project').val();
    					if(nameProject.length){
    						//Cria o projeto
    						var project = new Object();
    						project.name = nameProject;
                            project.currentIdElements = 1; //Id do único objeto presente na tela
                            project.currentIdTalks = 1; //Id do único objeto presente na tela
    						project.talks = [
    							{
                                    id: 1,
    								name: "Landing",
    								xml: landing,
                                    isDefault: true,
                                    elements: [
                                        {
                                            id: 1, 
                                            type: 'start', 
                                            connections: []
                                        }
                                    ]
    							}
    						];
    						project.entities = [];

    						//Insere o projeto no localStorage
    						localStorage.setItem('current-project', JSON.stringify(project));
                            window.location = 'modeler.html';

    					}else{
    						BootstrapDialog.alert({
    							message: "Insira o nome do projeto",
    							type: BootstrapDialog.TYPE_DANGER
    						});
    					}
    				}


    			}
    		]
		});

	})

	btnFile.change(function(e){
		BootstrapDialog.show({
    		title: 'Erro!',
    		message: 'Erro ao carregar o arquivo escolhido. Tenha certeza de que o arquivo selecionado é um xml válido.',
    		type: BootstrapDialog.TYPE_DANGER,
    		buttons: [
    			{
    				label:"ok",
    				action: function(dialog){
    					dialog.close();
    				}
    			}
    		]
		});
	});

})(window.BpmnJS, jQuery);