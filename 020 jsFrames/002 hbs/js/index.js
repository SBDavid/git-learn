window.onload = function() {
    var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);

    var context = {
        title: "All about <p> Tags",
        body: "<p>This is a post about &lt;p&gt; tags</p>"
    };
    var html = template(context);

    document.body.innerHTML = html;

    Handlebars.registerHelper('list', function(items, options) {
        var out = "<ul>";

        for (var i = 0, l = items.length; i < l; i++) {
            out = out + "<li>" + options.fn(items[i]) + "</li>";
        }

        return out + "</ul>";
    });
    var sourceList = document.getElementById("list-template").innerHTML;
    var templateList = Handlebars.compile(sourceList);

    document.body.innerHTML = document.body.innerHTML + templateList({
        people: [{
                firstName: "Yehuda",
                lastName: "Katz"
            },
            {
                firstName: "Carl",
                lastName: "Lerche"
            },
            {
                firstName: "Alan",
                lastName: "Johnson"
            }
        ]
    });

    // helper
    Handlebars.registerHelper('fullName', function(person) {
        return person.firstName + " " + person.lastName;
    });
    var templateHelper = Handlebars.compile(document.getElementById("help-template").innerHTML);
    document.body.innerHTML = document.body.innerHTML + templateHelper({
        author: {
            firstName: "Yehuda",
            lastName: "Katz"
        },
    });

    // Partials
    Handlebars.registerPartial('userMessage',
        '<{{tagName}}>By {{author.firstName}} {{author.lastName}}</{{tagName}}>' +
        '<div class="body">{{body}}</div>');

    var context = {
        author: {
            firstName: "Alan",
            lastName: "Johnson"
        },
        body: "I Love Handlebars",
        comments: [{
            author: {
                firstName: "Yehuda",
                lastName: "Katz"
            },
            body: "Me too!"
        }]
    };

    var templatePartials = Handlebars.compile(document.getElementById("partials-template").innerHTML);
    document.body.innerHTML = document.body.innerHTML + templatePartials(context);

    // my-Partials
    Handlebars.registerPartial('mypartials', document.getElementById("my-name-template").innerHTML);
    var contextMyname = {
        people: {
            firstname: 'Gorge',
            lastName: 'Song'
        }
    };

    var templateMyPartials = Handlebars.compile(document.getElementById("my-partials-template").innerHTML);
    document.body.innerHTML = document.body.innerHTML + templateMyPartials(contextMyname);

    // if
    var templateIf = Handlebars.compile(document.getElementById("if-template").innerHTML);
    document.body.innerHTML = document.body.innerHTML + templateIf({author: true});
}