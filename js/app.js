// This first line is used by jQuery. It waits until the "document" (the webpage) is fully loaded,
// then runs all the code below.
$(document).ready(function () {

    /*
        ============================================================
        This top section defines all the variables and functions used
        ============================================================
    */

    // Create a placeholder variable to fill in with the preloaded data
    let jsonData;

    // Define function to call when creating a new row
    function createNewRow(title, description) {
        rowHTML = 
            "<tr>" + 
                "<th>" + title + "</th>" + 
                "<td>" + description + "</td>" +
            "</tr>"
        // console.log(rowHTML);
        $('#glossary-table > tbody:last-child').append(rowHTML);
    }

    // Define function to create multiple rows at once, given the preloaded data
    function addJSONRows(data) {
        data.forEach(item => {
            createNewRow(item.title, item.description);
        });
    }

    // Define function to call Wikipedia
    function callWiki(searchTerm) {
        let result = {
            'title': '',
            'description': ''
        }
        // This jQuery function calls the Wikipedia API to get the title and description
        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            data: {
                action: 'query',
                list: 'search',
                srsearch: searchTerm,
                srprop: 'titlesnippet|snippet',
                format: 'json'
            },
            dataType: 'jsonp',
            success: function (data) {
                data = data.query.search[0];
                // console.log('wiki', data);
                result.title = data.titlesnippet;
                result.description = data.snippet;
                createNewRow(result.title, result.description);
            },
            fail: function (data) {
                // Define action to take if the Wikipedia call fails
            }
        });
    }

    /*
        ============================================================
        After defining the variables and functions above,
        This is the code that is run
        ============================================================
    */

    // Get the JSON (data object) with all the preloaded words/definitions we need
    // After getting the JSON, we call the addJSONRows function to add them into the table
    $.getJSON('js/data.json', function (data) {
        addJSONRows(data)
    });

    // We add a "listener" to the search form, and tell it what action to take on submission
    // In this case, we get the value of the input, and call the userSearch function
    $('#searchForm').submit(function(event) {
        input = $('#new-word').val();  // get the input value from the element with id "new-word"
        $('#new-word').val('');  // clear the input field on webpage
        callWiki(input);  // call Wikipedia. callWiki function also updates page after getting result
        return false;  // return false so page doesn't reload after form submission
    });

});
