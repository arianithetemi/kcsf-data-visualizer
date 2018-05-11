---
---

var APIBaseUrl = {{ site.requesturl }}

$(document).ready(() => {
   $('#login').on('submit', e => {
      e.preventDefault();

      var data = {
         email: $('#email').val(),
         password: $('#password').val()
      }

      $.ajax({
         url: APIBaseUrl + 'login',
         type: 'POST',
         dataType: 'json',
         headers: {
             'Content-Type': 'application/json'
         },
         crossDomain: true,
         data: JSON.stringify(data),
         success: data => {
            if (data.success == true) {
               window.location.href = "/kcsf-data-visualizer/dashboard";
               localStorage.setItem('token', data.token);
            } else {
               alert("Wrong");
            }
         }
      })
   });
});
