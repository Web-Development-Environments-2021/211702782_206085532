
// accounts dictionary for current session initialized with default account
let accounts = { 'k' : {
    password: 'k',
    firstname: 'k',
    lastname: 'k',
    email: 'k@k.k',
    birthdate: '1111-11-11'
}};

const numpadKeyCodes = {
   45 : "Numpad0",
   13 : "NumpadEnter",
   97 : "Numpad1",
   98 : "Numpad2",
   99 : "Numpad3",
   100 : "Numpad4",
   101 : "Numpad5",
   102 : "Numpad6",
   103 : "Numpad7",
   104 : "Numpad8",
   105 : "Numpad9",
   106 : "NumpadMultiply",
   107 : "NumpadAdd",
   109 : "NumpadSubtract",
   110 : "NumpadDecimal",
   111 : "NumpadDivide",
};

const specialKeyboardKeys = {
    16 : { 1 : "ShiftLeft", 2 : "ShiftRight"},
    17 : { 1 : "ControlLeft", 2 : "ControlRight"},
    18 : { 1 : "AltLeft", 2 : "AltRight"},
};

const possibleKeys = ['Backspace', 'Tab', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', '0', '9', '8', '7', '6', '5', '4', '3', '2', '1', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ';', '=', '-', '.', '/', '[', ']']

function validationSetUp() {

    jQuery.validator.addMethod("alphanumeric", function( value, element ) {
        return this.optional( element ) || /^[\w^_]+$/i.test( value );
    }, "Please enter letters and numbers only"
    );

    jQuery.validator.addMethod( "lettersonly", function( value, element ) {
        return this.optional( element ) || /^[a-z]+$/i.test( value );
    }, "Please enter letters only" );

    jQuery.validator.addMethod( "password", function( value, element ) {
        // with at least 8 characters: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#^?&]{8,}$/i
        // also possible: /^(?=.*?[A-Za-z])(?=.*?\d)[A-Za-z\d@$!%*#^?&]+$/.
        return this.optional( element ) || /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#^?&]+$/.test( value );
    }, "Password must contain at least one letter and one digit" );

    $("#registerForm").validate({

        rules: {

            usernameSignUp: "required",

            passwordSignUp: {
                required: true,
                minlength: 6,
                password: true
            },

            firstnameSignUp: {
                required: true,
                lettersonly: true
            },

            lastnameSignUp: {
                required: true,
                lettersonly: true
            },

            emailSignUp: {
                required: true,
                email: true
            },

            birthdateSignUp: "required"

        },
        messages: {
            usernameSignUp: {
                required: "This field is required"
            },

            passwordSignUp: {
                required: "This field is required",
                minlength: "Password must be at least 6 charachters long"
            },

            firstnameSignUp: {
                required: "This field is required"
            },

            lastnameSignUp: {
                required: "This field is required"
            },

            emailSignUp: {
                required: "This field is required",
                email: "Please enter a valid email address"
            },

            birthdateSignUp: {
                required: "This field is required"
            }
        },

        // record new account in accounts dictionary
        submitHandler: function(form) {

            accounts[$("#usernameSignUp").val()] = {

                password: $("#passwordSignUp").val(),
                firstname: $("#firstnameSignUp").val(),
                lastname: $("#lastnameSignUp").val(),
                email: $("#emailSignUp").val(),
                birthdate: $("#birthdateSignUp").val()
            }

            $("#SignUp").addClass("hidden");
            $("#Login").removeClass("hidden");
            
            form.reset();

            return false;
        }
    })
}

function verifyLogin(){

    
    jQuery.validator.addMethod("loginUserExist", function( value, element ) {

        return this.optional( element ) || value in accounts;
    }, "No such username exist"
    );

    jQuery.validator.addMethod("matchingPassword", function( value, element) {

        return this.optional( element ) || (typeof accounts[$("#usernameLogin").val()] === 'undefined' ? false : value === accounts[$("#usernameLogin").val()].password);
    }, "Incorrect password entered"
    );

    $("#loginForm").validate({

        rules: {

            usernameLogin: {
                required: true,
                loginUserExist: true
            },

            passwordLogin: {
                required: true,
                password: false,
                matchingPassword: true
            }
        },

        messages: {

            required: "This field is required"
        },

        submitHandler: function (form) {

            // login page button
            $("#Login").addClass("hidden");
            $("#Settings").removeClass("hidden");
            form.reset();
            return false;
        }
    });
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function randomizeSettings(){

    // controls
    $("#settingsUp").val(possibleKeys[Math.floor(Math.random() * possibleKeys.length)]);
    $("#settingsDown").val(possibleKeys[Math.floor(Math.random() * possibleKeys.length)]);
    $("#settingsLeft").val(possibleKeys[Math.floor(Math.random() * possibleKeys.length)]);
    $("#settingsRight").val(possibleKeys[Math.floor(Math.random() * possibleKeys.length)]);

    // dot amount
    const dotAmount = $("#settingsDotAmount");
    dotAmount.val(Math.floor(Math.random() * 41) + 50); // between 50-90
    dotAmount[0].nextElementSibling.value = dotAmount.val();

    // colors
    $("#5PointsDot").val(getRandomColor());
    $("#15PointsDot").val(getRandomColor());
    $("#20PointsDot").val(getRandomColor());

    // duration
    const duration = $("#settingsDuration");
    duration.val(Math.floor(Math.random() * 61) + 60); // between 60-120
    duration[0].nextElementSibling.value = duration.val();

    // ghost amount
    const ghostAmount = $("#settingsGhostAmount");
    ghostAmount.val(Math.floor(Math.random() * 4) + 1); //between 1-4
    ghostAmount[0].nextElementSibling.value = ghostAmount.val();

}

function configureSettings(){

    // set control configurations
    $("#controlsConfig").find("input change").each((index, input) => {

        $(input).keydown( (e) => {
            e.preventDefault();

            const keyCode = e.keyCode ? e.keyCode : e.which;

            if (keyCode in specialKeyboardKeys){
                input.value = e.code;
            }
            else if (keyCode in numpadKeyCodes){
                input.value = numpadKeyCodes[keyCode];
            }
            else {
                input.value = e.key;
            }
        });
    });

    // set ranged-input output update
    $("#settingsForm").find("input[type=range]").each((index, input) => {

        $(input).on ("input", (e) => {

            input.nextElementSibling.value = input.value;
        });
    });

    // randomize button
    $("#randomizeSettings").click((e) => {
        e.preventDefault();
        randomizeSettings();
    });

    $("#settingsForm").validate({

        submitHandler: (form) => {

            // controls
            $("#settingsUp").val();
            $("#settingsDown").val();
            $("#settingsLeft").val();
            $("#settingsRight").val();

            // dot amount
            $("#settingsDotAmount").val();

            // colors
            document.getElementById("5PointsDot");
            $("#15PointsDot").val();
            $("#20PointsDot").val();

            // duration
            $("#settingsDuration").val();

            // ghost amount
            $("#settingsGhostAmount").val();

            // navigate to game
            $("#Settings").addClass("hidden");
            $("#Game").removeClass("hidden");
            form.reset();

            return false;
        }
    });
}

$(document).ready( _ => {

    validationSetUp();
    verifyLogin();
    configureSettings();


});