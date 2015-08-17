/**
 * Add rows of fields and bind action to them.
 * Create a button w/ [data-add-rows] with the ID of your container div as ID. NOTE : Button add must be outside container group.
 * and [data-template] which is the name of the template to use with mustache.js template system
 *
 * Create a template using mustache.js teplate system.
 * Group all the inputs to add in a div group as they can be removed all at once.
 * Be sure to use the mustache tag {{group_id}} as ID for your tamplate. It will be remplaced bu an incremental ID.
 */
var AddRowHelper = function() {};

/**
 * Init the the AddRowHelper,
 * search for the [data-add-rows] attribute in the document
 * and bind action to the buttons [add/remove]
 * 
 * @param  {Function} callback This callback function is used to extend the behaviour of the helper and bind other actions to the row groups.
 */
AddRowHelper.initAddRow = function(callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};
    
    var buttonAdds = document.querySelectorAll('[data-add-rows]');
    for (var i = 0; i < buttonAdds.length; i++) {
        var nodeGroup = document.getElementById(buttonAdds[i].getAttribute('data-add-rows'));
        buttonAdds[i].addEventListener('click', function(){
            AddRowHelper.addRowListeners(this, callback);
        });
        AddRowHelper.addExistRowListeners(nodeGroup, callback);
    };
}


AddRowHelper.addExistRowListeners = function (nodeGroup, callback){
    for (var i = 0; i < nodeGroup.children.length; i++) {
        AddRowHelper.removeRowListeners(nodeGroup, nodeGroup.children[i]);
        callback(nodeGroup.children[i]);
    }
}

AddRowHelper.addRowListeners = function(button, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};

    var ndeGroupId  =    button.getAttribute('data-add-rows');
    var nodeGroup   = document.getElementById(ndeGroupId);
    var templateId  = button.getAttribute('data-template')? button.getAttribute('data-template') : 'template';
    var template    = document.getElementById(templateId).innerHTML;

    button.addEventListener('click', AddRowHelper.addRow(template, nodeGroup, function(nodeGroup, row) {
        AddRowHelper.removeRowListeners(nodeGroup, row);
        callback(row);
    }, ndeGroupId));
}

AddRowHelper.removeRowListeners = function(nodeGroup, row) {
    var buttonRemove = row.querySelector('[data-remove-row]');
    buttonRemove.addEventListener('click', function(){
        nodeGroup.removeChild(row);
    });
}

/**
 * Simple helper for adding rows of inputs in a form using mustache.js as template engine.
 * @param {Object}   template          html template using mustache tags to fill with customs values.
 * @param {Object}   nodeGroup         html group target which will be the parent of the created element.
 * @param {Function} callback          action to execute on the created element after it has been added to the DOM.
 * @param {String}   idSelector        custom selector ID name to set for the created element (concatenated with the row number).
 * @param {Object}   replaceInTemplate json object which contain value to fill musqtache tags.
 */
AddRowHelper.addRow = function(template, nodeGroup, callback, idSelector, replaceInTemplate) {
    rowCount = nodeGroup.children.length;
    idSelector = typeof idSelector !== 'undefined' ? idSelector + '-' + rowCount : "added-field-" + rowCount;
    replaceInTemplate = typeof replaceInTemplate !== 'undefined' ? replaceInTemplate : {};
    
    replaceInTemplate.group_id = idSelector;
    Mustache.parse(template);
    template = Mustache.render(template, replaceInTemplate);

    var wrapper = document.createElement('div');
        wrapper.innerHTML = template.trim();
    var row = wrapper.querySelector('#' + idSelector);

    nodeGroup.appendChild(row);
    callback(nodeGroup, row);
}
