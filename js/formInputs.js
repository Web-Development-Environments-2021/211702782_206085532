
// accounts dictionary for current session initialized with default account
let accounts = { 'k' : {
    password: 'k',
    firstname: 'k',
    lastname: 'k',
    email: 'k@k.k',
    birthdate: '1111-11-11'
}};

const specialKeyboardKeys = [
   "Numpad0",
   "NumpadEnter",
   "Numpad1",
   "Numpad2",
   "Numpad3",
   "Numpad4",
   "Numpad5",
   "Numpad6",
   "Numpad7",
   "Numpad8",
   "Numpad9",
   "NumpadMultiply",
   "NumpadAdd",
   "NumpadSubtract",
   "NumpadDecimal",
   "NumpadDivide",
   "ShiftLeft",
   "ShiftRight",
   "ControlLeft",
   "ControlRight",
   "AltLeft",
   "AltRight"
];

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
    $("#25PointsDot").val(getRandomColor());

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
    $("#controlsConfig").find("input").each((index, input) => {

        $(input).keydown( (e) => {
            e.preventDefault();

            if (specialKeyboardKeys.includes(e.code)){
                input.value = e.code;
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
            keyUp = $("#settingsUp").val();
            keyDown = $("#settingsDown").val();
            keyLeft = $("#settingsLeft").val();
            keyRight = $("#settingsRight").val();

            // dot amount
            foodAmount = $("#settingsDotAmount").val();

            // colors
            color5Points = $("#5PointsDot").val();
            color15Points = $("#15PointsDot").val();
            color25Points = $("#25PointsDot").val();

            // duration
            gameTime = $("#settingsDuration").val();

            // ghost amount
            numOfMonsters = $("#settingsGhostAmount").val();

            // update in-game settings display
            $("#inGameUp").text(keyUp);
            $("#inGameDown").text(keyDown);
            $("#inGameLeft").text(keyLeft);
            $("#inGameRight").text(keyRight);

            $("#inGameDotAmount").text(foodAmount);

            $("#inGame5Point").val(color5Points);
            $("#inGame15Point").val(color15Points);
            $("#inGame25Point").val(color25Points);

            $("#inGameDuration").text(gameTime);

            $("#inGameGhostAmount").text(numOfMonsters);
            
            // start game
            $("#gameStarter").trigger("change");

            // navigate to game
            $("#Settings").addClass("hidden");
            $("#GameLayout").removeClass("hidden");
            form.reset();

            return false;
        }
    });
}

function updateInGameSettings(){

}

$(document).ready( _ => {

    validationSetUp();
    verifyLogin();
    configureSettings();


});