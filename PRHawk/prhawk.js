$(document).ready(function(){
	//Page load
    $('#txtGitHubUserName').focus();
    $('#allRepos').hide();
    $("#loadingDiv").hide();
    
	
	//Clear Results and Entered UserName
    $('#btnClear').click(function(){
        $('#btnGetRepo').show();
        $('#allRepos').dataTable().fnClearTable();
		$('#allRepos').dataTable().fnDestroy();
        $('#allRepos').hide();
        $("#loadingDiv").hide();
		$('#txtGitHubUserName').val('');
    });
	
	//Return the user name entereds repository
    $('#btnGetRepo').click(function(){
        var userAccountName = $('#txtGitHubUserName').val();
		if(userAccountName.length == 0){
			swal("Oh no!", "Please enter a GitHub Username!", "error");
		}
		else if(!CheckUserName(userAccountName)){
			$('#txtGitHubUserName').val('');
            swal("Oh no!", "The GitHub Username provided is not valid! Please try again!", "error");
		}
		else{
		
		$("#loadingDiv").show();
        var apiUserName = "snkirklandinterview";
        var apiToken = "cfa90523b17630e84a04a4cbd57dc5d89d907239";
        
        $.ajax({
          url: "https://api.github.com/users/" + userAccountName + "/repos",
          type: 'GET',
          dataType: "json",
          headers: {
                    "Authorization": "Basic " + btoa(apiUserName + ":" + apiToken)
                      },
          success: function(data) {
            if(data.length == 0){
				$("#loadingDiv").hide();
				$('#txtGitHubUserName').val('');
				swal(userAccountName + "has no Repositories..", "Please try a different GitHub UserName!", "warning");
			}
			else{
			$('#btnGetRepo').hide();
            $('#allRepos').show();
            $("#loadingDiv").hide();
			
            $('#allRepos').DataTable( {
            	"searching": false,
                "AutoWidth": false,
                "order": [[ 1, "desc" ]],

                data: data,                         
                columns: [
                    {
                    "render": function ( data, type, row, meta) {
                        var urlString = row["html_url"] + "/pulls?state=open" ;
                        data = '<a target="_blank" href="'+urlString+'"> ' + row["name"] + '</a';
                            return data;
                    }},

                  {"data": "open_issues_count" }
                ]

            }); 
			}

          },

          error: function() {
          	$('#txtGitHubUserName').val('');
            $("#loadingDiv").hide();
            $('#allRepos').hide();
            $('#btnGetRepo').show();
            swal("Oh no!", "The GitHub Username provided does not exist! Please try again!", "error");

          }
        });
	}

    })
	

}); 

//Regex to validate GitHub Username
function CheckUserName(userName){
	var userNameRegEx = new RegExp(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i);
	return userNameRegEx.test(userName);	
}