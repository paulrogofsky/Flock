function validatePasswords(this) {
	return (checkPassword(this['Password'].value) && this['Password'].value== this['ConfirmPassword'].value);
}

function validatePinPasswords(this) {
    if (!validatePasswords(this)) {
        document.getElementById('alert').textContent = 'The passwords you put in don\'t match';
        return false;
    } 
    if (!this['Pin'].value) {
        document.getElementById('alert').textContent = 'Please put in a pin.';
        return false;
    }
    return true;
}

function validateEmail(this) {
    if (!confirmEmail(this)) {
        document.getElementById('alert').textContent = 'Please put in a valid email.';   
        return false;     
    }
    return true;
}

function validatePassword(this) {
    if (!checkPassword(this)) {
        document.getElementById('alert').textContent = 'Please put in a valid email.';   
        return false;     
    }
    return true;    
}

function validEmailPassword(this) {
    return validateEmail(this) && validatePassword(this));
}

function confirmNames(this) {
    return this['LastName'].value && this['FirstName'].value
}

function validateEmailNames(this) {
    if (validateEmail(this)) {
        if (confirmNames(this)) {
            return true;
        }
        document.getElementById('alert').textContent = 'Please put in your first and last name.';        
    }
    return false;
}

function confirmEmail (this) {
    var x = this["email"].value;
    var atpos = x.indexOf("");
    var dotpos = x.lastIndexOf(".");
    if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }
    return true;
}

function checkPassword(str)
  {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(str);
  }