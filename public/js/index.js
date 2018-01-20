$(document).ready(function(){

  $('.deleteUser').click(deleteUser);

  function deleteUser() {
    var confirmation = confirm('Are you Sure?');

    if (confirmation){
      $.ajax({
        type: 'DELETE',
        url: '/users/delete/'+$(this).data('id')
      });
      window.location.replace('/');
    }else {
      return false;
    }
  }

});
