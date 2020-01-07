$(function(){
    function pageLoad(){
        $('.widget').widgster();
        $('.sparkline').each(function(){
            $(this).sparkline('html',$(this).data());
        });
        $('.js-progress-animate').animateProgressBar();
        $('#create-session-field').click(createSessionField);
        initFields();
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});

function instantiateTemplate(select) {
    // get the template and clone it
    return $(document.importNode(
        document.querySelector(select).content,
        true));
}

// ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
// TODO: Insert by name alphabetical order.
function addSessionRow(field) {
    // new row, set the values
    const row = instantiateTemplate('#session-row');
    row.find('tr').data('field-name', field.name);
    row.find('td').first().text(field.name);
    row.find('input').val(field.value);
    // set the save/remove handlers
    row.find(  '.save-session-field').click(  saveSessionField);
    row.find('.remove-session-field').click(removeSessionField);
    // append the new row to the table
    $('#session-table > tbody').append(row);
}

async function initFields() {
    const resp = await fetch('/api/session/field');
    if ( resp.status !== 200 ) {
        // first the error message
        const msg = `Session field retrieval returned an error: ${resp.status} - ${resp.statusText}`;
        console.log(msg);
        alert(msg);
        // then the body of the response
        const body = await resp.text();
        console.log(body);
        throw new Error(msg);
    }
    else {
        const json = await resp.json();
        json.fields.forEach(addSessionRow);
    }
}

async function saveSessionField(event) {
    event.stopPropagation();
    const row   = $(this).closest('tr');
    const name  = row.data('field-name');
    const field = {name, value: row.find('input').val()};
    const resp = await fetch(`/api/session/field/${name}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(field)
    });
    if ( resp.status !== 200 ) {
        // first the error message
        const msg = `Session field removal returned an error: ${resp.status} - ${resp.statusText}`;
        console.log(msg);
        alert(msg);
        // then the body of the response
        const body = await resp.text();
        console.log(body);
        throw new Error(msg);
    }
    else {
        const json = await resp.json();
        console.log(`Saved field: ${name}`);
    }
}

async function removeSessionField(event) {
    event.stopPropagation();
    const row  = $(this).closest('tr');
    const name = row.data('field-name');
    const resp = await fetch(`/api/session/field/${name}`, {method: 'DELETE'});
    if ( resp.status !== 200 ) {
        // first the error message
        const msg = `Session field removal returned an error: ${resp.status} - ${resp.statusText}`;
        console.log(msg);
        alert(msg);
        // then the body of the response
        const body = await resp.text();
        console.log(body);
        throw new Error(msg);
    }
    else {
        const json = await resp.json();
        console.log(`Removed field: ${name}`);
        row.remove();
    }
}

async function createSessionField(event) {
    event.stopPropagation();
    const name  = $('#session-field-name').val();
    const field = { name, value: '' };
    addSessionRow(field);
    const resp = await fetch('/api/session/field', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(field)
    });
    if ( resp.status !== 200 ) {
        // first the error message
        const msg = `Session field crceation returned an error: ${resp.status} - ${resp.statusText}`;
        console.log(msg);
        alert(msg);
        // then the body of the response
        const body = await resp.text();
        console.log(body);
        throw new Error(msg);
    }
    else {
        const json = await resp.json();
        console.dir(json);
    }
}
