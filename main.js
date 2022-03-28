const IFRAME_ELEMENT = ".hs-form-iframe";
const ZIP_ELEMENT = ".hs_cep input";
const CITY_ELEMENT = ".hs_city input";
const STATE_ELEMENT = ".hs_estado___uf select";

function messageFormReadyHandler() {
    let $isInicialized = false;
    return function (event) {
        if ($isInicialized) {
            return false;
        }
        if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
            $zipElement = findElement(ZIP_ELEMENT);
            $zipElement.parent().append($(".loading"));
            let cssLink = document.createElement("link");
            cssLink.href = "./main.css";
            cssLink.rel = "stylesheet";
            cssLink.type = "text/css";
            $(IFRAME_ELEMENT).contents().find("body").append(cssLink);
            $zipElement.on("change", zipCodeInputChangeHandler());
        }
    }
}

function findElement(selector) {
    const $iframe = $(IFRAME_ELEMENT);
    if ($iframe.length > 0) {
        return $iframe.contents().find(selector)
    }
    return $(selector);
}


function zipCodeInputChangeHandler() {
    const $city = findElement(CITY_ELEMENT);
    const $state = findElement(STATE_ELEMENT);
    const $loading = findElement(".loading");
    return function (event) {
        const $cep = event.target;
        $loading.removeClass("d-none");
        $city.removeClass("error");
        $state.removeClass("error");
        $.get(`https://viacep.com.br/ws/${$cep.value}/json/`).done(function (data) {
            if (data.error) {
                $city.val("").change();
                $state.val("").change();
            }
            $city.val(data.localidade).change();
            $state.val(data.uf).change();
        }).fail(function () {
            $city.addClass("error");
            $state.addClass("error");
            $city.val("").change();
            $state.val("").change();
        }).always(function () {
            $loading.addClass("d-none");
        });
    }
}

window.addEventListener('message', messageFormReadyHandler());