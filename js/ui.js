var PARAMS = {};

function getKeys(obj){
	//return a list of keys for an object
	return Object.keys(obj);
}

function getParams(apis) {
	//take in the client.apis names and return list of all parameters from all apis
	//list contains name:type of parameter for each item
	//params with type == null are discarded
	var param_obj ={};
    for(a=0;a<apis.length;a++){
    	var cur_op = apis[a].name;
    	var methods = getKeys(client.apis[cur_op].apis)
    	for(b=0;b<methods.length;b++){
			var params = client.apis[cur_op].apis[methods[b]].parameters
			for(c=0;c<params.length;c++){
				if(params[c].type != null){
					var new_obj = {};
					if(params[c].type == 'array'){
						if(getKeys(params[c].items).includes("enum")){
							new_obj.type = params[c].type;
							new_obj.enum = params[c].items.enum;
							param_obj[params[c].name+'|'+params[c].type] = new_obj;
						}
						else{
							new_obj.type = params[c].type
							param_obj[params[c].name+'|'+params[c].type]= new_obj;
						}

					}
					else{
						new_obj.type = params[c].type
						param_obj[params[c].name+'|'+params[c].type] = new_obj;
					}
				}
			}
		}
	}
	return param_obj;
}

function updateParams(param){
	var element = document.getElementById(param);
	var paramname = param.split('|')[0];
	var paramtype = param.split('|')[1];
	if(paramtype == 'file'){
		PARAMS[paramname] = element.files[0];
	}
	else{
		PARAMS[paramname] = element.value;
	}
}

function requestOutput(method,url,status){
	pelement = document.getElementById("output");
	element = document.createElement('p');
	element.innerHTML = method+' | '+url//+' | '+status;
	pelement.appendChild(element);
}

function autoFill(){
	var elements = document.getElementsByClassName("inputbody");
	for(i=0;i<elements.length;i++){
		if(elements[i].tagName == 'INPUT'){
			var type = elements[i].id.split('|')[1];
			if(type == 'string' || type == 'array'){
				elements[i].value = "test";
				elements[i].onchange()
			}else if(type == 'integer'){
				elements[i].value = 1;
				elements[i].onchange()
			}else if(type == 'boolean'){
				elements[i].value = 1;
				elements[i].onchange()
			}else{
			    console.log("Unhandled default type (type " + type + ")")
			}
		}
	}
}

function executeAll(apis){
	for(a=0;a<apis.length;a++){
		var cur_op = apis[a].name;
		var methods = getKeys(client.apis[cur_op].apis);
		for(b=0;b<methods.length;b++){
			console.log(client.apis[cur_op].apis[methods[b]]);

			method_params = client.apis[cur_op].apis[methods[b]].parameters;
			for(c=0;c<method_params.length;c++){
				if(method_params[c].sampleJSON != null){
					var body = method_params[c].sampleJSON;
				}
			}
			PARAMS.body = body;
			request = client.apis[cur_op].apis[methods[b]].execute(PARAMS);
			requestOutput(request.method,request.url,request.status);
		}
	}
}


function buildForm(parentId, elementTag, elementId,type) {
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
	newElement.setAttribute('class', 'inputbody');
    newElement.setAttribute('type',type);
    newElement.setAttribute('onchange','updateParams(this.id)');
    var textElement = document.createTextNode(elementId+': ');
    var labelElement = document.createElement('label');
    labelElement.setAttribute('for',elementId);
    p.appendChild(labelElement);
    labelElement.appendChild(textElement)
    p.appendChild(newElement);
   	breakElement = document.createElement('br');
	p.appendChild(breakElement);
}



var apis = null;

function init(json){
		if(json[0] == '{'){
			json = btoa(json)
			json = 'data:application/json;base64,'+json;
		}

		//empty and previous input form
    	var element = document.getElementById("info");
    	element.innerHTML = "";
    	var element = document.getElementById("input-form-container");
    	element.innerHTML = "";
    	var element = document.getElementById("head");
    	element.innerHTML = '<label>Parameter | Type</label><hr>'

   // initialize swagger client
   var API_KEY = document.getElementById('api-key').value;

  window.client = new SwaggerClient({
    url: json,
    success: function() {
    	document.getElementById("info").innerHTML = '<h2>'+client.info.title+'</h2>';
    	client.useJQuery = true
        apis = client.apisArray;
        var all_params = getParams(apis);
        var all_param_names = getKeys(all_params)
        var unique_params = Array.from(new Set(all_param_names));


////////////////builds the input form from unique parameters
        for(p of unique_params){
        	if(all_params[p].type == 'file'){
        		buildForm("input-form-container","input",p,"file");
        	}
        	else if(getKeys(all_params[p]).includes("enum")){
        		buildForm("input-form-container","select",p,"text");
        		var selElement = document.getElementById(p);
        		for(op of all_params[p].enum){
        			var option = document.createElement("option");
        			option.text = op;
        			selElement.add(option);
        		}
        	}
        	else{
         		buildForm("input-form-container","input",p,"text");
        	}
        }

    },
       	authorizations : {
			authHeader: new SwaggerClient.ApiKeyAuthorization('Authorization', 'Bearer '+API_KEY, 'header'),
  		}
  });
}
