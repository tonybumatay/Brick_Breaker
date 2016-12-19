document.getElementById("createAccount-btn").addEventListener("click", function(){
	var usernameCreate = document.getElementById("usernameCreate").value;
	var passwordCreate = document.getElementById("passwordCreate").value;
	var passwordVerify = document.getElementById("passwordVerify").value;
    if(usernameCreate == "" || passwordCreate == "" || passwordVerify == ""){
    	alert("please fill in all of the fields");
    } else if(passwordCreate != passwordVerify){
    	alert("Please make sure your passwords match");
    } else {
    	sendUserInfo(usernameCreate, passwordCreate, passwordVerify);
    }
});


document.getElementById("login-btn").addEventListener("click", function(){
	
	var usernameLogin = document.getElementById("usernameLogin").value;
	var passwordLogin = document.getElementById("passwordLogin").value;
	if(usernameLogin == "" || passwordLogin == ""){
    	alert("please fill in all of the fields");
	} else {
		login(usernameLogin, passwordLogin);
	}
});