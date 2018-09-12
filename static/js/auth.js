---
---

var APIBaseUrl = {{ site.requesturl }}

$(document).ready(() => {
   resetPasswordDOM();
   changePasswordAction();
   authenticate();
   resetPasswordAction();
});
function authenticate() 
{
   $('.authenticate').on('click', e => {
      e.preventDefault();
      // console.log($('.loginButton').hasClass('authenticate'))
         // return false;

      var data = {
         email: $('#email').val(),
         password: $('#password').val()
      }

      $.ajax({
         url: APIBaseUrl + '/login',
         type: 'POST',
         dataType: 'json',
         headers: {
             'Content-Type': 'application/json'
         },
         crossDomain: true,
         data: JSON.stringify(data),
         success: data => {
            if (data.success == true) {
               window.location.href = "{{ site.basepath }}/dashboard";
               localStorage.setItem('token', data.token);
            } else {
               swal({
                 type: 'error',
                 title: 'Gabim',
                 text: data.msg,
              }).then((result) => {
                 if (result.value && data.success) {
                    $('#import-data-form').trigger("reset");
                 }
              });
            }
         }
      })
   });

}

/*
* It manipulates login form in order to proceed with reset password functionality
*/
function resetPasswordDOM()
{
   $('#resetPasswordLink').on('click', function(e) {
      e.preventDefault();
      $('#login').addClass('hideItem')
      $('#resetPassword').removeClass('hideItem')
   })

   $('#goToLoginForm').on('click', function(e)
   {
      e.preventDefault();
      $('#resetPassword').addClass('hideItem')
      $('#login').removeClass('hideItem')
   })
}

/*
* Send email to user with unique link to reset password
*/
function resetPasswordAction()
{
   $('.resetPasswordButton').on('click', function(e) {
      e.preventDefault();

      let data = {
         email: $('#emailForgotPassword').val()
      }
      swal({
        title: 'Duke kontrullar!',
        onOpen: () => {
            swal.showLoading()
        }
    });
      $.ajax({
         url: APIBaseUrl + '/forgot_password',
         type: 'POST',
         dataType: 'json',
         headers: {
             'Content-Type': 'application/json'
         },
         crossDomain: true,
         data: JSON.stringify(data),
         success: data => {
            if (data.success == true) {
               swal("Sukses!",data.msg,"success");
            } else {
                swal("Gabim!","Email është gabim!","error");
            }
         }
      })
   })
}

function changePasswordAction() 
{
   $('#submitNewPassword').on('click', function(e) {
      e.preventDefault();


      let code = findGetParameter('code');

      let data = {
         newPassword: $('#password').val(),
         repeatNewPassword: $('#retypePassword').val(),
         code: code
      }
      if(data.newPassword == data.repeatNewPassword) {
        swal({
            title: 'Duke ndryshuar fjalëkalimin!',
            onOpen: () => {
                swal.showLoading()
            }
          });
        $.ajax({
            url: APIBaseUrl + '/reset_password/' + code ,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            crossDomain: true,
            data: JSON.stringify(data),
            success: data => {
               if (data.success == true) {
                   swal("Sukses!",data.msg,"success").then(result => {
                       if(result.value) {
                           window.location = "{{ site.basepath }}/login"
                       }
                   });
               } else {
                   swal("Gabim!",`Ka dështuar kërkesa, shkaku ështē ky: ${data.msg}`,"error");
               }
            }
         })
      } else {
        swal("Gabim!","Fjalëkalimet nuk përputhen!","error");
      }
   })

}


function checkIfDateExpired() {
    let code = findGetParameter('code');
    console.log(code)
    $.ajax({
        url: APIBaseUrl + '/reset_password/' + code ,
        type: 'GET',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        },
        crossDomain: true,
        success: data => {
           if (data.success ==  false) {
            window.location = "{{ site.basepath }}/login"
           } 
        }
     })
}


// src: https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
// Get code from url
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

(function () {

}())
