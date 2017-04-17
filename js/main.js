/*global $, console, alert*/
$(document).ready(function () {
    
    "use strict";
    
    var contents,
        url,
        nm,
        em,
        sb,
        cm,
        dt,
        errors,
        collect,
        i,
        rsp,
        pageRsp;
    
    contents = {};
    dt = {};
    errors = [];
   
    // handle form
    function handleResponse(rsp) {
        // handle success
        $(".feedback").html(rsp);
        // clear form 
        $("#name").val("");
        $("#email").val("");
        $("#subject").val("");
        $("#comments").val("");
    }
    // handle error
    function handleErrors(jqXHR, textStatus, errorThrown) {
        console.log("textStatus: " + textStatus + "\n" + "errorThrown: " + errorThrown);
    }
    // validate form
    function validateForm(ev) {
        ev.preventDefault();

        // access form elements
        nm = $.trim($("#name").val());
        em = $.trim($("#email").val());
        sb = $.trim($("#subject").val());
        cm = $.trim($("#comments").val());
        
        // validate name
        if (nm === "") {
            errors.push("Please insert name");
        } else {
            dt.name = nm;
        }
        // validate email
        if (em === "") {
            errors.push("Please insert email");
        } else {
            dt.email = em;
        }
        // validate subject
        if (sb === "") {
            errors.push("Please insert subject");
        } else {
            dt.subject = sb;
        }
        // validate comments
        if (cm === "") {
            errors.push("Please insert comments");
        } else {
            dt.comments = cm;
        }
        // if no errors
        if (errors.length === 0) {
            // handle ajax request
            $.ajax({
                type: "POST",
                url: "./server-side-script/web-form.php",
                data: dt,
                dataType: "text"
            }).done(handleResponse).fail(handleErrors);
        } else {
            // report error(s)
            
            collect = "Please fix the following errors: ";
            
            collect += "<ul>";
            
            for (i = 0; i < errors.length; i += 1) {
                collect +=  "<li>" + errors[i] + "</li>";
            }
            
            collect += "</ul>";
            
            $(".feedback").html(collect);
            
            errors.length = 0;
            
            collect = "";
                   
        }
    }
    // load HTML partials 
    $(".bg-main .box").load("./partials/home.html", function (pageRsp) {
        contents["./partials/home.html"] = pageRsp;
    });
        
    // call storeContents
    function storeContents(urlParam) {
        if (contents[urlParam]) {
            $(".bg-main .box").html(contents[urlParam]);
            console.log("loaded from array");
        } else {
            $(".bg-main .box").load(urlParam, function (pageRsp) {
                contents[urlParam] = pageRsp;
                console.log("loaded by AJAX");
            });
        }
    }
    // handle navbar links on click event
    $(".bg-header a").on("click", function (ev) {
        ev.preventDefault();
        url = $(this).attr("href");
        storeContents(url);
        $(".bg-main .box").on("submit", "form", validateForm);
    });
});