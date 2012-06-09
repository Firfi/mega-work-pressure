(function() {
    var fieldGroupDiv = jQuery('<div/>', {
        id : 'pressure-field-group'
    }).addClass('field-group');
    var actionRef;
    var assigneeFieldSelector = '#assignee-field';
    var findUsername = /\(([^()]*)\)$/;
    var pressureLink = jQuery('<a/>',{
           href : actionRef,
           text : 'Задачи на этом пользователе',
           id : 'pressure-link',
       }).addClass('trigger-dialog');

    var pressureHtml = fieldGroupDiv.append(pressureLink);
    var dialog;
    var projectKey;
    var priority;

    jQuery(document).delegate(assigneeFieldSelector,"click", init);
    function init() {

        if (!dialog) {
           dialog = new JIRA.FormDialog({
              trigger: pressureLink,
              id: pressureLink.id + "-dialog",
              ajaxOptions: {
                  url: pressureLink.href,
                  data: {
                      decorator: "dialog",
                      inline: "true",
                  }
              }
            });
        }
        projectKey = jQuery('#assignee-container fieldset.hidden.parameters input').attr('value');
        if (!(projectKey == 'MP' || projectKey == 'PU2')) return;
        actionRef = AJS.params.baseURL + "/secure/UserPressureAction.jspa";

        var ascentorDiv = jQuery(assigneeFieldSelector).closest('div.field-group');
        pressureHtml.insertAfter(ascentorDiv);

    }
    jQuery(document).delegate("#assignee-suggestions","click", function(){
        if (!dialog) init();
        var pr = jQuery('#pressure-link');
        pr.hover(initHover);
        function initHover() {
            var pr = jQuery('#pressure-link');
            var option = jQuery('#assignee-single-select li.active a');
            var name = findUsername.exec(option.attr('title'));
            if (!name) {
                pressureHtml.hide();
                return;
            } else {
                name = '?user=' + name[1];
            }

            priority = jQuery('select#priority').val();
            name = name + "&project=" + projectKey + "&priority=" + priority;
            pr.attr('href', actionRef + name);
        }
       pressureHtml.show();
       pressureLink.attr('href',actionRef);
    });
    jQuery(document).delegate('#assign-to-me-trigger','click', function() {
        init();
        var pr = jQuery('#pressure-link');
        pr.unbind('mouseenter mouseleave');
        var name = jQuery('#assignee-field').val();
        if (!name) {
            pressureHtml.hide();
            return;
        }
        name = '?user=' + name;
        name = name + "&project=" + projectKey;
        name = name + "&priority=" + priority;
        pr.attr('href', actionRef + name);
        pressureHtml.show();
    });




})();
