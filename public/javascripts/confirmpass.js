function validatePasswords(form) {
    console.log(form.elements['Password'].value);
    console.log(form.elements['ConfirmPassword'].value);
    return ( form.elements['Password'].value== form.elements['ConfirmPassword'].value);
}

function validatePinPasswords(form) {
    if (!validatePasswords(form)) {
        document.getElementById('alert').textContent = 'The passwords you put in don\'t match';
        return false;
    } 
    // TODO FIX VALIDATE GOOD PASSWORD!
    // if (!checkPassword(form.elements['Password'].value)) {
    //     document.getElementById('alert').textContent = 'The passwords you put in is not secure enough. Please put in one that has at least 1 uppercase letter, 1 lowercase letter, and 1 digit';
    //     return false;
    // }
    if (!form.elements['Pin'].value) {
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
        document.getElementById('alert').textContent = 'Please put in a valid password.';   
        return false;     
    }
    return true;    
}

function validEmailPassword(form) {
    return validateEmail(form) && validatePassword(form);
}

function confirmNames(form) {
    console.log(form.elements['LastName'].value);
    console.log(form.elements['FirstName'].value);
    console.log(noInt(form.elements['FirstName'].value))
    return noInt(form.elements['FirstName'].value) && noInt(form.elements['FirstName'].value) && form.elements['LastName'].value != '' && form.elements['FirstName'].value != '';
}

function noInt(str) {
    return !str.match(/[\w^\s]+\d[\w^\s]+/g);
}

function validateEmailNames(form) {
    if (validateEmail(form)) {
        if (confirmNames(form)) {
            return true;
        }
        document.getElementById('alert').textContent = 'Please put in a correct first and last name.';        
    }
    return false;
}

function confirmEmail (form) {
    var x = form.elements["email"].value;
    console.log(x);
    var atpos = x.indexOf("@");
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
