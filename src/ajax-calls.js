$(document).ready(function(){
    $(document).on('keyup','input#city',function(){
        $.ajax({
            url:'http://localhost:3000/api/city',
            method:'get',
            dataType:'json',
            success:function(response){
                if(response.msg=='success'){
                    if(response.data==undefined || response.data==null || response.data==''){
                        alert('incorrect data');
                    }else{
                        //Response OK
                        autocomplete($("input#city"), response.data)
                    }
                }else{
                    alert('some error ocurred');
                }
            },
            error:function(response){
                     alert('server error')
                     console.log(response)
            }
        });
    });
    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        console.log(inp.val());
        var a, b, i, val = inp.val();
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", inp.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        document.getElementById("autocomplete").appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            console.log(arr[i].city)
            if (arr[i].city.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].city.substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].city.substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i].city + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                document.getElementById("city").value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
            }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the $document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);}
          }
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
      }
});