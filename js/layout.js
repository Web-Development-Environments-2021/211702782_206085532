
function toggleNavBarIcon() {

    const navToggleLabel = document.querySelector('.navToggleLabel');
    navToggleLabel.addEventListener('click', _ => {

        navToggleLabel.classList.toggle('navOpen');
    });
}

function autoAdjustPageStart() {

    let menuHeight = $('.menu').outerHeight() + 10 + 'px'; // 10 px shadow
    let footerHeight = $('.footer').outerHeight() + 10 + 'px'; // 10 px shadow
    const content = $('.content');
    content.css("padding-top", menuHeight);
    content.css("padding-bottom", footerHeight);
}

function navigationHandler(e) {

    let contentDivs = $("#content").children("div");
    let targetRole = $(e.currentTarget).attr("id").replace("nav", "");
    let targetDiv = $("#" + targetRole);

    contentDivs.each((index, div) => {

        let divRole = $(div).attr("id");
        if (divRole != targetRole && !div.classList.contains("hidden")){
            div.classList.add("hidden");
        }
    });

    targetDiv.removeClass("hidden");
}

function navigateToPage() {

    // navAbout has a dedicated function
    let navlinks = $("#menu").find("a:not(#navAbout)");
    navlinks.each((index, link) => {

        $(link).click(navigationHandler);
    });

}

function setButtonOnClick(){

    // welcome page buttons
    
    $("#welcomeRegisterButton").click(() => {

        $("#Welcome").addClass("hidden");
        $("#SignUp").removeClass("hidden");
    });

    $("#welcomeLoginButton").click(() => {

        $("#Welcome").addClass("hidden");
        $("#Login").removeClass("hidden");
    });

}

function addAboutFadeOutHandler(aboutOverlay){

    aboutOverlay[0].style.animation = "aboutFadeOut 500ms forwards";

    aboutOverlay.one("animationend", (e) => {

        aboutOverlay.addClass("hidden");
    });
}

function setAboutModalOnClick(){

    const aboutOverlay = $("#About");

    // open about modal through navigation menu
    
    const navAbout = $("#navAbout");
    navAbout.click((e) => {

        e.preventDefault();
        aboutOverlay.removeClass("hidden");
        aboutOverlay[0].style.animation = "aboutFadeIn 500ms forwards";
    });

    // close about modal through closeIcon

    const closeIcon = $("#aboutCloseIcon");
    closeIcon.click( (e) => {

        addAboutFadeOutHandler(aboutOverlay);
    });

    // close about modal through escape

    $(document).keydown( (e) => {

        const keyCode = e.keyCode ? e.keyCode : e.which;
        
        if (keyCode === 27){
            addAboutFadeOutHandler(aboutOverlay);
        }
    });

    // close about modal through clicking anywhere outside the modal

    $(document).click( (e) => {

        if (e.target == aboutOverlay[0]){
            addAboutFadeOutHandler(aboutOverlay);
        }
    });
}

$(document).ready( _ => {

    // auto adjust page start after header
    autoAdjustPageStart();    
    
    // toggle nav bar icon
    toggleNavBarIcon();

    // nav bar link handlers
    navigateToPage();

    // add onclick listeners for buttons
    setButtonOnClick();

    // add navigation for about modal
    setAboutModalOnClick();
});