function validatePasswords(form) {
    return (checkPassword(form['Password'].value) && form['Password'].value== form['ConfirmPassword'].value);
}

function validatePinPasswords(form) {
    if (!validatePasswords(form)) {
        document.getElementById('alert').textContent = 'The passwords you put in don\'t match';
        return false;
    } 
    if (!form['Pin'].value) {
        document.getElementById('alert').textContent = 'Please put in a pin.';
        return false;
    }
    return true;
}

function validateEmail(form) {
    if (!confirmEmail(form)) {
        document.getElementById('alert').textContent = 'Please put in a valid email.';   
        return false;     
    }
    return true;
}

function validatePassword(form) {
    if (!checkPassword(form)) {
        document.getElementById('alert').textContent = 'Please put in a valid email.';   
        return false;     
    }
    return true;    
}

function validEmailPassword(form) {
    return validateEmail(form) && validatePassword(form);
}

function confirmNames(form) {
    return form['LastName'].value && form['FirstName'].value
}

function validateEmailNames(form) {
    if (validateEmail(form)) {
        if (confirmNames(form)) {
            return true;
        }
        document.getElementById('alert').textContent = 'Please put in your first and last name.';        
    }
    return false;
}

function confirmEmail (form) {
    console.log(form);
    var x = form["email"].value;
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
